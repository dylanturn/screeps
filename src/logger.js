const { LOG_LEVEL, LogLevel } = require('./constants')

/**
 * Logs Trace, Debug, Info, and Error messages to the console.
 * @param {LogLevel} level - The log level for this log message
 * @param {String} message - The message for this log message
 * @param {String} component - The component this message is being logged from
 */
function logMsg(level, message, component = "unknown") {

  const configured_log_level = Memory["log_level"]

  /**
   * A closure to standardize the console message output
   * @param {LogLevel} level 
   * @param {String} component 
   * @param {String} message 
   */
  
  // Make sure the log level is in scope
  if(level <= configured_log_level){
    return
  }

  // If the message is of the right level, then print.
  console.log(`${level} - ${component} - ${message}`)
}

/**
 * Logs Trace, Debug, Info, and Error messages to the console.
 * @param {LogLevel} level - The log level for this log message
 * @param {String} message - The message for this log message
 * @param {String} component - The component this message is being logged from
 */
module.exports = {
  LogMsg(level, message) {
    logMsg(level, message)
  }
}