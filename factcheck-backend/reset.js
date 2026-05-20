const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/factcheck').then(async () => {
  await mongoose.connection.collection('claims').updateMany({}, { status: 'active', verdict: null });
  await mongoose.connection.collection('votes').deleteMany({});
  console.log('DONE');
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
