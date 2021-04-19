var creep_util = require('creep.util')

module.exports = {
    run(creep) {
		if(creep.carry.energy < creep.carryCapacity) {
            var source = creep_util.GetIdealEnergySource(creep)
			creep.moveTo(source);
			creep.harvest(source);
		} else {
			var store = creep_util.GetIdealEnergyStore(creep)
			creep.moveTo(store);
			creep.transfer(store, RESOURCE_ENERGY);
		}
		return creep
    }
};
