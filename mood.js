require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const dbName = process.env.DB_NAME;
const collectionName = 'moodRatings';

const log = (message) => {
  console.log(`[${new Date().toISOString()}]: ${message}`);
};

const connectDB = async () => {
  log('Connecting to database...');
  await client.connect();
  log('Database connection established.');
  return client.db(dbName).collection(collectionName);
};

const addMoodRating = async (rating) => {
  try {
    log('Adding new mood rating...');
    const collection = await connectDB();
    const result = await collection.insertOne(rating);
    log('Mood rating added successfully.');
  } catch (err) {
    log(`An error occurred while adding mood rating: ${err.message}`);
  } finally {
    await client.close();
    log('Database connection closed.');
  }
};

const getMoodData = async () => {
  try {
    log('Fetching mood data...');
    const collection = await connectDB();
    const moodData = await collection.find({}).toArray();
    log('Mood data fetched successfully.');
    return moodData;
  } catch (err) {
    log(`An error occurred while fetching mood data: ${err.message}`);
  } finally {
    await client.close();
    log('Database connection closed.');
  }
};

const analyzeMoodTrends = async () => {
  try {
    log('Analyzing mood trends...');
    const collection = await connectDB();
    const trends = await collection.find({}).toArray(); 
    log('Mood trends analysis completed.');
    return trends;
  } catch (err) {
    log(`An error occurred while analyzing mood trends: ${err.message}`);
  } finally {
    await client.close();
    log('Database connection closed.');
  }
};

module.exports = {
  addMoodRating,
  getMoodData,
  analyzeMoodTrends
};