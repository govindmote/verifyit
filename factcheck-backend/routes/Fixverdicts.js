const mongoose = require('mongoose');
const Claim = require('./models/Claim');

mongoose.connect('mongodb://localhost:27017/factcheck')
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    const claims = await Claim.find({});
    let updated = 0;

    for (const claim of claims) {
      const tv = claim.votes?.true || 0;
      const fv = claim.votes?.false || 0;
      const total = tv + fv;

      if (total >= 3) {
        let verdict = null;
        if (tv > fv * 1.5) verdict = 'true';
        else if (fv > tv * 1.5) verdict = 'false';

        if (verdict) {
          await Claim.findByIdAndUpdate(claim._id, { verdict });
          console.log(`✅ Updated: "${claim.title.slice(0,40)}" → ${verdict.toUpperCase()} (${tv}T / ${fv}F)`);
          updated++;
        } else {
          console.log(`⏳ Too close to call: "${claim.title.slice(0,40)}" (${tv}T / ${fv}F)`);
        }
      } else {
        console.log(`⚠️  Not enough votes: "${claim.title.slice(0,40)}" (${total} votes)`);
      }
    }

    console.log(`\n🎉 Done! Updated ${updated} claims.`);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ DB connection failed:', err.message);
    console.log('👉 Try changing the connection string to your actual MongoDB URI');
    process.exit(1);
  });