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
    try {
        log('Connecting to database...');
        await client.connect();
        log('Database connection established.');
        return client.db(dbName).collection(collectionName);
    } catch (err) {
        throw new Error(`Failed to connect to the database: ${err.message}`);
    }
};

const addMoodRating = async (rating) => {
    try {
        log('Adding new mood rating...');
        const collection = await connectDB();
        const result = await collection.insertOne(rating);
        log('Mood rating added successfully.');
    } catch (err) {
        log(`An error occurred while adding mood rating: ${err.message}`);
        // More detailed error handling can go here if needed
        throw err; // To make sure the error is propagated up and can be handled or logged by upstream processes or error logging systems
    } finally {
        await client.close();
        log('Database connection closed.');
    }
};

const getMoodData = async () => {
    try {
        log('Fetching mood data...');
        const collection = await connectPG();
        const moodData = await collection.find({}).toArray();
        log('Mood data fetched successfully.');
        return moodData;
    } catch (err) {
        log(`An error occurred while fetching mood data: ${err.message}`);
        throw err;
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
        throw err;
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