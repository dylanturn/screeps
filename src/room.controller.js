const { LogMsg } = require('./util')
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
  if (!room.memory["sources"]) {
    if (!Array.isArray(room.memory["sources"])) {
      room.memory["sources"] = {}
      var sources = room.find(FIND_SOURCES)
      for (var i in sources) {
        room.memory["sources"][sources[i].id] = {
          "pos": sources[i].pos
        }
      }
    }
  }
}

/**
 * Find a path from the origin to the target.
 * @param {Room} room - The room to conduct the search in
 * @param {RoomPosition} origin - The point at which the search starts
 * @param {RoomPosition} target - The point at which the search ends
 * @param {Number} range - The maximum path length
 * @param {Boolean} draw_search - Set to true to paint the search area. Defaults to false.
 */
function findBuildAreaPath(room, origin, target, range, draw_search = false) {

  if (origin.x < 0 || origin.x > 49) { return false }
  if (origin.y < 0 || origin.y > 49) { return false }
  if (target.x < 0 || target.x > 49) { return false }
  if (target.y < 0 || target.y > 49) { return false }

  const room_position_start = new RoomPosition(origin.x, origin.y, room.name)
  const room_position_end = new RoomPosition(target.x, target.y, room.name)

  let goal = { pos: room_position_end, range: 0 }
  let results = PathFinder.search(room_position_start, goal, { maxCost: range })

  if (draw_search) {
    for (var i = 1; i <= results.path.length; i++) {
      room.visual.line(results.path[i - 1], results.path[i], { color: 'white', lineStyle: 'dashed' })
    }
  }

  return !results.incomplete
}


/**
 * Evaluates the build area and returns an array that indicates how much open space was found.
 * @param {Room} room - The room to conduct the search in
 * @param {RoomPosition} origin - The point at which the search starts
 * @param {Number} radius - The radius of the square.
 * @param {Boolean} draw_search - Set to true to paint the search area. Defaults to false.
 */
function evaluateBuildArea(room, origin, radius, draw_search = false) {
  var north_results = []
  var east_results = []
  var south_results = []
  var west_results = []

  // North
  const pos2 = movePosition(origin, HEADING.NORTH, radius)
  // let pos2 = {"x": origin.x, "y": origin.y-radius, "roomName": room.name}
  north_results.push(findBuildAreaPath(room, origin, pos2, radius, draw_search))

  // North-East
  const pos7 = movePosition(origin, HEADING.NORTH_EAST, radius)
  // let pos7 = {"x": origin.x+radius, "y": origin.y-radius, "roomName": room.name}
  let north_east_results = findBuildAreaPath(room, origin, pos7, radius, draw_search)
  north_results.push(north_east_results)
  east_results.push(north_east_results)

  // East
  const pos3 = movePosition(origin, HEADING.NORTH_EAST, radius)
  // let pos3 = {"x": origin.x+radius, "y": origin.y, "roomName": room.name}
  east_results.push(findBuildAreaPath(room, origin, pos3, radius, draw_search))

  // South-East
  const pos5 = movePosition(origin, HEADING.SOUTH_EAST, radius)
  //let pos5 = {"x": origin.x+radius, "y": origin.y+radius, "roomName": room.name}
  let south_east_results = findBuildAreaPath(room, origin, pos5, radius, draw_search)
  south_results.push(south_east_results)
  east_results.push(south_east_results)

  // South
  const pos1 = movePosition(origin, HEADING.SOUTH, radius)
  //let pos1 = {"x": origin.x, "y": origin.y+radius, "roomName": room.name}
  south_results.push(findBuildAreaPath(room, origin, pos1, radius, draw_search))

  // South-West
  const pos8 = movePosition(origin, HEADING.SOUTH_WEST, radius)
  // let pos8 = {"x": origin.x-radius, "y": origin.y+radius, "roomName": room.name} 
  let south_west_results = findBuildAreaPath(room, origin, pos8, radius, draw_search)
  south_results.push(south_west_results)
  west_results.push(south_west_results)

  // West
  const pos4 = movePosition(origin, HEADING.WEST, radius)
  // let pos4 = {"x": origin.x-radius, "y": origin.y, "roomName": room.name}
  west_results.push(findBuildAreaPath(room, origin, pos4, radius, draw_search))

  // North-West
  const pos6 = movePosition(origin, HEADING.NORTH_WEST, radius)
  // let pos6 = {"x": origin.x-radius, "y": origin.y-radius, "roomName": room.name}
  let north_west_results = findBuildAreaPath(room, origin, pos6, radius, draw_search)
  north_results.push(north_west_results)
  west_results.push(north_west_results)

  // North to North-East
  let north_2_north_east_results = findBuildAreaPath(room, pos2, pos7, radius, draw_search)
  north_results.push(north_2_north_east_results)
  east_results.push(north_2_north_east_results)

  // North-East to North
  let north_east_2_north_results = findBuildAreaPath(room, pos7, pos3, radius, draw_search)
  north_results.push(north_east_2_north_results)
  east_results.push(north_east_2_north_results)

  // East to South-East
  let east_2_south_east_results = findBuildAreaPath(room, pos3, pos5, radius, draw_search)
  south_results.push(east_2_south_east_results)
  east_results.push(east_2_south_east_results)

  // South-East - South
  let south_east_2_south_results = findBuildAreaPath(room, pos5, pos1, radius, draw_search)
  south_results.push(south_east_2_south_results)
  east_results.push(south_east_2_south_results)

  // South - South-West
  let south_2_south_west_results = findBuildAreaPath(room, pos1, pos8, radius, draw_search)
  south_results.push(south_2_south_west_results)
  west_results.push(south_2_south_west_results)

  // South-West - West
  let south_west_2_west_results = findBuildAreaPath(room, pos8, pos4, radius, draw_search)
  south_results.push(south_west_2_west_results)
  west_results.push(south_west_2_west_results)

  // West - North-West
  let west_2_north_west_results = findBuildAreaPath(room, pos4, pos6, radius, draw_search)
  north_results.push(west_2_north_west_results)
  west_results.push(west_2_north_west_results)

  // North-West - North
  let north_west_2_north_results = findBuildAreaPath(room, pos6, pos2, radius, draw_search)
  north_results.push(north_west_2_north_results)
  west_results.push(north_west_2_north_results)


  paintSearchArea(room, pos2, pos7, pos5, pos3, pos1, pos8, pos4, pos6, draw_search)

  return {
    "north": north_results.reduce(function (a, b) { return Number(a) + Number(b); }, 0),
    "east": east_results.reduce(function (a, b) { return Number(a) + Number(b); }, 0),
    "south": south_results.reduce(function (a, b) { return Number(a) + Number(b); }, 0),
    "west": west_results.reduce(function (a, b) { return Number(a) + Number(b); }, 0)
  }
}

/**
 * Paint the search area in the given room
 * @param {Room} room - The room to paint the search area in
 * @param {RoomPosition} n - The RoomPosition of the North point
 * @param {RoomPosition} ne - The RoomPosition of the North-East point
 * @param {RoomPosition} e - The RoomPosition of the East point
 * @param {RoomPosition} se - The RoomPosition of the South-East point
 * @param {RoomPosition} s - The RoomPosition of the South point
 * @param {RoomPosition} sw - The RoomPosition of the South-West point
 * @param {RoomPosition} w - The RoomPosition of the West point
 * @param {RoomPosition} nw - The RoomPosition of the North-West point
 * @param {Boolean} draw_search - Set to true to paint the search area. Defaults to false.
 */
function paintSearchArea(room, n, ne, e, se, s, sw, w, nw, draw_search = false) {
  if (draw_search) {
    room.visual.circle(n, { fill: 'red', stroke: 'red' })
    room.visual.circle(ne, { fill: 'red', stroke: 'green' })
    room.visual.circle(e, { fill: 'green', stroke: 'green' })
    room.visual.circle(se, { fill: 'green', stroke: 'orange' })
    room.visual.circle(s, { fill: 'orange', stroke: 'orange' })
    room.visual.circle(sw, { fill: 'orange', stroke: 'purple' })
    room.visual.circle(w, { fill: 'purple', stroke: 'purple' })
    room.visual.circle(nw, { fill: 'purple', stroke: 'red' })
  }
}

/**
 * Find an open space near the origin with the size of the raduis squared.
 * @param {Room} room - The room to conduct the search in
 * @param {RoomPosition} origin - The point at which the search starts
 * @param {Number} radius - The radius of the square.
 * @param {Number} max_distance - The maximum acceptable distance to search
 * @param {Boolean} draw_search - Set to true to paint the search area. Defaults to false.
 * @param {Boolean} print_logs - Set to true to print the logs generated by this function. Defaults to false.
 */
function findBuildArea(room, origin, radius, max_distance, draw_search = false, print_logs = false) {

  LogMsg(LOG_LEVEL.DEBUG, "--- START ---")

  let search_timeout = 20
  let search_time = 0
  let search_pos = origin

  do {

    let results = evaluateBuildArea(room, search_pos, radius, draw_search)

    LogMsg(LOG_LEVEL.INFO, JSON.stringify(results))

    const room_position_origin = new RoomPosition(origin.x, origin.y, room.name)
    const room_position_search = new RoomPosition(search_pos.x, search_pos.y, room.name)

    if (PathFinder.search(room_position_origin, { pos: room_position_search, range: 1 }, { maxCost: max_distance }).incomplete) {
      LogMsg(LOG_LEVEL.ERROR, "Max distance exceeded!")
    }

    // Check to see if we've found the open space we were looking for
    if (results.north === 7 && results.east === 7 && results.south === 7 && results.west === 7) {
      let left_corner = new RoomPosition(search_pos.x - radius, search_pos.y - radius, room.name)
      if (draw_search) {
        room.visual.rect(left_corner, radius * 2, radius * 2, { fill: 'green' })
      }
      LogMsg(LOG_LEVEL.DEBUG, "--- END ---")
      return search_pos
    }

    // Check to see if we should move North-East/West
    else if (results.north === 7 && (results.east === 7 || results.west === 7)) {
      if (results.east === 7) {
        LogMsg(LOG_LEVEL.INFO, "Heading North-East!")
        search_pos = movePosition(search_pos, HEADING.NORTH_EAST, 1)
      } else if (results.west === 7) {
        LogMsg(LOG_LEVEL.INFO, "Heading North-West!")
        search_pos = movePosition(search_pos, HEADING.NORTH_WEST, 1)
      } else {
        LogMsg(LOG_LEVEL.ERROR, "Something went wrong.....")
      }
    }

    // Check to see if we should move South-East/West
    else if (results.south === 7 && (results.east === 7 || results.west === 7)) {
      if (results.east === 7) {
        LogMsg(LOG_LEVEL.INFO, "Heading South-East!")
        search_pos = movePosition(search_pos, HEADING.SOUTH_EAST, 1)
      } else if (results.west === 7) {
        LogMsg(LOG_LEVEL.INFO, "Heading South-West!");
        search_pos = movePosition(search_pos, HEADING.SOUTH_WEST, 1)
      } else {
        LogMsg(LOG_LEVEL.ERROR, "Something went wrong.....")
      }
    }

    // Find and move toward the largest value North/East/South/West
    else {
      let sorted_results = sortObject(results)
      let new_direction = Object.keys(sorted_results).slice(-1)[0]
      LogMsg(LOG_LEVEL.INFO, `Should be heading ${new_direction}`)
      search_pos = movePosition(search_pos, new_direction, 1)
    }

    search_time++
  } while (search_time < search_timeout)

  if (search_time >= search_timeout) {
    LogMsg(LOG_LEVEL.ERROR, `Build area search timed out after ${search_time} attempts`)
  }

  LogMsg(LOG_LEVEL.DEBUG, "--- END ---")
  return null
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
    pos.y = pos.y - units
    return pos
  } else if (heading === HEADING.SOUTH) {
    pos.y = pos.y + units
    return pos
  } else if (heading === HEADING.EAST) {
    pos.x = pos.x + units
    return pos
  } else if (heading === HEADING.WEST) {
    pos.x = pos.x - units
    return pos
  } else if (heading === HEADING.NORTH_WEST) {
    pos.y = pos.y - units
    pos.x = pos.x - units
    return pos
  } else if (heading === HEADING.NORTH_EAST) {
    pos.y = pos.y - units
    pos.x = pos.x + units
    return pos
  } else if (heading === HEADING.SOUTH_WEST) {
    pos.y = pos.y + units
    pos.x = pos.x - units
    return pos
  } else if (heading === HEADING.SOUTH_EAST) {
    pos.y = pos.y + units
    pos.x = pos.x + units
    return pos
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
function run(room) {
  if (Game.flags.Flag1) {
    findBuildArea(room, Game.flags.Flag1.pos, 1, 16, false)
  }
}

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
  }
}