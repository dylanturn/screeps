const construction_util = require('./construction.util')

module.exports = {
    ConstructRoad(room, posA, posB){
        var result = PathFinder.search(posA, {"pos": posB, "range": 1})
        for(let k in result.path){
            var path = result.path[k]
            construction_util.BuildOnPlain(room, path.x, path.y, STRUCTURE_ROAD)
        }
    },
    ConstructRoads(room, spawn) {
        var energy_sources = room.find(FIND_SOURCES)
        for(let i in energy_sources) {

            // Construct roads from the spawns to the energy sources
            var result = PathFinder.search(spawn.pos, {"pos": energy_sources[i].pos, "range": 1})
            for(let k in result.path){
                var path = result.path[k]
                construction_util.BuildOnPlain(room, path.x, path.y, STRUCTURE_ROAD)
            }

            // Construct roads from the energy sources to the spawns
            var result = PathFinder.search(energy_sources[i].pos, {"pos": spawn.pos, "range": 1})
            for(let k in result.path){
                var path = result.path[k]
                construction_util.BuildOnPlain(room, path.x, path.y, STRUCTURE_ROAD)
            }
        }
    }
}
