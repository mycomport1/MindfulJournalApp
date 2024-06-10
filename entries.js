const express = require('express');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = process.env.DATABASE_URI;
let db;
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) return console.error(err);
  console.log('Connected to Database');
  db = client.db('MindfulJournalApp');
});

const app = express();
app.use(express.json());

app.post('/entries', (req, res) => {
  const entry = req.body;
  db.collection('journalEntries').insertOne(entry, (err, result) => {
    if (err) {
      res.status(500).send('Failed to add entry.');
    } else {
      res.status(200).send('Entry added successfully.');
    }
  });
});

app.get('/entries', (req, res) => {
  db.collection('journalEntries').find().toArray((err, items) => {
    if (err) {
      res.status(500).send('Failed to get entries.');
    } else {
      res.status(200).json(items);
    }
  });
});

app.put('/entries/:id', (req, res) => {
  const { id } = req.params;
  const details = { '_id': new require('mongodb').ObjectID(id) };
  const update = { $set: req.body };
  db.collection('journalEntries').updateOne(details, update, (err, result) => {
    if (err) {
      res.status(500).send('Failed to update entry.');
    } else {
      res.status(200).send('Entry updated successfully.');
    }
  });
});

app.delete('/entries/:id', (req, res) => {
  const { id } = req.params;
  const details = { '_id': new require('mongodb').ObjectID(id) };
  db.collection('journalEntries').deleteOne(details, (err, result) => {
    if (err) {
      res.status(500).send('Failed to delete entry.');
    } else {
      res.status(200).send('Entry deleted successfully.');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});