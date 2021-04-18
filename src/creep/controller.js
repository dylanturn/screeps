var config = require('../config')

function getEnergy(creep) {
	var closest_spawn = getClosestByType(creep, FIND_MY_SPAWNS)
    if(creep.withdraw(closest_spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(closest_spawn);
    }
}

// Calculates the distance between two points on a 2D grid
function getDistance(posA, posB) {
    return Math.sqrt(Math.pow((posA.x-posB.x),2)+Math.pow((posA.y-posB.y),2))
}

// Determines the closest object to a creep by type
function getClosestByType(creep, type) {
    var found_types = creep.room.find(type)
    var smallest_distance = Number.MAX_SAFE_INTEGER
    var closest_found_type = null
    
    for (var index in found_types){
        var found_type = found_types[index]
        var distance = getDistance(creep.pos, found_type.pos)
        if (distance < smallest_distance) {
            smallest_distance = distance
            closest_found_type = found_type
        }
    }
    return closest_found_type
}

module.exports = {
    run() {
        
    },
    
    // Has the creep head to the nearest spawn to get energy
    GetEnergy(creep){
        getEnergy(creep)
    },
    
    // Finds the closes thing by type to a creep
    GetClosestByType(creep, type){
        return getClosestByType(creep, type)
    },
    
    // Gets the spawn closest to the creep
    GetClosestSpawn(creep) {
        return getClosestByType(creep, FIND_MY_SPAWNS)
    },
    
    // Gets the sources closest to the creep
    getClosestSource(creep) {
        return getClosestByType(creep, FIND_SOURCES)
    }
};

