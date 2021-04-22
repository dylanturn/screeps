const constants = require('./constants')
const creep_util = require('./creep.util')

function getSpec(){
	let role_spec = creep_util.GetBaseRoleSpec()
    role_spec.primary_role = constants.CREEP_ROLES.HARVESTER
    role_spec.valid_secondary_roles = [constants.CREEP_ROLES.BUILDER]
	role_spec.parts = [ WORK, CARRY, MOVE ]
    role_spec.active_role = role_spec.primary_role
    return role_spec
}

function mineIdealSource(creep){
	var source = creep_util.GetIdealEnergySource(creep)
	if (ERR_NOT_IN_RANGE === creep.harvest(source)) {
		return creep.moveTo(source)
	}
}

function mineAlternateSource(creep){
	var source = Game.getObjectById(Memory.creeps[creep.name].alternate_source)
	if (ERR_NOT_IN_RANGE === creep.harvest(source)) {
		return creep.moveTo(source)
	}
}

function storeEnergy(creep){
	var store = creep_util.GetIdealEnergyStore(creep, constants.DEPOSIT_ENERGY)
	if (ERR_NOT_IN_RANGE === creep.transfer(store, RESOURCE_ENERGY)) {
		return creep.moveTo(store);
	} else {
		return OK
	}
}

function run(creep) {
	creep.say(creep.memory.active_role, false)

	if(creep.carry.energy < creep.carryCapacity) {
		if(Memory.creeps[creep.name].mine_alternate) {
			mineAlternateSource(creep)
		} else {
			if(ERR_NO_PATH == mineIdealSource(creep)){
				Memory.creeps[creep.name].mine_alternate = true
				Memory.creeps[creep.name].alternate_source = creep_util.GetAlternateEnergySource(creep).id
			}
		}
	} else {
		if(OK == storeEnergy(creep)){
			Memory.creeps[creep.name].mine_alternate = false
			Memory.creeps[creep.name].alternate_source = null
		}
	}
	return creep
}

module.exports = {
    GetSpec(){
        return getSpec()
    },
    Run(creep){
        return run(creep)
    }
};
