require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(express.json());

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send("Error registering new user.");
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser && await bcrypt.compare(password, existing TEXStUser.password)) {
      const accessToken = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ accessToken });
    } else {
      res.status(401).send("Authentication failed");
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

app.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send("Error fetching user details.");
  }
});

app.put('/user/:id', async (req, res) => {
  try {
    const { username, password } = req.body;
    const newHashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { username, password: newHashedPassword }, { new: true });

    if(updatedUser) {
      res.status(200).send("User updated successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send("Error updating user details.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));