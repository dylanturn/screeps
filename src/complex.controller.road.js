const { ConstructComplex } = require('./complex.util')
const { LOG_LEVEL } = require('./constants')
const { LogMsg } = require('./logger')

function constructRoads(room, spawn) {
  
  LogMsg(LOG_LEVEL.DEBUG, `Construct for spawn: ${JSON.stringify(spawn)}`)

  const flags = room.find(FIND_FLAGS)
  for(let i in flags){
    let flag = flags[i]
    if (flag.memory["template"] === "spawn_template") {
    }
  }

  const destinations = room.find(FIND_SOURCES).concat(
    room.find(FIND_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_CONTROLLER})
  )

  for (let i in destinations) {
    // Construct roads from the spawns to the energy sources
    var result = PathFinder.search(spawn.pos, { "pos": destinations[i].pos, "range": 1 })
    for (let k in result.path) {
      var path = result.path[k]
      LogMsg(LOG_LEVEL.TRACE, `Construct road: ${JSON.stringify(path)}`)
      ConstructComplex("single_road_template", path)
    }
  }
  return true
}

module.exports = {
  ConstructRoads(room) {
    const spawns = room.find(FIND_MY_SPAWNS)
    for(let i in spawns){
        let spawn = spawns[i]
        return constructRoads(room, spawn)
    }
  }
}
