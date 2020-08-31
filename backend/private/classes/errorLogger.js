/**
 * This class handles the logging of errors/messages
 * All logs will be found at ./logs
 */
const path = require("path");
const winston = require('winston');
  require('winston-daily-rotate-file');
 
const logFormat =  winston.format.combine(
   winston.format.colorize(),
   winston.format.timestamp(),
   winston.format.align(),
   winston.format.printf(
      info=>`${info.timestamp} ${info.level} ${info.message}`
   )
);

const transport = new (winston.transports.DailyRotateFile)({
   filename: 'application-%DATE%.log',
   datePattern: 'YYYY-MM-DD',
   zippedArchive: true,
   maxSize: '20m',
   dirname: path.resolve(__dirname,"..","..","logs")
});

const logger = winston.createLogger({
   format: logFormat,
   transports: [
     transport
   ]
});
 
class ServerLogger {
   /**
    * Write error to the log file 
    * @param {string} errorMsg - error message
    * @param {method} stacktrace - error stacktrace
    */
   static writeErrorsToLog(errorMsg, stacktrace) {
      let logMsg = "\tERROR MSG :=> " + errorMsg;
      logMsg += "\n\tSTACKTRACE:" + stacktrace;

     //naming convention: current log file is named log_current
      //ALGORITHM for rotating log files based on time
      logger.log("error",logMsg);
   }
}

//export
module.exports = ServerLogger;
