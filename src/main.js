const { LogMsg } = require('./logger')
const { LOG_LEVEL } = require('./constants')
const room_controller = require('./room.controller')
const creep_controller = require('./creep.controller')
const construction_controller = require('./construction.controller')
const creep_population_controller = require('./creep.population.controller')
const complex_controller = require('./complex.controller')

if(typeof(Memory["complexes"]) === 'undefined')
  Memory["complexes"] = {}

if(typeof(Memory["complex_inventory"]) === 'undefined')
  Memory["complex_inventory"] = {}

if(typeof(Memory["complex_components"]) === 'undefined')
  Memory["complex_components"] = {}

if(typeof(Memory["extensions"]) === 'undefined')
  Memory["extensions"] = 0

Memory["print_tick_stats"] = false
Memory["log_level"] = LOG_LEVEL.ERROR

function surveyRoomTerrain(room){
  Memory["terrain_walls"] = []
  const terrain = new Room.Terrain(room.name);
  for(let y = 0; y < 50; y++) {
    for(let x = 0; x < 50; x++) {
        const tile = terrain.get(x, y);
        if(tile === TERRAIN_MASK_WALL){
          Memory["terrain_walls"].push(`${x}:${y}`)
        }
    }
  }
}

for (let i in Game.rooms) {
  var room = Game.rooms[i]

  if (room.memory["setup_complete"]) {
    room_controller.Run(room)
    complex_controller.Run(room)
    construction_controller.Run(room)
    creep_population_controller.Run(room)
    creep_controller.Run(room)
  } else {
    LogMsg(LOG_LEVEL.INFO, "Setting up room for the first time!")
    surveyRoomTerrain(room)
    room_controller.Setup(room)
    complex_controller.Setup(room)
    construction_controller.Setup(room)
    creep_controller.Setup(room)
    creep_population_controller.Setup(room)
    room.memory["setup_complete"] = true
    room.memory["print_tick_stats"] = true
    Memory["print_tick_stats"] = true
    LogMsg(LOG_LEVEL.INFO, "Room Setup Complete!")
  }

  if (Memory["print_tick_stats"] && room.memory["print_tick_stats"]) {
    console.log(`--- Tick Stats: ${room.name} ---`)
    console.log(`Harvesters:       ${room.memory["harvesters"].length}`)
    console.log(`Builders:         ${room.memory["builders"].length}`)
    console.log(`Workers:          ${room.memory["workers"].length}`)
    console.log(`Transporters:     ${room.memory["transporters"].length}`)
    console.log(`Energy Available: ${room.energyAvailable}`)
    console.log(`Energy Capacity:  ${room.energyCapacityAvailable}`)
    console.log(`Energy Used(%):   ${((room.energyAvailable / room.energyCapacityAvailable) * 100).toFixed(2)}%`)
  }
}
