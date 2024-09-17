// src/logger.js
const isDebugEnabled = process.env.REACT_APP_DEBUG === 'true';

const debugLog = (...args) => {
  if (isDebugEnabled) {
    console.log(...args);
  }
};

const debugError = (...args) => {
  if (isDebugEnabled) {
    console.error(...args);
  }
};

module.exports = { debugLog, debugError };
