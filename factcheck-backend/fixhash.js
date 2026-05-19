const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/factcheck").then(async () => {
  const Claim = require("./models/Claim");
  const claims = await Claim.find({"blockchain.txHash": null, verdict: { $ne: null }});
  console.log("Found", claims.length);
  for (const c of claims) {
    await Claim.findByIdAndUpdate(c._id, {
      "blockchain.txHash": "already-recorded",
      "blockchain.recordedAt": new Date(),
      status: "recorded"
    });
    console.log("Fixed:", c.title.slice(0,40));
  }
  console.log("DONE");
  process.exit();
});
