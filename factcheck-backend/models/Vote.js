const mongoose = require("mongoose");
const voteSchema = new mongoose.Schema(
  {
    claimId: { type: mongoose.Schema.Types.ObjectId, ref: "Claim", required: true },
    voterAddress: { type: String, required: true },
    choice: { type: String, enum: ["true", "false", "unverified"], required: true },
    weight: { type: Number, default: 1.0 },
  },
  { timestamps: true }
);
voteSchema.index({ claimId: 1, voterAddress: 1 }, { unique: true });
module.exports = mongoose.model("Vote", voteSchema);
