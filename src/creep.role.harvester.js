var util = require('util')

module.exports = {
    run(creep) {

		if(creep.carry.energy < creep.carryCapacity) {
            var sources = util.GetClosestSource(creep)
			creep.moveTo(sources);
			creep.harvest(sources);
		} else {
			creep.moveTo(util.GetClosestSpawn(creep));
			creep.transfer(util.GetClosestSpawn(creep), RESOURCE_ENERGY);
		}
		

		if(creep.carry.energy < creep.carryCapacity) {
			var sources = util.GetClosestSource(creep)
			creep.moveTo(sources);
			creep.harvest(sources);
		} else {
			creep.moveTo(util.GetClosestSpawn(creep));
			creep.transfer(util.GetClosestSpawn(creep), RESOURCE_ENERGY);
		}
    }
};
