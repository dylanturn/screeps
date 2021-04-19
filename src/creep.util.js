var util = require('util')

function getIdealEnergySource(creep) {
	return util.GetClosestSource(creep)
}

function getIdealEnergyStore(creep) {
	var eligible_stores = []
	var spawns = creep.room.find(FIND_MY_SPAWNS)
	for (var i in spawns){
		var spawn = spawns[i]
		if(spawn.energy < spawn.energyCapacity){
			eligible_stores.push(spawn)
		}
	}
	return util.GetClosestByObject(creep.pos, eligible_stores)
}

module.exports = {

  // Returns the closest instance of the given type for the given creep
  GetClosestByType(creep, type) {
    return util.getClosestByType(creep, type)
  },

  // Returns the spawn closest to the given creep
  GetClosestSpawn(creep) {
    return util.getClosestByType(creep, FIND_MY_SPAWNS)
  },

  // Returns the spawn closest to the given creep
  GetClosestExtension(creep) {
    return util.getClosestByType(creep, STRUCTURE_EXTENSION)
  },

  // Returns the ideal energy source for the given creep
  GetIdealEnergySource(creep) {
    return getIdealEnergySource(creep)
  },

  // Returns the ideal energy store for the given creep
  GetIdealEnergyStore(creep) {
    return getIdealEnergyStore(creep)
  }
}