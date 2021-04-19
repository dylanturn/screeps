/************************************************
* Responsible for making descisions about which *
* structures to create construction sites for.  *
*************************************************/

const util = require('util');
const construction_road = require('construction.road');
const construction_extension = require('construction.extension');

function updateConstructionSiteList(room){
    // Clear the existing array
    room.memory.construction = []

    // Generate a new one
    var construction_sites = room.find(FIND_MY_CONSTRUCTION_SITES);
    for (i in construction_sites){
        room.memory.construction.push(construction_sites[i].pos)
    }
}

// Ensures the global memory objects will exist.
function setupMemory(room) {

    if(!room.memory.build_queue) {
        if(!Array.isArray(room.memory.build_queue)){
            room.memory.build_queue = []    
        }
    }

    if(!room.memory.construction) {
        if(!Array.isArray(room.memory.construction)) {
            room.memory.construction = []    
        }
    }
}

module.exports = {
    setup(room) {
        setupMemory(room)
        construction_road.ConstructRoads(room, util.GetFirstRoomSpawn(room))
    },
    run(room) {

        updateConstructionSiteList(room)

        var spawns = util.GetRoomSpawns(room)
        for(i in spawns){
            // Handles constructing new spawn extensions
            construction_extension.ConstructSpawnExtensions(room, spawns[i])
        }
    }
}
