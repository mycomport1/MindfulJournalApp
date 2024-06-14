require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const dbName = process.env.DB_NAME;
const collectionName = 'moodRatings';

const connectDB = async () => {
  await client.connect();
  return client.db(dbName).collection(collectionName);
};

const addMoodRating = async (rating) => {
  try {
    const collection = await connectDB();
    const result = await collection.insertOne(rating);
  } catch (err) {
  } finally {
    await client.close();
  }
};

const getMoodData = async () => {
  try {
    const collection = await connectDB();
    const moodData = await collection.find({}).toArray();
    return moodData;
  } catch (err) {
  } finally {
    await client.close();
  }
};

const analyzeMoodTrends = async () => {
  try {
    const collection = await connectDB();
    const trends = await collection.find({}).toArray(); 
    return trends;
  } catch (err) {
  } finally {
await client.close();  }
};

module.exports = {
  addMoodRating,
  getMoodData,
  analyzeMoodTrends
};