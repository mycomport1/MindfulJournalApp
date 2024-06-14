const express = require('express');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const { ObjectID } = require('mongodb');

const uri = process.env.DATABASE_URI;
let db;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error('Failed to connect to the database', err);
        return;
    }
    console.log('Connected to Database');
    db = client.db('MindfulJournalApp');
});

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.post('/entries', (req, res) => {
    const entry = req.body;
    db.collection('journalEntries').insertOne(entry, (err, result) => {
        if (err) {
            console.error('Failed to add entry:', err);
            res.status(500).send('Failed to add entry.');
            return;
        }
        console.log('Entry added:', result.ops[0]);
        res.status(200).send('Entry added successfully.');
    });
});

app.get('/entries', (req, res) => {
    db.collection('journalEntries').find().toArray((err, items) => {
        if (err) {
            console.error('Failed to get entries:', err);
            res.status(500).send('Failed to get entries.');
            return;
        }
        console.log('Retrieved entries.');
        res.status(200).json(items);
    });
});

app.put('/entries/:id', (req, res) => {
    const { id } = req.params;
    const details = { '_id': new ObjectID(id) };
    const update = { $set: req.body };

    db.collection('journalEntries').updateOne(details, update, (err, result) => {
        if (err) {
            console.error('Failed to update entry:', err);
            res.status(500).send('Failed to update entry.');
            return;
        }
        console.log(`Entry updated with id: ${id}`);
        res.status(200).send('Entry updated successfully.');
    });
});

app.delete('/entries/:id', (req, res) => {
    const { id } = req.params;
    const details = { '_id': new ObjectID(id) };

    db.collection('journalEntries').deleteOne(details, (err, result) => {
        if (err) {
            console.error('Failed to delete entry:', err);
            res.status(500).send('Failed to delete entry.');
            return;
        }
        console.log(`Entry deleted with id: ${id}`);
        res.status(200).send('Entry deleted successfully.');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});