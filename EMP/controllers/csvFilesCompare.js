const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

// Define the file paths for the two CSV files
const oldCsvPath = path.join(__dirname, '..', 'utils', 'old.csv');
const newCsvPath = path.join(__dirname, '..', 'utils', 'new.csv');

// Read the contents of the old CSV file
const oldCsvContents = fs.readFileSync(oldCsvPath, 'utf8');

// Parse the old CSV file
const oldCsv = Papa.parse(oldCsvContents, {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
}).data;

// Read the contents of the new CSV file
const newCsvContents = fs.readFileSync(newCsvPath, 'utf8');

// Parse the new CSV file
const newCsv = Papa.parse(newCsvContents, {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
}).data;

// Get the column names from each CSV file
const oldColumns = Object.keys(oldCsv[0]);
const newColumns = Object.keys(newCsv[0]);

// Find the common column names
const commonColumns = oldColumns.filter(column => newColumns.includes(column));

// Log the common column names
// console.log(commonColumns);