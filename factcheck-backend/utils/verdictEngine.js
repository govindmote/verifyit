const Claim = require("../models/Claim");

/**
 * Decide the verdict from vote tallies.
 * Rules:
 *  - Minimum 3 votes required to reach a verdict
 *  - Whichever option has > 50% of votes wins
 *  - If no option clears 50%, verdict = UNVERIFIED
 */
function calculateVerdict(votes, totalVotes) {
  if (totalVotes < 3) return "UNVERIFIED"; // not enough participation

  const truePercent = votes.true / totalVotes;
  const falsePercent = votes.false / totalVotes;
  const unverifiedPercent = votes.unverified / totalVotes;

  if (truePercent > 0.5) return "TRUE";
  if (falsePercent > 0.5) return "FALSE";
  // No majority → fallback
  // Pick the highest, or UNVERIFIED if tied
  const max = Math.max(truePercent, falsePercent, unverifiedPercent);
  if (truePercent === max && truePercent > falsePercent) return "TRUE";
  if (falsePercent === max && falsePercent > truePercent) return "FALSE";
  return "UNVERIFIED";
}

/**
 * Cron job: find all active claims past their deadline, settle them.
 */
async function settleExpiredClaims() {
  try {
    const expired = await Claim.find({
      status: "active",
      votingDeadline: { $lte: new Date() },
    });

    if (expired.length === 0) {
      console.log("   No claims to settle.");
      return;
    }

    for (const claim of expired) {
      const verdict = calculateVerdict(claim.votes, claim.totalVotes);
      claim.verdict = verdict;
      claim.status = "settled"; // moves to "recorded" after blockchain tx
      await claim.save();
      console.log(`   Settled claim "${claim.title}" → ${verdict}`);
    }

    console.log(`   ✅ Settled ${expired.length} claim(s).`);
  } catch (err) {
    console.error("   ❌ Error settling claims:", err.message);
  }
}

module.exports = { calculateVerdict, settleExpiredClaims };
