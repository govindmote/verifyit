const express = require("express");
const router = express.Router();
const Vote = require("../models/Vote");
const Claim = require("../models/Claim");
const User = require("../models/User");
const { storeVerdictOnChain } = require("../blockchainService");

router.post("/", async (req, res) => {
  try {
    const { claimId, voterAddress, choice } = req.body;
    if (!claimId || !voterAddress || !choice) {
      return res.status(400).json({ error: "claimId, voterAddress, and choice are required" });
    }
    const validChoices = ["true", "false", "unverified"];
    if (!validChoices.includes(choice)) {
      return res.status(400).json({ error: "choice must be true, false, or unverified" });
    }
    const claim = await Claim.findById(claimId);
    if (!claim) return res.status(404).json({ error: "Claim not found" });
    const existing = await Vote.findOne({ claimId, voterAddress });
    if (existing) {
      return res.status(409).json({ error: "You have already voted on this claim" });
    }

    // Get voter reputation weight
    const user = await User.findOne({ username: voterAddress });
    const weight = user ? Math.max(0.1, Math.min(5.0, user.reputation)) : 1.0;

    await Vote.create({ claimId, voterAddress, choice, weight });

    const updateField = `votes.${choice}`;
    const updated = await Claim.findByIdAndUpdate(
      claimId,
      { $inc: { [updateField]: weight, totalVotes: 1 } },
      { new: true }
    );

    const tv = updated.votes.true || 0;
    const fv = updated.votes.false || 0;
    const total = tv + fv;
    let verdict = null;
    if (total >= 3) {
      const pct = tv / total;
      if (pct >= 0.6) verdict = "TRUE";
      else if (pct <= 0.4) verdict = "FALSE";
      else verdict = "UNVERIFIED";
    }
    if (verdict) {
      await Claim.findByIdAndUpdate(claimId, { verdict, status: "settled" });
      // Update reputation for all voters on this claim
      const allVotes = await Vote.find({ claimId });
      for (const v of allVotes) {
        const correct = v.choice.toUpperCase() === verdict;
        await User.findOneAndUpdate(
          { username: v.voterAddress },
          {
            $inc: {
              reputation: correct ? 0.1 : -0.05,
              totalVotes: 1,
              correctVotes: correct ? 1 : 0
            }
          }
        );
      }
      console.log(`Verdict reached: ${verdict} for claim: ${claimId}`);
      storeVerdictOnChain(claimId, updated.title, verdict, tv, fv).then(async (result) => {
        if (result) {
          await Claim.findByIdAndUpdate(claimId, {
            "blockchain.txHash": result.txHash,
            "blockchain.recordedAt": new Date(),
            "blockchain.network": "polygon-amoy",
            status: "recorded"
          });
          console.log(`On-chain recorded: ${result.txHash}`);
        }
      }).catch(err => console.error("Blockchain error:", err.message));
    }
    res.status(201).json({ success: true, message: "Vote recorded", verdict, claimId, weight });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "You have already voted on this claim" });
    }
    res.status(500).json({ error: err.message });
  }
});

router.get("/:claimId", async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.claimId).select("votes totalVotes verdict status blockchain");
    if (!claim) return res.status(404).json({ error: "Claim not found" });
    res.json({ votes: claim.votes, totalVotes: claim.totalVotes, verdict: claim.verdict, status: claim.status, blockchain: claim.blockchain });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/check/:claimId/:address", async (req, res) => {
  try {
    const vote = await Vote.findOne({
      claimId: req.params.claimId,
      voterAddress: req.params.address.toLowerCase(),
    });
    res.json({ voted: !!vote, choice: vote?.choice || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/user/:address", async (req, res) => {
  try {
    const votes = await Vote.find({ voterAddress: req.params.address });
    res.json({ votes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

