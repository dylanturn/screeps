const creep_util = require('creep.util')

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
	var store = creep_util.GetIdealEnergyStore(creep)
	if (ERR_NOT_IN_RANGE === creep.transfer(store, RESOURCE_ENERGY)) {
		return creep.moveTo(store);
	} else {
		return OK
	}
}

module.exports = {
    run(creep) {
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
};
