const util = require('./util')
const room_util = require('./room.util')
const constants = require('./constants')

function getBaseTaskSpec() {
  return { "task": null, "pos": { "room": null, "x": 0, "y": 0 } }
}

function getBaseRoleSpec() {
  return { "parts": [], "active_task": getBaseTaskSpec(), "active_role": null, "primary_role": null, "valid_secondary_roles": [] }
}

function getClosestSource(creep) {
  return creep.pos.findClosestByRange(FIND_SOURCES)
}

function getIdealEnergySource(creep) {
  return getClosestSource(creep)
}


function widthdrawEnergy(creep) {
  var closest_store = getIdealEnergyStore(creep, constants.WITHDRAW_ENERGY)
  if (creep.withdraw(widthdrawEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    creep.moveTo(widthdrawEnergy);
  }
}

function depositEnergy(creep) {
  var store = getIdealEnergyStore(creep, constants.DEPOSIT_ENERGY)
  if (ERR_NOT_IN_RANGE === creep.transfer(store, RESOURCE_ENERGY)) {
    return creep.moveTo(store);
  } else {
    return OK
  }
}

function getAlternateEnergySource(creep) {
  var ideal_source = getIdealEnergySource(creep)
  var room_sources = room_util.GetEnergySources(creep.room)
  const index = room_sources.indexOf(ideal_source);
  if (index > -1) {
    room_sources.splice(index, 1);
  }
  return util.GetClosestByObject(creep.pos, room_sources)
}

function getIdealEnergyStore(creep, ACTION) {
  var room = creep.room

  const energy_store_types = [STRUCTURE_CONTAINER, STRUCTURE_EXTENSION]

  switch (ACTION) {

    // If we're trying to load energy then we need to find stores that have energy
    case constants.WITHDRAW_ENERGY:
      var eligible_stores = room.find(FIND_STRUCTURES, {
        filter: (i) => energy_store_types.includes(i.structureType) &&
          i.store.getUsedCapacity(RESOURCE_ENERGY) > 0
      }).concat(room.find(FIND_MY_SPAWNS, {
        filter: (i) => i.store.getUsedCapacity(RESOURCE_ENERGY) > 0
      }))
      break;

    // If we're trying to deposit energy then we need to find stores that aren't empty
    // First locates all the containers and extensions
    // Second, combines the first list with a second list of MY spawns
    // Third, sorts then and returns the closest one.
    case constants.DEPOSIT_ENERGY:
      var eligible_stores = room.find(FIND_STRUCTURES, {
        filter: (i) => energy_store_types.includes(i.structureType) &&
          i.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      }).concat(room.find(FIND_MY_SPAWNS, {
        filter: (i) => i.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      }))
      break;

    default:
      var eligible_stores
  }

  // Return the list of stores ordered by distance to the creep
  return util.GetClosestByObject(creep.pos, eligible_stores)

}

module.exports = {

  GetBaseTaskSpec() {
    return getBaseTaskSpec()
  },

  GetBaseRoleSpec() {
    return getBaseRoleSpec()
  },

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
  GetIdealEnergyStore(creep, ACTION) {
    return getIdealEnergyStore(creep, ACTION)
  },

  // Gets the sources closest to the creep
  GetClosestSource(creep) {
    return util.getClosestByType(creep, FIND_SOURCES)
  }
}