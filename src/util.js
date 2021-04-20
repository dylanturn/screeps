function getRoomSpawns(room) {
  return Game.rooms[room.name].find(FIND_MY_SPAWNS)
}

function getFirstRoomSpawn(room){
  return getRoomSpawns(room)[0]
}

function getRoomEnergySources(room){
    var found_sources = room.find(FIND_SOURCES)
    var source_list = []
    for (var source in found_sources){
      source_list.push(found_sources[source])
    }
    return source_list
}

function getRoomMiniralSources(creep){
    return null
}

// Calculates the distance between two points on a 2D grid
function getDistance(posA, posB) {
  return Math.sqrt(Math.pow((posA.x-posB.x),2)+Math.pow((posA.y-posB.y),2))
}

function getClosestByPos(posA, posArray){
  var smallest_distance = Number.MAX_SAFE_INTEGER
  var closest_pos = null
  for (var i in posArray){
    var distance = getDistance(posA, posArray[i])
    if (distance < smallest_distance) {
        smallest_distance = distance
        closest_pos = posArray[i]
    }
  }
  return closest_pos
}

function getClosestByObject(posA, objects) {
  posArray = []
  for(var i in objects){
    posArray.push(objects[i].pos)
  }

  var closest_pos = getClosestByPos(posA, posArray)

  for(var i in objects){
   if(objects[i].pos == closest_pos) {
     return objects[i]
   }
  }
  return null
}

// Determines the closest object to a creep by type
function getClosestByType(creep, type) {
  // Saving this for later
  // points.sort(function(a, b){return a-b});
  var found_types = creep.room.find(type)
  var smallest_distance = Number.MAX_SAFE_INTEGER
  var closest_found_type = null
  for (var index in found_types){
      var found_type = found_types[index]
      var distance = getDistance(creep.pos, found_type.pos)
      if (distance < smallest_distance) {
          smallest_distance = distance
          closest_found_type = found_type
      }
  }
  return closest_found_type
}

module.exports = {

    // Gets the name of the room the given creep is in
    GetRoomName(creep) {
      return getRoomName(creep)
    },

    // Returns 1 spawn for the given room
    GetFirstRoomSpawn(room) {
      return getFirstRoomSpawn(room)
    },

    // Gets a list of spawns for the given room
    GetRoomSpawns(room) {
      return getRoomSpawns(room)
    },

    // Gets a list of energy sources inside the room the given creep is in
    GetRoomEnergySources(room) {
      return getRoomEnergySources(room)
    },

    // Gets a list of miniral sources inside the room the given creep is in
    GetRoomMiniralSources(room) {
      return getRoomMiniralSources(room)
    },

    // Returns the closest position(B) to the given position(A)
    GetClosestByPos(posA, ...posB){
      return getClosestByPos(posA, ...posB)
    },

    // Returns the closest position(B) to the given position(A)
    GetClosestByObject(posA, objects){
      return getClosestByObject(posA, objects)
    },

    // Gets the closest thing to a creep by type
    GetClosestByType(creep, type) {
      return getClosestByType(creep, type)
    },

    // Gets the spawn closest to the creep
    GetClosestSpawn(creep) {
      return getClosestByType(creep, FIND_MY_SPAWNS)
    },
  
    // Gets the sources closest to the creep
    GetClosestSource(creep) {
        return getClosestByType(creep, FIND_SOURCES)
    },

    // Gets the distance between two points: posA:{x,y} and posB:{x,y}
    GetDistance(posA, posB) {
      return getDistance(posA, posB)
    }
};

