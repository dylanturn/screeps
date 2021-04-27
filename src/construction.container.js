const construction_util = require('./construction.util')

// 2. Determine the valid harvesting positions.
function getValidSourceHarvestPos(room, source) {
  const offset = 1
  var origX = source.pos.x
  var origY = source.pos.y
  var possible_positions = [
    { "x": origX + offset, "y": origY },          // North
    { "x": origX + offset, "y": origY + offset }, // NorthEast
    { "x": origX, "y": origY + offset },          // East
    { "x": origX - offset, "y": origY + offset }, // SouthEast
    { "x": origX - offset, "y": origY },          // South
    { "x": origX - offset, "y": origY - offset }, // SouthWest
    { "x": origX, "y": origY - offset },          // West
    { "x": origX + offset, "y": origY - offset }  // NorthWest
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
      if (position_content[0].terrain == "plain") {
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
  var origX = closest_road.pos.x
  var origY = closest_road.pos.y
  var possible_positions = [
    { "x": origX + offset, "y": origY },        // North
    { "x": origX + offset, "y": origY + offset }, // NorthEast
    { "x": origX, "y": origY + offset }, // East
    { "x": origX - offset, "y": origY + offset }, // SouthEast
    { "x": origX - offset, "y": origY },        // South
    { "x": origX - offset, "y": origY - offset }, // SouthWest
    { "x": origX, "y": origY - offset }, // West
    { "x": origX + offset, "y": origY - offset }  // NorthWest
  ]

  for (let i in valid_harvest_positions) {
    new RoomVisual(room.name).circle(valid_harvest_positions[i].x, valid_harvest_positions[i].y, { stroke: 'blue' });
  }

  for (var i in possible_positions) {
    var position = possible_positions[i]

    if (valid_harvest_positions.some(e => e.x === position.x && e.y === position.y)) {
      new RoomVisual(room.name).circle(position.x, position.y, { stroke: 'red' });
    } else {
      if (construction_util.ValidateBuildPos(room, position)) {
        new RoomVisual(room.name).circle(position.x, position.y, { stroke: 'green' });
        return position
      }
    }
  }
}

// 5. Place the container construction site.
function buildStorageContainer(room, pos) {
  return construction_util.BuildOnPlain(room, pos.x, pos.y, STRUCTURE_CONTAINER)
}

function constructContainers(room) {

  // 1. Find the rooms sources
  var sources = room.find(FIND_SOURCES)
  for (var i in sources) {
    var source = sources[i]

    // 0. Make sure the container doesn't already exist
    if (room.memory.sources[source.id].has_storage) {
      return
    }

    // 2. Determine the valid harvesting positions.
    var valid_harvest_positions = getValidSourceHarvestPos(room, source)

    // 3. Get the road closest to the source.
    var closest_road = construction_util.FindClosestRoad(room, source)

    // 4. Determine the determine the valid container placement positions
    //    that don't overlap with the valid harvest positions.
    var ideal_build_site = getIdealRoadSideBuildSite(room, closest_road, valid_harvest_positions)

    // 5. Place the container construction site.
    room.memory.sources[source.id].has_storage = buildStorageContainer(room, ideal_build_site)
  }
}

module.exports = {
  ConstructContainers(room) {
    constructContainers(room)
  }
}