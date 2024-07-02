require('dotenv').config();
const nodemailer = require('nodemailer');
const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  secure: false, // true for 465, false for other ports
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});
const sendEmailNotification = async (to, subject, text) => {
  const mailOptions = {
    from: `"MindfulJournalApp" <${emailUser}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
const sendJournalReminder = (userEmail) => {
  sendEmailNotification(
    userEmail,
    'Journal Entry Reminder',
    'Hey there! Just a gentle reminder to make your journal entry for today. Take a moment to reflect and jot down your thoughts.',
  );
};
const sendMoodTrackingPrompt = (userEmail) => {
  sendEmailNotification(
    userEmail,
    'How are you feeling today?',
    "Don't forget to track your mood today. It helps to see patterns over time and manage your well-being better.",
  );
};
const sendCustomNotification = (userEmail, subject, message) => {
  sendEmailNotification(userEmail, subject, message);
};