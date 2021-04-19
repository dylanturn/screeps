var construction_util = require('construction.util')
var util = require('util')
var config = require('config')

module.exports = {
    ConstructRoads(room, spawn) {
        energy_sources = room.find(FIND_SOURCES)
        for(i in energy_sources) {
            result = PathFinder.search(spawn.pos, {"pos": energy_sources[i].pos, "range": 1})
            for(k in result.path){
                var path = result.path[k]
                construction_util.BuildOnPlain(room, path.x, path.y, STRUCTURE_ROAD)
            }
        }
    }
}
