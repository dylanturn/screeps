const { LogMsg, GetClosestByObject } = require('./util')
const { LOG_LEVEL } = require('./constants')

function findClosestRoad(room, object) {

  const road_construction_sites = room.find(FIND_CONSTRUCTION_SITES,
    { filter: { structureType: STRUCTURE_ROAD } });

  const roads = Game.rooms[room.name].find(FIND_STRUCTURES, {
    filter: { structureType: STRUCTURE_ROAD }
  });

  return GetClosestByObject(object.pos, roads.concat(road_construction_sites))
}


// Accepts a map position and returns true if it can be built on
function validateBuildPos(room, pos) {
  // Get the contents of the given position
  var position_content = room.lookAt(pos.x, pos.y)
  // Check to make sure this is a valid position
  if (position_content[0].type === "terrain") {
    if (position_content[0].terrain === "plain") {
      return true
    }
  }
  return false
}

// Accepts a list of map positions and returns a list of filtered positions that can be built on
function filterBuildPosArray(room, pos_array) {
  for (var i in pos_array) {
    if (!validateBuildPos(room, pos_array[i])) {
      pos_array.splice(i, 1)
    }
  }
  return pos_array
}

module.exports = {

  // Returns the road closest to the given object
  FindClosestRoad(room, object) {
    return findClosestRoad(room, object)
  },

  // Returns a book indicating wether or not the position can be built on
  ValidateBuildPos(room, pos) {
    return validateBuildPos(room, pos)
  },

  // Accepts and array of positions and returns the subset that can be built on
  FilterBuildPosArray(room, pos_array) {
    return filterBuildPosArray(room, pos_array)
  },

  // Creates a construction site at the given position for the given structure type
  BuildOnPlain(room, posX, posY, type) {
    if (room.lookAt(posX, posY)[0].type == "terrain") {
      if (room.lookAt(posX, posY)[0].terrain == "plain") {
        if (room.createConstructionSite(posX, posY, type) === OK) {
          LogMsg(LOG_LEVEL.DEBUG, `Added build task for ${type} in room ${room.name} at position ${posX},${posY}`)
          return true
        }
      }
    }
    LogMsg(LOG_LEVEL.ERROR, `Failed to add build task in room ${room.name} of type ${type} at ${posX} - ${posY}`)
    return false;
  }
}
