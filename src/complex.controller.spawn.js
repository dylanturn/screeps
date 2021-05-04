const { ConstructComplex } = require('./complex.util')
const templates = require('./complex.template');

const ordered_spawn_template_list = [
  templates.TEMPLATE_SPAWN,
  templates.TEMPLATE_SPAWN_ALT,
]

const ordered_spawn_extension_template_list = [
  templates.TEMPLATE_SPAWN_EXTENSION,
  templates.TEMPLATE_SPAWN_EXTENSION_ALT,
]

module.exports = {
  ConstructSpawns(room) {
    return constructSpawns(room)
  }
}

function constructSpawns(room) {

  // Looks for spawns that need complexes
  const spawns = room.find(FIND_MY_SPAWNS)
  for(let i in spawns){
    let spawn = spawns[i]
    for(let j in ordered_spawn_extension_template_list){
      let template = ordered_spawn_extension_template_list[j]
      if(ConstructComplex(template, spawn.pos)){
        
        return true
      }
    }
  }

  // Look for spawn_template flags
  const flags = room.find(FIND_FLAGS)
  for(let i in flags){
    let flag = flags[i]
    if (flag.memory["template"] === "spawn_template") {
      for(let j in ordered_spawn_template_list){
        let template = ordered_spawn_template_list[j]
        if(ConstructComplex(template, flag.pos)){
          flag.remove()
          
          return true
        }
      }
    }
  }

  return false
}