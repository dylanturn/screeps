var config = require('config')
var creep_controller = require('creep.controller')

module.exports = {
    run(creep) {

		if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep_controller.getClosestSource(creep)
			creep.moveTo(sources);
			creep.harvest(sources);
		} else {
			creep.moveTo(creep_controller.GetClosestSpawn(creep));
			creep.transfer(creep_controller.GetClosestSpawn(creep), RESOURCE_ENERGY);
		}
		

		if(creep.carry.energy < creep.carryCapacity) {
			var sources = creep_controller.getClosestSource(creep)
			creep.moveTo(sources);
			creep.harvest(sources);
		} else {
			creep.moveTo(creep_controller.GetClosestSpawn(creep));
			creep.transfer(creep_controller.GetClosestSpawn(creep), RESOURCE_ENERGY);
		}
    }
};
