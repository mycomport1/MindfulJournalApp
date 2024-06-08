const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const JournalEntrySchema = new mongoose.Schema({
  userId: String,
  title: String,
  content: String,
  entryDate: { type: Date, default: Date.now },
  moodScore: Number,
});

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const JournalEntryModel = mongoose.model('JournalEntry', JournalEntrySchema);
const UserModel = mongoose.model('User', UserSchema);

// Cache Wrapper
function cacheFunction(fn) {
  const cache = {};
  return async function(...args) {
    const key = JSON.stringify(args);
    if (!cache[key]) {
      cache[key] = await fn.apply(this, args);
    }
    return cache[key];
  };
}

// Example function to use with caching (hypothetical)
async function calculateMoodScoreAnalysis(userId) {
  // Simulate a heavy operation
  console.log(`Calculating mood score for user: ${userId}`);
  return { userId, analysis: "Positive" }; // Example result
}

const cachedMoodScoreAnalysis = cacheFunction(calculateMoodScoreAnalysis);

app.get('/journal-entries', async (req, res) => {
  try {
    const journalEntries = await JournalEntryModel.find();
    res.json(journalEntries);
  } catch (error) {
    res.status(500).send('Internal Server Error: Unable to fetch journal entries.');
  }
});

app.post('/journal-entries', async (req, res) => {
  const newJournalEntry = new JournalEntryModel(req.body);
  try {
    const savedJournalEntry = await newJournalEntry.save();
    res.status(201).json(savedJournalEntry);
  } catch (error) {
    res.status(500).send('Internal Server Error: Failed to save new journal entry.');
  }
});

app.get('/users', async (req, res) => {
  try {
    const userList = await UserModel.find();
    res.json(userList);
  } catch (error) {
    res.status(500).send('Internal Server Error: Unable to fetch users.');
  }
});

app.post('/users', async (req, res) => {
  const newUser = new UserModel(req.body);
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).send('Internal Server Error: Failed to create new user.');
  }
});

app.use('*', (req, res) => {
  res.status(404).send('404 Not Found: The requested resource could not be found.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));