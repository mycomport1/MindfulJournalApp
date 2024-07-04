require('dotenv').config();
const nodemailer = require('nodemailer');

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const sendEmailNotification = async (to, subject, text) => {
  const mailOptions = {
    from: `"MindfulJournalApp" <${EMAIL_USER}>`,
    to,
    subject,
    text,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const sendJournalReminder = userEmail => {
  sendEmailNotification(
    userEmail,
    'Journal Entry Reminder',
    'Hey there! Just a gentle reminder to make your journal entry for today. Take a moment to reflect and jot down your thoughts.',
  );
};

const sendMoodTrackingPrompt = userEmail => {
  sendEmailNotification(
    userEmail,
    'How are you feeling today?',
    "Don’t forget to track your mood today. It helps to see patterns over time and manage your well-being better.",
  );
};

const sendCustomNotification = (userEmail, subject, message) => {
  sendEmailNotification(userEmail, subject, message);
};