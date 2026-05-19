const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/factcheck").then(async () => {
  const Claim = require("./models/Claim");
  const res = await Claim.updateMany(
    { submittedBy: { $nin: ["Atharva", "vikas", "govind"] } },
    { submittedBy: "govind" }
  );
  console.log("Updated:", res.modifiedCount, "claims to govind");
  process.exit();
});
