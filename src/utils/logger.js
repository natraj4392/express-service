import fs from 'fs';
import winston, { format } from 'winston';

import 'winston-daily-rotate-file';

// Use LOG_DIR from env
const LOG_DIR = process.env.LOG_DIR || 'logs';

// Create log directory if it does not exist
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

/**
 * Create a new winston logger.
 */
export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: format.combine(format.colorize(),format.timestamp(), format.simple()),
      level: 'info'
    }),
    new winston.transports.DailyRotateFile({
      format: format.combine(format.timestamp(), format.json()),
      maxFiles: '14d',
      level: "debug",
      dirname: LOG_DIR,
      datePattern: 'YYYY-MM-DD',
      filename: '%DATE%-debug.log'
    }),
    new winston.transports.DailyRotateFile({
      format: format.combine(format.timestamp(), format.json()),
      maxFiles: '14d',
      level: "error",
      dirname: LOG_DIR,
      datePattern: 'YYYY-MM-DD',
      filename: '%DATE%-error.log'
    }),
    new winston.transports.DailyRotateFile({
      format: format.combine(format.timestamp(), format.json()),
      maxFiles: '14d',
      level: "info",
      dirname: LOG_DIR,
      datePattern: 'YYYY-MM-DD',
      filename: '%DATE%-info.log'
    })
  ]
});

/**
 * Function to push info msg.
 * 
 * @param {Object} msg
 * @param {Object} span
 */
export function info(msg, span)
{
  logger.info({"message":msg});
  logSpan(span,"info",msg);
}

/**
 * Function to push error msg.
 * 
 * @param {Object} msg
 * @param {Object} span
 */
export function error(msg, span)
{
  logger.error({"message":msg});
  logSpan(span,"error",msg);
}

/**
 * Private function for Span log.
 * 
 * @param {Object} span
 * @param {string} level
 * @param {string} msg
 */
const logSpan=(span, level,msg)=>{
  if(span!==null&& span!==undefined && span.log!==undefined)
  {
    try{
    span.log({
      level:level,
      message:msg
    });
  }
  catch(ex)
  {
    error("Span log function is undefiend"+ex);
  }
  }
};


