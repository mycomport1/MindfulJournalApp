const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const JournalEntrySchema = new mongoose.Schema({
  userId: String,
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
  mood: Number,
});

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, 
});

const JournalEntry = mongoose.model('JournalEntry', JournalEntrySchema);
const User = mongoose.model('User', UserSchema);

app.get('/journal-entries', async (req, res) => {
  try {
    const entries = await JournalEntry.find();
    res.json(entries);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/journal-entries', async (req, res) => {
  const newEntry = new JournalEntry(req.body);
  try {
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/users', async (req, res) => {
  const newUser = new User(req.body);
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.use('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));