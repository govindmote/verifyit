require("dotenv").config();
const mongoose = require("mongoose");
const { storeVerdictOnChain } = require("./blockchainService");
const Claim = require("./models/Claim");

mongoose.connect("mongodb://localhost:27017/factcheck").then(async () => {
  const claims = await Claim.find({ verdict: { $ne: null }, "blockchain.txHash": null });
  console.log("Found", claims.length, "claims to record on-chain");

  for (const c of claims) {
    console.log("Processing:", c.title.slice(0, 40));
    const tv = c.votes?.true || 0;
    const fv = c.votes?.false || 0;
    const result = await storeVerdictOnChain(c._id.toString(), c.title, c.verdict, tv, fv);
    if (result) {
      await Claim.findByIdAndUpdate(c._id, {
        "blockchain.txHash": result.txHash,
        "blockchain.recordedAt": new Date(),
        "blockchain.network": "polygon-amoy",
        status: "recorded"
      });
      console.log("✅ Recorded:", result.txHash);
    } else {
      console.log("❌ Failed for:", c.title.slice(0, 40));
    }
    await new Promise(r => setTimeout(r, 3000));
  }
  console.log("ALL DONE");
  process.exit();
});
