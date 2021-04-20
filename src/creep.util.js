const util = require('util')

function getIdealEnergySource(creep) {
	return util.GetClosestSource(creep)
}

function getAlternateEnergySource(creep) {
  var ideal_source = getIdealEnergySource(creep)
  var room_sources = util.GetRoomEnergySources(creep.room)
  const index = room_sources.indexOf(ideal_source);
  if (index > -1) {
    room_sources.splice(index, 1);
  }
  return util.GetClosestByObject(creep.pos, room_sources)
}

function getIdealEnergyStore(creep) {
	var eligible_stores = []

  // Locates all the spawns that exist in the given creeps room
  var spawns = creep.room.find(FIND_MY_SPAWNS)
	for (var i in spawns){
		var spawn = spawns[i]
		if(spawn.energy < spawn.energyCapacity){
			eligible_stores.push(spawn)
		}
	}

  // Locates all the extensions that exist in the given creeps room
  var extensions = creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}})
	for (var i in extensions){
		var extension = extensions[i]
		if(extension.energy < extension.energyCapacity){
			eligible_stores.push(extension)
		}
	}

  // Locates all the storage containers that exist in the given creeps room
  var containers = creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}})
	for (var i in containers){
		var container = containers[i]
		if(container.energy < container.energyCapacity){
			eligible_stores.push(container)
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

  // Returns the next closest energy source for the given creep
  GetAlternateEnergySource(creep) {
    return getAlternateEnergySource(creep)
  },

  // Returns the ideal energy store for the given creep
  GetIdealEnergyStore(creep) {
    return getIdealEnergyStore(creep)
  }
}