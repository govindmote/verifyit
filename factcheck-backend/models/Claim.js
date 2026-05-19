const mongoose = require("mongoose");
const claimSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    sourceUrl: { type: String, trim: true, default: "" },
    submittedBy: { type: String, default: "anonymous" },
    votingDeadline: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) },
    votes: {
      true: { type: Number, default: 0 },
      false: { type: Number, default: 0 },
      unverified: { type: Number, default: 0 },
    },
    totalVotes: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "settled", "recorded"], default: "active" },
    verdict: { type: String, enum: ["TRUE", "FALSE", "UNVERIFIED", null], default: null },
    blockchain: {
      txHash: { type: String, default: null },
      network: { type: String, default: "polygon-amoy" },
      recordedAt: { type: Date, default: null },
    },
    adminOverride: {
      reason: { type: String, default: null },
      overriddenAt: { type: Date, default: null },
      by: { type: String, default: null },
      originalVerdict: { type: String, default: null },
    },
  },
  { timestamps: true }
);
claimSchema.index({ title: "text", description: "text" });
module.exports = mongoose.model("Claim", claimSchema);
