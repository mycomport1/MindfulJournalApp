require('dotenv').config();
const fs = require('fs');
const moment = require('moment');

const JOURNAL_ENTRIES_FILE_PATH = process.env.ENTRIES_FILE_PATH || './journalEntries.json';

function readJournalEntriesFromFile() {
  try {
    const fileData = fs.readFileSync(JOURNAL_ENTRIES_FILE_PATH);
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error loading journal entries:', error);
    return [];
  }
}

function tallyMoodsFromEntries(entries) {
  const moodTally = entries.reduce((accumulator, currentEntry) => {
    if (accumulator[currentEntry.mood]) {
      accumulator[currentEntry.mood]++;
    } else {
      accumulator[currentEntry.mood] = 1;
    }
    return accumulator;
  }, {});

  const moodsSortedByCount = Object.entries(moodTally).sort((firstMood, secondMood) => secondMood[1] - firstMood[1]);

  return moodsSortedByCount;
}

function createMonthlyMoodReport(entries, month, year) {
  const monthSpecificEntries = entries.filter(entry => {
    const entryDate = moment(entry.date, "YYYY-MM-DD");
    return entryDate.month() === month - 1 && entryDate.year() === year;
  });

  const moodReport = tallyMoodsFromEntries(monthSpecificEntries);

  return {
    month,
    year,
    totalEntries: monthSpecificEntries.length,
    moodReport
  };
}

function generateYearlyMoodInsights(entries) {
  const yearlyInsights = {};

  entries.forEach(entry => {
    const entryYear = moment(entry.date, "YYYY-MM-DD").year();
    if (!yearlyInsights[entryYear]) yearlyInsights[entryYear] = [];

    yearlyInsights[entryYear].push(entry);
  });

  Object.keys(yearlyInsights).forEach(year => {
    yearlyInsights[year] = tallyMoodsFromEntries(yearlyInsights[year]);
  });

  return yearlyInsights;
}

async function runJournalAnalysis() {
  const journalEntries = readJournalEntriesFromFile();
  
  const march2023Report = createMonthlyMoodReport(journalEntries, 3, 2023);
  console.log("Monthly Mood Report for March 2023:", march2023Report);

  const moodTrendInsights = generateYearlyMoodInsights(journalEntries);
  console.log("Mood Trends Insights Over the Years:", moodTrendInsights);
}

runJournalAnalysis().catch(console.error);