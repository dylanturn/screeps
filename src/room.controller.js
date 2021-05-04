const { LogMsg } = require('./logger')
const { LOG_LEVEL, HEADING, Heading } = require('./constants')

/**
 * Sets up the memory objects that will be used in this room.
 * @param {Room} room - The room to run the setup in
 */
function setup(room) {
  if (!room.memory["spawns"]) {
    if (!Array.isArray(room.memory["spawns"])) {
      room.memory["spawns"] = []
    }
  }

  const sources = room.find(FIND_SOURCES)
  for(let i in sources){
    const source = sources[i]
    const flag_name = room.createFlag(source.pos.x, source.pos.y, source.id, COLOR_YELLOW, COLOR_YELLOW)
    Game.flags[flag_name].memory["type"] = "source"
  }

  const controllers = room.find(FIND_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_CONTROLLER})
  for(let i in controllers){
    const controller = controllers[i]
    const flag_name = room.createFlag(controller.pos.x, controller.pos.y, controller.id, COLOR_RED, COLOR_RED)
    Game.flags[flag_name].memory["type"] = "controller"
  }

}

/**
 * Translates a RoomPosition in the given direction by the given number of units.
 * @param {RoomPosition} pos - The RoomPosition to translate
 * @param {Heading} heading - The RoomPosition to translate
 * @param {Number} units - The RoomPosition to translate
 * @returns {RoomPosition} - The translated RoomPosition
 */
function movePosition(pos, heading, units) {
  if (heading === HEADING.NORTH) {
    return new RoomPosition(pos.x, (pos.y-units), pos.roomName)
  } else if (heading === HEADING.SOUTH) {
    return new RoomPosition(pos.x, (pos.y+units), pos.roomName)
  } else if (heading === HEADING.EAST) {
    return new RoomPosition((pos.x+units), pos.y, pos.roomName)
  } else if (heading === HEADING.WEST) {
    return new RoomPosition(pos.x-units, pos.y, pos.roomName)
  } else if (heading === HEADING.NORTH_WEST) {
    return new RoomPosition((pos.x-units), (pos.y-units), pos.roomName)
  } else if (heading === HEADING.NORTH_EAST) {
    return new RoomPosition((pos.x+units), (pos.y-units), pos.roomName)
  } else if (heading === HEADING.SOUTH_WEST) {
    return new RoomPosition((pos.x-units), (pos.y+units), pos.roomName)
  } else if (heading === HEADING.SOUTH_EAST) {
    return new RoomPosition((pos.x+units), (pos.y+units), pos.roomName)
  }
  LogMsg(LOG_LEVEL.ERROR, `ERROR! Couldn't find direction: ${heading}`)
  return pos //TODO: Maybe throw an error?
}

/**
 * Sorts an object by key.
 * @param {Object} object - The object to sort.
 */
function sortObject(object) {
  let objectMap = new Map();

  for (let i in object) {
    objectMap.set(i, object[i]);
  }

  objectMap[Symbol.iterator] = function* () {
    yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
  }

  let jsonObject = {};
  for (let [key, value] of objectMap) {     // get data sorted
    jsonObject[key] = value
  }
  return jsonObject
}

/**
 * Run the Room controller
 * @param {Room} room - The room to run the controller in
 */
function run(room) {}

module.exports = {
  Setup(room) {
    setup(room)
  },
  Run(room) {
    try {
      run(room)
    } catch (err) {
      LogMsg(LOG_LEVEL.ERROR, `The room controller has failed with error:\n${err} - ${err.stack}`)
    }
  },

  /**
  * Sorts an object by key.
  * @param {Object} object - The object to sort.
  */
  SortObject(object) {
    return sortObject(object)
  },

  /**
 * Translates a RoomPosition in the given direction by the given number of units.
 * @param {RoomPosition} pos - The RoomPosition to translate
 * @param {Heading} heading - The RoomPosition to translate
 * @param {Number} units - The RoomPosition to translate
 * @returns {RoomPosition} - The translated RoomPosition
 */
  MovePosition(pos, heading, units) {
    return movePosition(pos, heading, units)
  }
}