const constants = require('./constants')
const creep_util = require('./creep.util')

function getSpec() {
  let role_spec = creep_util.GetBaseRoleSpec()
  role_spec.primary_role = constants.CREEP_ROLES.WORKER
  role_spec.valid_secondary_roles = [constants.CREEP_ROLES.BUILDER]
  role_spec.parts = [WORK, CARRY, MOVE]
  role_spec.active_role = role_spec.primary_role
  return role_spec
}

function upgradeController(creep) {
  if (OK !== creep.upgradeController(creep.room.controller)){
    creep.moveTo(creep.room.controller)
  }
}

function getEnergy(creep) {
  var closest_spawn = creep_util.GetIdealEnergyStore(creep, constants.WITHDRAW_ENERGY)
  if (creep.withdraw(closest_spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    creep.moveTo(closest_spawn);
  }
}

function run(creep) {
  creep.say(creep.memory.active_role, false)

  if (creep.carry.energy == 0) {
    getEnergy(creep)
  } else {
    upgradeController(creep)
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
}
