require('dotenv').config();
const fs = require('fs').promises;
const moment = require('moment');

const JOURNAL_ENTRIES_FILE_PATH = process.env.ENTRIES_FILE_PATH || './journalEntries.json';

async function fetchJournalEntries() {
  try {
    const fileData = await fs.readFile(JOURNAL_ENTRIES_FILE_PATH);
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error retrieving journal entries:', error);
    return [];
  }
}

function calculateMoodFrequencies(entries) {
  const moodFrequency = entries.reduce((frequency, entry) => {
    const { mood } = entry;
    frequency[mood] = (frequency[mood] || 0) + 1;
    return frequency;
  }, {});

  return Object.entries(moodFrequency).sort((a, b) => b[1] - a[1]);
}

function generateMonthlyMoodSummary(entries, month, year) {
  const filteredEntriesByMonth = entries.filter(entry => {
    const entryDate = moment(entry.date, "YYYY-MM-DD");
    return entryDate.month() === month - 1 && entryDate.year() === year;
  });

  const summary = calculateMoodFrequencies(filteredEntriesByMonth);

  return {
    month,
    year,
    totalEntries: filteredEntriesByMonth.length,
    moodSummary: summary
  };
}

function createYearlyMoodTrends(entries) {
  const insightsByYear = {};

  entries.forEach(entry => {
    const entryYear = moment(entry.date, "YYYY-MM-DD").year();
    if (!insightsByYear[entryYear]) insightsByYear[entryYear] = [];

    insightsByYear[entryYear].push(entry);
  });

  Object.keys(insightsByYear).forEach(year => {
    insightsByYear[year] = calculateMoodFrequencies(insightsByYear[year]);
  });

  return insightsByYear;
}

async function executeJournalAnalysis() {
  try {
    const journalEntries = await fetchJournalEntries();

    const march2023Summary = generateMonthlyMoodSummary(journalEntries, 3, 2023);
    console.log("Monthly Mood Summary for March 2023:", march2023Summary);

    const yearlyMoodTrends = createYearlyMoodTrends(journalEntries);
    console.log("Mood Trends Year by Year:", yearlyMoodTrends);
  } catch (error) {
    console.error(error);
  }
}

executeJournalAnalysis();