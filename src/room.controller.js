
function init_memory() {
    if(!room.memory.spawns) {
        if(!Array.isArray(room.memory.spawns)) {
            room.memory.spawns = []    
        }
    }
    if(!room.memory.sources) {
        if(!Array.isArray(room.memory.sources)) {
            room.memory.sources = []    
        }
    }
}

module.exports = {
    run(room) {



    }
}