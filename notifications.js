require('dotenv').config();
const nodemailer = require('nodemailer');

const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS
} = process.env;

const emailTransporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false, // Consider setting this to true if you're using port 465 for secure SMTP
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

const sendEmail = async (recipientEmail, emailSubject, emailBody) => {
  const emailOptions = {
    from: `"MindfulJournalApp" <${EMAIL_USER}>`,
    to: recipientEmail,
    subject: emailSubject,
    text: emailBody
  };

  try {
    await emailTransportation.sendMail(emailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

const remindJournalEntry = recipientEmail => {
  sendEmail(recipientEmail,
            'Journal Entry Reminder',
            'Hey there! Just a gentle reminder to make your journal entry for today. Take a moment to reflect and jot down your thoughts.');
};

const promptMoodTracking = recipientEmail => {
  sendEmail(recipientEmail,
            'How are you feeling today?',
            "Don’t forget to track your mood today. It helps to see patterns over time and manage your well-being better.");
};

const sendNotificationWithEmail = (recipientEmail, notificationSubject, notificationMessage) => {
  sendNewsEmail(recipientEmail, notificationSubject, notificationAssignment);
};