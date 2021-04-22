
const util = require('./util')
const constants = require('./constants')
const creep_util = require('./creep.util')

function getSpec(){
    let role_spec = creep_util.GetBaseRoleSpec()
    role_spec.primary_role = constants.CREEP_ROLES.BUILDER
    role_spec.valid_secondary_roles = [constants.CREEP_ROLES.HARVESTER]
    role_spec.parts = [ WORK, CARRY, MOVE ]
    role_spec.active_role = role_spec.primary_role
    return role_spec
}

function build(creep, constructionSite) {
    if(creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
        creep.moveTo(constructionSite);
    }
}

function upgradeController(creep){
    creep.moveTo(creep.room.controller)
    creep.upgradeController(creep.room.controller)
}

function getEnergy(creep) {
	var closest_spawn = creep_util.GetIdealEnergyStore(creep, constants.WITHDRAW_ENERGY)
    if(creep.withdraw(closest_spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(closest_spawn);
    }
}

function findDamagedStructures(creep){
    return creep.room.find(FIND_STRUCTURES, {
        // TODO: Fix
        // UPDATE: This was dump. 75% just winds up becoming the new 100%
        // repair if health is less than 75%
        filter: object => ((object.hits/object.hitsMax)*100)<75
    });
}

function repairStructures(creep){
    var target_structure = util.GetClosestByObject(creep.pos,findDamagedStructures(creep))        
    if( creep.repair(target_structure) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target_structure);
    }
}

function run(creep) {
    creep.say(creep.memory.active_role, false)

    // Id the builder doesn't have energy instruct the builder to head to the nearest spawn.
    if(creep.carry.energy == 0) {
        getEnergy(creep)
    } else {
                
        // Checks to see if there are any structures that need fixing. Fixes them.
        if(findDamagedStructures(creep).length > 0){
            creep.memory.active_task.task = "repair"
        }
        
        // Checks to see if there are any active construction sites.
        // If there are multiple the creep will go to the closest one.
        else if(creep.room.memory.construction.length > 0){
            var construction_site_pos = util.GetClosestByPos(creep.pos,creep.room.memory.construction)
            creep.memory.active_task.task = "build"
            creep.memory.active_task.pos.x = construction_site_pos.x
            creep.memory.active_task.pos.y = construction_site_pos.y
        } 
        
        // If the creeps got nothing better to do then have it upgrade the controller
        else {
            creep.memory.active_task.task = "upgrade_controller"
        }


        switch(creep.memory.active_task.task) {
            case "repair":
                repairStructures(creep)
                break;

            case "build":
                var posx = creep.memory.active_task.pos.x
                var posy = creep.memory.active_task.pos.y
                build(creep, room.lookAt(posx,posy)[0].constructionSite)
                break;
            
            case "upgrade_controller":
                upgradeController(creep)
                break;

            default:
            creep.memory.active_task.task = "upgrade_controller"
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
