function getSpawns(room) {
  return room.find(FIND_MY_SPAWNS)
}

function getEnergySources(room) {
  return room.find(FIND_SOURCES)
}

function getMineralSources(room) {
  return room.find(FIND_MINERALS)
}

module.exports = {
  // Returns a list of the spawns for the given room
  GetSpawns(room) {
    return getSpawns(room)
  },

  // Returns a list of energy sources inside the given room
  GetEnergySources(room) {
    return getEnergySources(room)
  },

  // Returns a list of mineral sources inside the given room
  GetMineralSources(room) {
    return getMineralSources(room)
  }
};
