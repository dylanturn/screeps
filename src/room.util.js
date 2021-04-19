module.exports = {

    // Returns 1 spawn for the given room
    GetFirstSpawn(room) {
      return getFirstRoomSpawn(room)
    },

    // Returns a list of the spawns for the given room
    GetSpawns(room) {
        return getSpawns(room)
    },

    // Returns a list of energy sources inside the given room
    GetEnergySources(creep) {
      return getEnergySources(creep)
    },

    // Returns a list of mineral sources inside the given room
    GetMineralSources(creep) {
      return getMineralSources(creep)
    }
};

