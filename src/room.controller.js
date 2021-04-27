
const constants = require('./constants')

function setup(room) {
  if (!room.memory.spawns) {
    if (!Array.isArray(room.memory.spawns)) {
      room.memory.spawns = []
    }
  }
  if (!room.memory.sources) {
    if (!Array.isArray(room.memory.sources)) {
      room.memory.sources = {}
      var sources = room.find(FIND_SOURCES)
      for (var i in sources) {
        room.memory.sources[sources[i].id] = { 
          "pos": sources[i].pos 
        }
      }
    }
  }
}

function findPathToFlag(room, start_pos, end_pos, range){

  if(start_pos.x < 0 || start_pos.x > 49){return false}
  if(start_pos.y < 0 || start_pos.y > 49){return false}
  if(end_pos.x < 0 || end_pos.x > 49){return false}
  if(end_pos.y < 0 || end_pos.y > 49){return false}

  const room_position_start = new RoomPosition(start_pos.x, start_pos.y, room.name)
  const room_position_end = new RoomPosition(end_pos.x, end_pos.y, room.name)

  let goal = { pos: room_position_end, range: 0 }
  let results = PathFinder.search(room_position_start, goal, { maxCost: range })

  for (var i = 1; i <= results.path.length; i++) {
    room.visual.line(results.path[i-1], results.path[i],{color: 'white', lineStyle: 'dashed'})
  }
  return !results.incomplete
}


/**
 * Evaluates the build area and returns an array that indicates how much open space was found.
 * @param {Object} room - The room to conduct the search in
 * @param {Object} origin - The point at which the search starts
 * @param {Number} radius - The radius of the square.
 */
function evaluateBuildArea(room, origin, radius){
  var north_results = []
  var east_results = []
  var south_results = []
  var west_results = []
  
  // North
  let pos2 = {"x": origin.x, "y": origin.y-radius, "roomName": room.name}
  north_results.push(findPathToFlag(room, origin, pos2, radius))
  
  // North-East
  let pos7 = {"x": origin.x+radius, "y": origin.y-radius, "roomName": room.name}
  let north_east_results = findPathToFlag(room, origin, pos7, radius)
  north_results.push(north_east_results)
  east_results.push(north_east_results)
  
  // East
  let pos3 = {"x": origin.x+radius, "y": origin.y, "roomName": room.name}
  east_results.push(findPathToFlag(room, origin, pos3, radius))
  
  // South-East
  let pos5 = {"x": origin.x+radius, "y": origin.y+radius, "roomName": room.name}
  let south_east_results = findPathToFlag(room, origin, pos5, radius)
  south_results.push(south_east_results)
  east_results.push(south_east_results)
  
  // South
  let pos1 = {"x": origin.x, "y": origin.y+radius, "roomName": room.name}
  south_results.push(findPathToFlag(room, origin, pos1, radius))
  
  // South-West
  let pos8 = {"x": origin.x-radius, "y": origin.y+radius, "roomName": room.name} 
  let south_west_results = findPathToFlag(room, origin, pos8, radius)
  south_results.push(south_west_results)
  west_results.push(south_west_results)
  
  // West
  let pos4 = {"x": origin.x-radius, "y": origin.y, "roomName": room.name}
  west_results.push(findPathToFlag(room, origin, pos4, radius))
  
  // North-West
  let pos6 = {"x": origin.x-radius, "y": origin.y-radius, "roomName": room.name}
  let north_west_results = findPathToFlag(room, origin, pos6, radius)
  north_results.push(north_west_results)
  west_results.push(north_west_results)
  
  // North to North-East
  let north_2_north_east_results = findPathToFlag(room, pos2, pos7, radius)
  north_results.push(north_2_north_east_results)
  east_results.push(north_2_north_east_results)
  
  // North-East to North
  let north_east_2_north_results = findPathToFlag(room, pos7, pos3, radius)
  north_results.push(north_east_2_north_results)
  east_results.push(north_east_2_north_results)
  
  // East to South-East
  let east_2_south_east_results = findPathToFlag(room, pos3, pos5, radius)
  south_results.push(east_2_south_east_results)
  east_results.push(east_2_south_east_results)
  
  // South-East - South
  let south_east_2_south_results = findPathToFlag(room, pos5, pos1, radius)
  south_results.push(south_east_2_south_results)
  east_results.push(south_east_2_south_results)
  
  // South - South-West
  let south_2_south_west_results = findPathToFlag(room, pos1, pos8, radius)
  south_results.push(south_2_south_west_results)
  west_results.push(south_2_south_west_results)
  
  // South-West - West
  let south_west_2_west_results = findPathToFlag(room, pos8, pos4, radius)
  south_results.push(south_west_2_west_results)
  west_results.push(south_west_2_west_results)
  
  // West - North-West
  let west_2_north_west_results = findPathToFlag(room, pos4, pos6, radius)
  north_results.push(west_2_north_west_results)
  west_results.push(west_2_north_west_results)
  
  // North-West - North
  let north_west_2_north_results = findPathToFlag(room, pos6, pos2, radius)
  north_results.push(north_west_2_north_results)
  west_results.push(north_west_2_north_results)
  
  paintBuildArea(room, pos2, pos7,pos5, pos3, pos1, pos8, pos4, pos6)

  return {
    "north": north_results.reduce(function(a, b){return Number(a) + Number(b);},0),
    "east": east_results.reduce(function(a, b){return Number(a) + Number(b);},0),
    "south": south_results.reduce(function(a, b){return Number(a) + Number(b);},0),
    "west": west_results.reduce(function(a, b){return Number(a) + Number(b);},0)
  }
}

function paintBuildArea(room, n,ne,e,se,s,sw,w,nw){
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
 * Find an open space near the origin with the size of the raduis squared.
 * @param {Object} room - The room to conduct the search in
 * @param {Object} origin - The point at which the search starts
 * @param {Number} radius - The radius of the square.
 * @param {Number} max_distance - The maximum acceptable distance to search
 */
function findBuildArea(room, origin, radius, max_distance){

  let search_timeout = 20
  let search_time = 0
  let search_pos = origin

  do {

    let results = evaluateBuildArea(room, search_pos, radius)

    console.log(JSON.stringify(results))

    const room_position_origin = new RoomPosition(origin.x, origin.y, room.name)
    const room_position_search = new RoomPosition(search_pos.x, search_pos.y, room.name)

    if(PathFinder.search(room_position_origin, { pos: room_position_search, range: 1 }, { maxCost: max_distance }).incomplete){
      console.log("Max distance exceeded!")
    }

    // Check to see if we've found the open space we were looking for
    if(results.north === 7 && results.east === 7 && results.south === 7 && results.west === 7){
      let left_corner = new RoomPosition(search_pos.x-radius, search_pos.y-radius, room.name)
      room.visual.rect(left_corner, radius*2, radius*2, { fill: 'green' })
      return search_pos
    }

    // Check to see if we should move North-East/West
    else if(results.north === 7 && (results.east === 7 || results.west === 7)){
      if(results.east === 7){
        console.log("Heading North-East!")
        search_pos = moveSearchPos(search_pos, "north_east", 1)
      } else if(results.west === 7){
        console.log("Heading North-West!")
        search_pos = moveSearchPos(search_pos, "north_west", 1)
      } else {
        console.log("Something went wrong.....")
      }
    }
    
    // Check to see if we should move South-East/West
    else if(results.south === 7 && (results.east === 7 || results.west === 7)){
      if(results.east === 7){
        console.log("Heading South-East!")
        search_pos = moveSearchPos(search_pos, "south_east", 1)
      } else if(results.west === 7){
        console.log("Heading South-West!")
        search_pos = moveSearchPos(search_pos, "south_west", 1)
      } else {
        console.log("Something went wrong.....")
      }
    }

    // Find and move toward the largest value North/East/South/West
    else {
      let sorted_results = sortObject(results)
      let new_direction = Object.keys(sorted_results).slice(-1)[0]
      console.log(`Should be heading ${new_direction}`)
      search_pos = moveSearchPos(search_pos, new_direction, 1)
    }
    
    search_time++
  } while(search_time<search_timeout)
  
  if(search_time>=search_timeout){
    console.log(`Build area search timed out after ${search_time} attempts`)
  }

}

function moveSearchPos(pos, direction, units){
  if(direction === "north"){
    pos.y = pos.y-units
    return pos
  } else if(direction === "south"){
    pos.y = pos.y+units
    return pos
  } else if(direction === "east"){
    pos.x = pos.x+units
    return pos
  } else if(direction === "west"){
    pos.x = pos.x-units
    return pos
  } else if(direction === "north_west"){
    pos.y = pos.y-units
    pos.x = pos.x-units
    return pos
  } else if(direction === "north_east"){
    pos.y = pos.y-units
    pos.x = pos.x+units
    return pos
  } else if(direction === "south_west"){
    pos.y = pos.y+units
    pos.x = pos.x-units
    return pos
  } else if(direction === "south_east"){
    pos.y = pos.y+units
    pos.x = pos.x+units
    return pos
  }
  console.log(`ERROR! Couldn't find direction: ${direction}`)
  return pos //TODO: Maybe throw an error?
}

function sortObject(object){
  let objectMap = new Map();

  for(let i in object){
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

function run(room) {
  if(Game.flags.Flag1){
    console.log("--- START ---")
    findBuildArea(room, Game.flags.Flag1.pos, 1, 16)
    console.log("--- END ---")
  }
}

module.exports = {
  Setup(room) {
    setup(room)
  },
  Run(room) {
    run(room)
    /*try {
      
    } catch (err) {
      console.log(`The room controller has failed with error:\n${err} - ${err.stack}`)
    }*/
  }
}