const { LOG_LEVEL, LogLevel } = require('./constants')

/**
 * Logs Trace, Debug, Info, and Error messages to the console.
 * @param {LogLevel} level - The log level for this log message
 * @param {String} message - The message for this log message
 * @param {String} component - The component this message is being logged from
 */
function logMsg(level, message, component = "unknown") {

  const configured_log_level = Memory["log_level"]

  const trace_levels = [
    LOG_LEVEL.TRACE
  ]

  const debug_levels = [
    LOG_LEVEL.DEBUG
  ].concat(trace_levels)

  const info_levels = [
    LOG_LEVEL.INFO
  ].concat(debug_levels)

  const error_levels = [
    LOG_LEVEL.ERROR
  ].concat(info_levels)

  /**
   * A closure to standardize the console message output
   * @param {LogLevel} level 
   * @param {String} component 
   * @param {String} message 
   */
  const outputMsg = (level, component, message) => {
    console.log(`${level}\t-\t${component}\n${message}`)
  };

  /// If this is a TRACE message we will output it here
  if (trace_levels.includes(configured_log_level) && trace_levels.includes(level)) {
    outputMsg(level, component, message)
  }

  // If this is a DEBUG message we will output it here
  else if (debug_levels.includes(configured_log_level) && debug_levels.includes(level)) {
    outputMsg(level, component, message)
  }

  // If this is an INFO message we will output it here
  else if (info_levels.includes(configured_log_level) && info_levels.includes(level)) {
    outputMsg(level, component, message)
  }

  // If this is an ERROR message we will output it here
  else if (error_levels.includes(configured_log_level) && error_levels.includes(level)) {
    outputMsg(level, component, message)
  }
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