const { ConstructComplex } = require('./complex.util')
const construction_util = require('./construction.util');
const { TEMPLATE_SINGLE_CONTAINER } = require('./complex.template');
const { LogMsg } = require('./logger');
const { LOG_LEVEL } = require('./constants')

module.exports = {
  /**
   * Constructs the containers near the controller and sources
   * @param {Room} room 
   * @returns {Boolean}
   */
  ConstructContainers(room) {
    return constructContainers(room)
  }
}

// 2. Determine the valid harvesting positions.
function getValidSourceHarvestPos(room, source) {
  const offset = 1
  var origX = source.pos.x
  var origY = source.pos.y
  var possible_positions = [
    { "x": origX,        "y": origY-offset },   // North
    { "x": origX+offset, "y": origY-offset },   // NorthEast
    { "x": origX+offset, "y": origY },          // East
    { "x": origX+offset, "y": origY+offset },   // SouthEast
    { "x": origX,        "y": origY+offset },   // South
    { "x": origX-offset, "y": origY+offset },   // SouthWest
    { "x": origX-offset, "y": origY },          // West
    { "x": origX-offset, "y": origY-offset }    // NorthWest
  ]

  var valid_harvest_positions = []
  for (let i in possible_positions) {
    var position = possible_positions[i]

    // Get a list of the things that occupy this space
    var position_content = room.lookAt(position.x, position.y)

    // filter out a creep since they move around
    if (position_content[0].type == "creep") {
      position_content.splice(0, 1)
    }

    // filter out roads since creeps can gather while on a road.
    if ((position_content[0].type == "structure") && (position_content[0].structure.structureType == "road")) {
      position_content.splice(0, 1)
    }

    // filter out roads construction sites since creeps can gather while on a road.
    if ((position_content[0].type == "constructionSite") && (position_content[0].constructionSite.structureType == "road")) {
      position_content.splice(0, 1)
    }

    // Check to make sure this is a valid position
    if (position_content[0].type == "terrain") {
      if ((position_content[0].terrain == "plain") || (position_content[0].terrain == "swamp")) {
        valid_harvest_positions.push(position)
      }
    }

  }

  return valid_harvest_positions
}

// 4. Determine the determine the valid container placement positions
//    that don't overlap with the valid harvest positions.
function getIdealRoadSideBuildSite(room, closest_road, valid_harvest_positions) {
  const offset = 1
  const origX = closest_road.x
  const origY = closest_road.y
  const possible_positions = [
    { "x": origX-offset, "y": origY-offset },    // NorthWest
    { "x": origX-offset, "y": origY },          // West
    { "x": origX-offset, "y": origY+offset },   // SouthWest
    { "x": origX,        "y": origY+offset },   // South
    { "x": origX+offset, "y": origY+offset },   // SouthEast
    { "x": origX+offset, "y": origY },          // East
    { "x": origX+offset, "y": origY-offset },   // NorthEast
    { "x": origX,        "y": origY-offset },   // North
  ]

  for (let i in valid_harvest_positions) {
    new RoomVisual(room.name).circle(valid_harvest_positions[i].x, valid_harvest_positions[i].y, { stroke: 'blue' });
  } 

  for (let i in possible_positions) {
    const position = possible_positions[i]
    LogMsg(LOG_LEVEL.TRACE, `0. Checking Position: ${JSON.stringify(position)}`)

    if (valid_harvest_positions.some(e => e.x === position.x && e.y === position.y)) {
      new RoomVisual(room.name).circle(position.x, position.y, { stroke: 'red' });
    } else {
      LogMsg(LOG_LEVEL.TRACE, `1. Checking for harvest position: ${JSON.stringify(position)}`)
      if (construction_util.ValidateBuildPos(room, position)) {
        LogMsg(LOG_LEVEL.TRACE, `2. Validating Position: ${JSON.stringify(position)}`)
        new RoomVisual(room.name).circle(position.x, position.y, { stroke: 'green' });
        LogMsg(LOG_LEVEL.TRACE, `3. Checking complex_components for: ${JSON.stringify(position)}`)
        if(!Object.keys(Memory["complex_components"]).includes(`${position.x}:${position.y}`)){
          LogMsg(LOG_LEVEL.TRACE, `4. Returning: ${JSON.stringify(position)}`)
          return position          
        }
      }
    }
  }
  return null
}

/**
 * Constructs the containers near the controller and sources
 * @param {Room} room 
 * @returns {Boolean}
 */
function constructContainers(room) {
  
  // 1. Find the rooms source and controller flags
  const flags = room.find(FIND_FLAGS, {
    filter: (flag) => flag.memory["type"] == "source" ||
                      flag.memory["type"] == "controller"
  })
  
  for (let i in flags) {
    let flag = flags[i]

    // 2. Determine the valid harvesting positions.
    let valid_harvest_positions = getValidSourceHarvestPos(room, flag)

    // 3. Get the road closest to the source.
    let closest_road = construction_util.FindClosestRoad(room, flag)

    // 4. Determine the determine the valid container placement positions that don't overlap with the valid harvest positions.
    let build_site = getIdealRoadSideBuildSite(room, closest_road, valid_harvest_positions)
    LogMsg(LOG_LEVEL.TRACE, `build_site = ${JSON.stringify(build_site)}`)
    
    if(build_site !== null){
      // 5. Place the container construction site.
      if(ConstructComplex(TEMPLATE_SINGLE_CONTAINER, new RoomPosition(build_site.x, build_site.y, room.name))){
        flag.remove()
      }
    }
  }

  if(room.find(FIND_FLAGS, {
    filter: (flag) => flag.memory["type"] == "source" ||
                      flag.memory["type"] == "controller"
  }).length === 0){
    return true
  }
  return false
}
