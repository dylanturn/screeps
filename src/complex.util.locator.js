const { SumObject } = require('./util')
const { LogMsg } = require('./logger')
const { SortObject, MovePosition } = require('./room.controller')
const { LOG_LEVEL, HEADING, BUILD_PLOT_SEARCH_TIMEOUT, BUILD_PLOT_SEARCH_OUT_OF_BOUNDS, BUILD_PLOT_OBSTRUCTED } = require('./constants')
const { GetComplexTemplate, GetTemplateConnectorNorth, GetTemplateConnectorEast, GetTemplateConnectorSouth, GetTemplateConnectorWest } = require("./complex.template")
/**
 * Find an open space near the origin with the size of the raduis squared.
 * @param {String} template_name - The name of the template to find for
 * @param {Room} room - The room to conduct the search in
 * @param {RoomPosition} origin - The point at which the search starts
 * @param {Number} radius - The radius of the square.
 * @param {Number} max_distance - The maximum acceptable distance to search
 * @returns {RoomPosition|String}
 */
 function findBuildArea(template_name, room, origin, radius, max_distance) {
  LogMsg(LOG_LEVEL.TRACE, "--- START ---")

  radius = radius

  let search_timeout = 10
  let search_time = 0
  let search_pos = origin

  do {

    let results = evaluateBuildArea(room, search_pos, radius)
    LogMsg(LOG_LEVEL.TRACE, JSON.stringify(results))

    // Check to see if we've found the open space we were looking for
    if (results.north === 7 && results.east === 7 && results.south === 7 && results.west === 7) {
      
      /**** MAKE SURE THAT MAX RANGE HASN'T BEEN EXCEEDED ****/
      if(!validateBuildAreaBounds(template_name, search_pos, origin, max_distance)){
        LogMsg(LOG_LEVEL.ERROR, "Max distance exceeded!")
      } else {
          
        if(room.visual.getSize() < 450000) {
          let left_corner = new RoomPosition(search_pos.x - radius, search_pos.y - radius, room.name)
          room.visual.rect(left_corner, radius * 2, radius * 2, { fill: 'green' })
        }
        
        LogMsg(LOG_LEVEL.TRACE, "--- END ---")
        return search_pos
      }
    }


    // Check to see if we should move North-East/West
    else if (results.north === 7 && (results.east === 7 || results.west === 7)) {
      if (results.east === 7) {
        LogMsg(LOG_LEVEL.TRACE, "Heading North-East!")
        search_pos = MovePosition(search_pos, HEADING.NORTH_EAST, 1)
      } else if (results.west === 7) {
        LogMsg(LOG_LEVEL.TRACE, "Heading North-West!")
        search_pos = MovePosition(search_pos, HEADING.NORTH_WEST, 1)
      } else {
        LogMsg(LOG_LEVEL.ERROR, "Something went wrong.....")
      }
    }

    // Check to see if we should move South-East/West
    else if (results.south === 7 && (results.east === 7 || results.west === 7)) {
      if (results.east === 7) {
        LogMsg(LOG_LEVEL.TRACE, "Heading South-East!")
        search_pos = MovePosition(search_pos, HEADING.SOUTH_EAST, 1)
      } else if (results.west === 7) {
        LogMsg(LOG_LEVEL.TRACE, "Heading South-West!");
        search_pos = MovePosition(search_pos, HEADING.SOUTH_WEST, 1)
      } else {
        LogMsg(LOG_LEVEL.ERROR, "Something went wrong.....")
      }
    }

    // Find and move toward the largest value North/East/South/West
    else {
      let sorted_results = SortObject(results)
      let new_direction = Object.keys(sorted_results).slice(-1)[0]
      LogMsg(LOG_LEVEL.TRACE, `Should be heading ${new_direction}`)
      search_pos = MovePosition(search_pos, new_direction, 1)
    }

    search_time++
  } while (search_time < search_timeout)

  if (search_time >= search_timeout) {
    LogMsg(LOG_LEVEL.ERROR, `Build area search timed out after ${search_time} attempts`)
    LogMsg(LOG_LEVEL.TRACE, "--- END ---")
    return BUILD_PLOT_SEARCH_TIMEOUT
  }

  LogMsg(LOG_LEVEL.TRACE, "--- END ---")
  throw 'Failed to locate build plot!';
}

/**
 * Generates a cost matrix for the room that takes into account future build sites.
 * @param {Room} room - The room to generate the cost matrix for
 * @returns {CostMatrix} - The path finding cost matrix for the room
 */
function generateCostMatrix(room) {
  let costs = new PathFinder.CostMatrix;

  const terrain = new Room.Terrain(room.name);
  for(let y = 0; y < 50; y++) {
    for(let x = 0; x < 50; x++) {
        const tile = terrain.get(x, y);
        const weight =
            tile === TERRAIN_MASK_WALL  ? 255 : // wall  => unwalkable
            tile === TERRAIN_MASK_SWAMP ?   5 : // swamp => weight:  5
                                            1 ; // plain => weight:  1
        costs.set(x, y, weight);
    }
  }

  // Prevent's building over other complexes but don't pathfind around planned roads
  for (const [key, value] of Object.entries(Memory["complex_inventory"])) {
    if(key.split(':')[2] === "road"){
      costs.set(value[0], value[1], 1);
    } else {
      costs.set(value[0], value[1], 0xff);
    }
  }

  // Prevent building over other structures
  room.find(FIND_STRUCTURES).forEach(function(struct) {
    costs.set(struct.pos.x, struct.pos.y, 0xff);
  });

  // Prevent building over other construction sites
  room.find(FIND_CONSTRUCTION_SITES).forEach(function(site) {
    costs.set(site.pos.x, site.pos.y, 0xff);
  });

  return costs;
}

/**
 * Find a path from the origin to the target.
 * @param {Room} room - The room to conduct the search in
 * @param {RoomPosition} origin - The point at which the search starts
 * @param {RoomPosition} target - The point at which the search ends
 * @param {Number} range - The maximum path length
 */
function findBuildAreaPath(room, origin, target, range) {
  //console.log(`FIND BUILD AREA PATH FROM: ${JSON.stringify(origin)} - TO: ${JSON.stringify(target)}`)
  
  if (origin.x < 0 || origin.x > 49) { return false }
  if (origin.y < 0 || origin.y > 49) { return false }
  if (target.x < 0 || target.x > 49) { return false }
  if (target.y < 0 || target.y > 49) { return false }

  const room_position_start = new RoomPosition(origin.x, origin.y, room.name)
  const room_position_end = new RoomPosition(target.x, target.y, room.name)

  let goal = { pos: room_position_end, range: 0 }
  let results = PathFinder.search(room_position_start, goal, { 
    maxCost: range,
    roomCallback: function(roomName) {
      return generateCostMatrix(Game.rooms[roomName])
    },
  })
  LogMsg(LOG_LEVEL.DEBUG, `Paths Found: ${results.path.length}`)

  for (var i = 1; i <= results.path.length; i++) {  
    if(room.visual.getSize() < 450000) {
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
 */
function evaluateBuildArea(room, origin, radius) {
  //console.log(`Evaluating build area: ${JSON.stringify(origin)}...`)

  var north_results = []
  var east_results = []
  var south_results = []
  var west_results = []

  // ### Find points ###

  // North
  let north = MovePosition(origin, HEADING.NORTH, radius)
  north_results.push(findBuildAreaPath(room, origin, north, radius))

  // North-East
  let north_east = MovePosition(origin, HEADING.NORTH_EAST, radius)
  let north_east_results = findBuildAreaPath(room, origin, north_east, radius)
  north_results.push(north_east_results)
  east_results.push(north_east_results)

  // East
  let east = MovePosition(origin, HEADING.EAST, radius)
  east_results.push(findBuildAreaPath(room, origin, east, radius))

  // South-East
  let south_east = MovePosition(origin, HEADING.SOUTH_EAST, radius)
  let south_east_results = findBuildAreaPath(room, origin, south_east, radius)
  south_results.push(south_east_results)
  east_results.push(south_east_results)

  // South
  let south = MovePosition(origin, HEADING.SOUTH, radius)
  south_results.push(findBuildAreaPath(room, origin, south, radius))

  // South-West
  let south_west = MovePosition(origin, HEADING.SOUTH_WEST, radius)
  let south_west_results = findBuildAreaPath(room, origin, south_west, radius)
  south_results.push(south_west_results)
  west_results.push(south_west_results)

  // West
  let west = MovePosition(origin, HEADING.WEST, radius)
  west_results.push(findBuildAreaPath(room, origin, west, radius))

  // North-West
  let north_west = MovePosition(origin, HEADING.NORTH_WEST, radius)
  let north_west_results = findBuildAreaPath(room, origin, north_west, radius)
  north_results.push(north_west_results)
  west_results.push(north_west_results)

  // Find paths between points

  // North to North-East
  let north_2_north_east_results = findBuildAreaPath(room, north, north_east, radius)
  north_results.push(north_2_north_east_results)
  east_results.push(north_2_north_east_results)

  // North-East to North
  let north_east_2_north_results = findBuildAreaPath(room, north_east, north, radius)
  north_results.push(north_east_2_north_results)
  east_results.push(north_east_2_north_results)

  // East to South-East
  let east_2_south_east_results = findBuildAreaPath(room, east, south_east, radius)
  south_results.push(east_2_south_east_results)
  east_results.push(east_2_south_east_results)

  // South-East - South
  let south_east_2_south_results = findBuildAreaPath(room, south_east, south, radius)
  south_results.push(south_east_2_south_results)
  east_results.push(south_east_2_south_results)

  // South - South-West
  let south_2_south_west_results = findBuildAreaPath(room, south, south_west, radius)
  south_results.push(south_2_south_west_results)
  west_results.push(south_2_south_west_results)

  // South-West - West
  let south_west_2_west_results = findBuildAreaPath(room, south_west, west, radius)
  south_results.push(south_west_2_west_results)
  west_results.push(south_west_2_west_results)

  // West - North-West
  let west_2_north_west_results = findBuildAreaPath(room, west, north_west, radius)
  north_results.push(west_2_north_west_results)
  west_results.push(west_2_north_west_results)

  // North-West - North
  let north_west_2_north_results = findBuildAreaPath(room, north_west, north, radius)
  north_results.push(north_west_2_north_results)
  west_results.push(north_west_2_north_results)

  paintSearchArea(room, north, north_east, east, south_east, south, south_west, west, north_west)

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
 */
function paintSearchArea(room, n, ne, e, se, s, sw, w, nw) {
  if(room.visual.getSize() >= 450000) {return}
  room.visual.circle(n, { fill: 'red', stroke: 'red' })
  room.visual.circle(ne, { fill: 'red', stroke: 'green' })
  room.visual.circle(e, { fill: 'green', stroke: 'green' })
  room.visual.circle(se, { fill: 'green', stroke: 'orange' })
  room.visual.circle(s, { fill: 'orange', stroke: 'orange' })
  room.visual.circle(sw, { fill: 'orange', stroke: 'purple' })
  room.visual.circle(w, { fill: 'purple', stroke: 'purple' })
  room.visual.circle(nw, { fill: 'purple', stroke: 'red' })
}

/**
 * 
 * @param {String} template_name - Name of the template we're trying to place
 * @param {RoomPosition} search_position - This is where we want to build the complex
 * @param {RoomPosition} origin  - This is the point we were woring form. TODO: Maybe dont need this
 * @param {Number} max_distance - Max distance from the origin
 * @returns {Boolean} - Returns true if we're good to go 
 */
function validateBuildAreaBounds(template_name, search_position, origin, max_distance){
  const paths = PathFinder.search(origin, { pos: search_position, range: 0 }, { 
    maxCost: max_distance,
    roomCallback: function(roomName) {
      return generateCostMatrix(Game.rooms[roomName])
    },
  })

  if(paths.incomplete){
    return false
  } else {
    return true
  }
}

module.exports = {
  /**
   * Find an open space near the origin with the size of the raduis squared.
   * @param {String} template_name - The name of the template to find for
   * @param {Room} room - The room to conduct the search in
   * @param {RoomPosition} origin - The point at which the search starts
   * @param {Number} radius - The radius of the square.
   * @param {Number} max_distance - The maximum acceptable distance to search
   * @returns {RoomPosition|String}
   */
  FindBuildArea(template_name, room, origin, radius, max_distance) {
    return findBuildArea(template_name, room, origin, radius, max_distance)
  },

  /**
   * Evaluates the build area and returns an array that indicates how much open space was found.
   * @param {RoomPosition} origin - The point at which the search starts
   * @param {Number} radius - The radius of the square.
   */
  EvaluateBuildArea(origin, radius) {
    const build_score = SumObject(evaluateBuildArea(Game.rooms[origin.roomName], origin, radius))
    if(build_score === 28){
      return OK
    } else {
      return BUILD_PLOT_OBSTRUCTED
    }
  },

  /**
   * 
   * @param {String} template_name 
   * @param {RoomPosition} search_position 
   * @param {RoomPosition} origin 
   * @param {Number} max_distance 
   */
  ValidateBuildAreaBounds(template_name, search_position, origin, max_distance){
    validateBuildAreaBounds(template_name, search_position, origin, max_distance)
  }
}