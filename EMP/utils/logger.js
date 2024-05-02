const winston = require('winston');
const { combine, timestamp, printf } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const getLogger = (filename) => {
  return winston.createLogger({
    format: combine(timestamp(), logFormat),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: `logs/${filename}.error.log`, level: 'error' }),
      new winston.transports.File({ filename: `logs/${filename}.combined.log` }),
    ],
  });
};

module.exports = getLogger;