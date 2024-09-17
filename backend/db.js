// backend/db.js

const mysql = require('mysql2');
const dotenv = require('dotenv');
const { debugLog, debugError } = require('./logger');

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) {
    debugError('Error connecting to the database:', err); // Use debugError for logging errors
  } else {
    debugLog('Connected to the MySQL database.'); // Use debugLog for successful connection
  }
});
// const mysql = require("mysql2");
// const dotenv = require("dotenv");

// dotenv.config();
// console.log("DB_DATABASE:", process.env.DB_DATABASE);
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database:", err);
//   } else {
//     console.log("Connected to the MySQL database.");
//     // Select the database
//     db.query("USE " + process.env.DB_DATABASE, (err, result) => {
//       if (err) {
//         console.error("Error selecting database:", err);
//       } else {
//         console.log("Database selected successfully.");
//       }
//     });
//   }
// });

module.exports = db;
