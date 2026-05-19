const fs = require("fs");
let content = fs.readFileSync("C:\\Users\\Govind\\OneDrive\\Desktop\\factcheck\\factcheck-frontend\\src\\pages\\HowItWorks.js", "utf8");
content = content
  .replace(/\u00f0\u009f\u0093/g, "\uD83D\uDCDD")
  .replace(/\u00c3\u00b7/g, "x")
  .replace(/\u00c3\u0097/g, "x")
  .replace(/\u00c2\u00b7/g, " · ")
  .replace(/\u00e2\u0080\u0093/g, "-")
  .replace(/\u00e2\u0080\u0094/g, "-")
  .replace(/\u00e2\u0086\u0092/g, "->")
  .replace(/\u00e2\u0089\u00a5/g, ">=")
  .replace(/\u00e2\u009c\u0093/g, "✓")
  .replace(/\u00e2\u009c\u0097/g, "✗")
  .replace(/\u00f0\u009f\u0097\u00b3/g, "Vote")
  .replace(/\u00f0\u009f\u0094\u008d/g, "Search")
  .replace(/\u00f0\u009f\u0093\u008a/g, "Chart")
  .replace(/\u00e2\u009b\u0093/g, "Chain")
  .replace(/\u00e2\u0096\u0094/g, "-");
fs.writeFileSync("C:\\Users\\Govind\\OneDrive\\Desktop\\factcheck\\factcheck-frontend\\src\\pages\\HowItWorks.js", content, "utf8");
console.log("DONE");
