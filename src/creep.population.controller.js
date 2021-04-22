/************************************************
* Manages the population of our creeps by role. *
*************************************************/

const constants = require('./constants')
const creep_role_harvester = require('./creep.role.harvester')
const creep_role_worker = require('./creep.role.worker')
const creep_role_builder = require('./creep.role.builder')
const creep_role_transporter = require('./creep.role.transporter')

// Configurable parameters.
const max_harvesters = 4;
const max_builders = 4;
const max_workers = 2;
const max_transporters = 4;

function getDesiredHarvesters(room){
    return max_harvesters
}
function getDesiredBuilders(room){
    return max_builders
}
function getDesiredWorkers(room){
    return max_workers
}
function getDesiredTransporters(room){
    return max_transporters
}

function reassignCreep(new_role){
    // Create a list of creeps that don't already have the new role
    // Next, filter out the creeps that aren't configured for the new role.
    reassignment_candidates = Object.values(Game.creeps).filter(
        function (creep) {
            return creep.memory.active_role != new_role
        }
    ).filter(
        function (creep) {
            return creep.memory.valid_secondary_roles.includes(new_role)
        }
    )
    // Update the active role
    if(reassignment_candidates.length > 0){
        reassignment_candidates[0].memory.active_role = constants.CREEP_ROLES.HARVESTER
        return reassignment_candidates[0]
    } else {
        return null
    }
    
}

function spawnCreep(spawn, creep_spec) {
    // ToDo: Look into using the energyStructures parameter to prioritize
    //       pulling energy from extensions near energy sources.
    return spawn.createCreep(creep_spec.parts, null, {
        active_role: creep_spec.active_role,
        primary_role: creep_spec.primary_role,
        valid_secondary_roles: creep_spec.valid_secondary_roles,
        active_task: {"task": null, "pos": {"room": null, "x": 0, "y": 0}}
    })
}
function setup(room) {}
function run(room) {

    var harvester_count = room.memory.harvesters.length
    var builder_count = room.memory.builders.length

    // Fail-safe to make sure the builders don't keep using all the energy
    if(harvester_count < getDesiredHarvesters(room)){
        reassignCreep(constants.CREEP_ROLES.HARVESTER)
    }
    
    // First make sure there are fewer builders than configured
    // Then make sure there are more harvesters than configured
	if(builder_count < getDesiredBuilders){
		if(harvester_count > getDesiredHarvesters){
			reassignCreep(constants.CREEP_ROLES.BUILDER)
		}
	}
    /******************
    * Screep Spawning *
    ******************/
    var spawn = room.find(FIND_MY_SPAWNS)[0]
    
    if((spawn.energy == 300) && (harvester_count == 0)) {
        spawnCreep(spawn, creep_role_harvester.GetSpec())
    }
    
    if (harvester_count < getDesiredHarvesters(room)) {
        spawnCreep(spawn, creep_role_harvester.GetSpec())
    }
    
    if (builder_count < getDesiredBuilders(room) && harvester_count >= getDesiredHarvesters(room)) {
        spawnCreep(spawn, creep_role_builder.GetSpec())
    }

}

module.exports = {
    GetDesiredHarvesters(room){
        return getDesiredHarvesters(room)
    },
    GetDesiredBuilders(room){
        return getDesiredBuilders(room)
    },
    GetDesiredWorkers(room){
        return getDesiredWorkers(room)
    },
    GetDesiredTransporters(room){
        return getDesiredTransporters(room)
    },
    Setup(room){
        return setup(room)
    },
    Run(room){
        return run(room)
    }
};
