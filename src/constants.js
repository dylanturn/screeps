/**
 * @typedef {String} BuildPlotSearchTimeout
 * @typedef {String} BuildPlotSearchOutOfBounds
 * @typedef {String} DepositEnergy
 * @typedef {String} WithdrawEnergy
 * @typedef {String} CreepRoles
 * @typedef {String} Heading
 * @typedef {String} LogLevel
 */

module.exports = Object.freeze({

  /**
   * Enum for BUILD_PLOT_SEARCH_TIMEOUT values.
   * @enum {BuildPlotSearchTimeout}
  */
  BUILD_PLOT_SEARCH_TIMEOUT: "😞",


  /**
   * Enum for BUILD_PLOT_SEARCH_OUT_OF_BOUNDS values.
   * @enum {BuildPlotSearchOutOfBounds}
  */
  BUILD_PLOT_SEARCH_OUT_OF_BOUNDS: "📦",


  /**
   * Enum for DEPOSIT_ENERGY values.
   * @enum {DepositEnergy}
  */
  DEPOSIT_ENERGY: 'deposit_energy',


  /**
   * Enum for WITHDRAW_ENERGY values.
   * @enum {WithdrawEnergy}
  */
  WITHDRAW_ENERGY: 'withdraw_energy',


  /**
   * Enum for CREEP_ROLES values.
   * @enum {CreepRoles}
  */
  CREEP_ROLES: {
    HARVESTER: "🌽",
    BUILDER: "🔨",
    TRANSPORTER: "🚚",
    WORKER: "🔧"
  },

  /**
   * Enum for HEADING values.
   * @enum {Heading}
  */
  HEADING: {
    NORTH: "north",
    NORTH_EAST: "north_east",
    EAST: "east",
    SOUTH_EAST: "south_east",
    SOUTH: "south",
    SOUTH_WEST: "south_west",
    WEST: "west",
    NORTH_WEST: "north_west"
  },

  /**
   * Enum for LOG_LEVEL values.
   * @enum {LogLevel}
  */
  LOG_LEVEL: {
    TRACE: "trace",
    DEBUG: "debug",
    INFO: "info",
    ERROR: "error"
  }
});