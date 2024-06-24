require('dotenv').config();
const fs = require('fs');
const moment = require('moment');

const ENTRIES_FILE_PATH = process.env.ENTRIES_FILE_PATH || './journalEntries.json';

function loadJournalEntries() {
  try {
    const data = fs.readFileSync(ENTRIES_FILE_PATH);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading journal entries:', error);
    return [];
  }
}

function analyzeMoodData(entries) {
  const moodCounts = entries.reduce((acc, entry) => {
    if (acc[entry.mood]) {
      acc[entry.mood]++;
    } else {
      acc[entry.mood] = 1;
    }
    return acc;
  }, {});

  const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);

  return sortedMoods;
}

function generateMonthlyReport(entries, month, year) {
  const filteredEntries = entries.filter(entry => {
    const entryDate = moment(entry.date, "YYYY-MM-DD");
    return entryDate.month() === month - 1 && entryDate.year() === year;
  });

  const moodAnalysis = analyzeMoodData(filteredEntries);

  return {
    month,
    year,
    totalEntries: filteredEntries.length,
    moodAnalysis
  };
}

function provideInsights(entries) {
  const insights = {};

  entries.forEach(entry => {
    const year = moment(entry.date, "YYYY-MM-DD").year();
    if (!insights[year]) insights[year] = [];

    insights[year].push(entry);
  });

  Object.keys(insights).forEach(year => {
    insights[year] = analyzeMoodData(insights[year]);
  });

  return insights;
}

async function main() {
  const journalEntries = loadJournalEntries();
  
  const monthlyReport = generateMonthlyReport(journalEntries, 3, 2023);
  console.log("Monthly Report for March 2023:", monthlyReport);

  const mentalHealthInsights = provideInsights(journalEntries);
  console.log("Mental Health Trends:", mentalHealthInsights);
}

main().catch(console.error);