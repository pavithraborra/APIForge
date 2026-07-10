require('dotenv').config();
const mongoose = require('mongoose');

const unseedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Unseeding');

    // Drop all collections
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
      console.log(`Dropped collection: ${collection.collectionName}`);
    }

    console.log('Database successfully unseeded. It is now empty.');
    process.exit();
  } catch (error) {
    console.error('Error unseeding database:', error);
    process.exit(1);
  }
};

unseedDB();
