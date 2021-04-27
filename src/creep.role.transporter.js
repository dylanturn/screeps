const constants = require('./constants')
const creep_util = require('./creep.util')

function getSpec() {
  let role_spec = creep_util.GetBaseRoleSpec()
  role_spec.primary_role = constants.CREEP_ROLES.TRANSPORTER
  role_spec.valid_secondary_roles = [constants.CREEP_ROLES.HARVESTER]
  role_spec.parts = [WORK, CARRY, MOVE]
  role_spec.active_role = role_spec.primary_role
  return role_spec
}

function run(creep) {
  creep.say(creep.memory.active_role, false)

  const energy_store_types = [STRUCTURE_CONTAINER]
  
  if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
    
    var stores = creep.room.find(FIND_STRUCTURES, {
      filter: (i) => 
        energy_store_types.includes(i.structureType) &&
        i.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    })

    var store = creep.pos.findClosestByPath(stores)
    if (ERR_NOT_IN_RANGE === creep.withdraw(store, RESOURCE_ENERGY)) {
      return creep.moveTo(store);
    }

  } else {

    var spawns = creep.room.find(FIND_MY_SPAWNS, {
      filter: (i) => i.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    }).concat(creep.room.find(FIND_STRUCTURES, {
      filter: (i) => i.structureType === STRUCTURE_EXTENSION &&
                     i.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                     
    }))

    var spawn = creep.pos.findClosestByPath(spawns)
    if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(spawn);
    }

  }

  return {
		"id": creep.id,
		"name": creep.name,
		"role": creep.saying,
		"ticks_to_live": creep.ticksToLive
	}
}

module.exports = {
  GetSpec() {
    return getSpec()
  },
  Run(creep) {
    return run(creep)
  }
};
