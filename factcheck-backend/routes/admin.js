const express = require("express");
const router = express.Router();
const Claim = require("../models/Claim");

router.post("/override", async (req, res) => {
  try {
    const { claimId, verdict, reason, adminKey } = req.body;
    if (adminKey !== "VERIFYIT_ADMIN_2024") return res.status(403).json({ error: "Unauthorized" });
    if (!["TRUE","FALSE","UNVERIFIED"].includes(verdict)) return res.status(400).json({ error: "Invalid verdict" });
    const claim = await Claim.findByIdAndUpdate(claimId, {
      verdict,
      status: "settled",
      adminOverride: { reason, overriddenAt: new Date(), by: "admin" }
    }, { new: true });
    if (!claim) return res.status(404).json({ error: "Claim not found" });
    res.json({ success: true, claim });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
