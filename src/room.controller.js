
function setup(room) {
    if(!room.memory.spawns) {
        if(!Array.isArray(room.memory.spawns)) {
            room.memory.spawns = []
        }
    }
    if(!room.memory.sources) {
        if(!Array.isArray(room.memory.sources)) {
            room.memory.sources = {}
            var sources = room.find(FIND_SOURCES)
            for (var i in sources){
                room.memory.sources[sources[i].id] = {"pos": sources[i].pos}
            }
        }
    }
}

module.exports = {
    Setup(room){
        setup(room)
    },
    Run(room) {
    }
}