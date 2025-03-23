import winston from 'winston';

const logger = winston.createLogger({
  level: 'info', // default logging level
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),  // Log to console
    new winston.transports.File({ filename: 'logs/app.log' }) // Log to a file
  ],
});

export { logger };
