const config = require('config')
const util = require('util')
const creep_util = require('creep.util')

function Build(creep, constructionSite) {
    if(creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
        creep.moveTo(constructionSite);
    }
}

function UpgradeController(creep){
    creep.moveTo(creep.room.controller)
    creep.upgradeController(creep.room.controller)
}

function getEnergy(creep) {
	var closest_spawn = util.GetClosestByType(creep, FIND_MY_SPAWNS)
    if(creep.withdraw(closest_spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(closest_spawn);
    }
}

module.exports = {

    run(creep) {
        // Id the builder doesn't have energy instruct the builder to head to the nearest spawn.
        if(creep.carry.energy == 0) {
            getEnergy(creep)
		} else {
            
            // Fail-safe to make sure the builders don't keep using all the energy
            if(Memory.harvesters.length < config.GetMaxHarvesters()){
                creep.memory.activerole = "harvester"
            } else {

                // Checks to see if there are any active construction sites.
                // If there are multiple the creep will go to the closest one.
                if(creep.room.memory.construction.length > 0){
                    var construction_site_pos = util.GetClosestByPos(creep.pos,creep.room.memory.construction)
                    creep.memory.activetask.task = "build"
                    creep.memory.activetask.pos.x = construction_site_pos.x
                    creep.memory.activetask.pos.y = construction_site_pos.y
                } else {
                    creep.memory.activetask.task = "upgrade_controller"
                }

                switch(creep.memory.activetask.task) {

                    case "build":
                        var posx = creep.memory.activetask.pos.x
                        var posy = creep.memory.activetask.pos.y
                        Build(creep, room.lookAt(posx,posy)[0].constructionSite)
                        break;
                    
                    case "upgrade_controller":
                        UpgradeController(creep)
                        break;
    
                  default:
                    creep.memory.activetask.task = "upgrade_controller"
                }
            }
        }
        return creep
    }
};
