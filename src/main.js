const { LogMsg } = require('./util')
const { LOG_LEVEL } = require('./constants')
const room_controller = require('./room.controller')
const creep_controller = require('./creep.controller')
const construction_controller = require('./construction.controller')
const creep_population_controller = require('./creep.population.controller')

if (typeof Memory["tick"] === undefined) {
  Memory["tick"] = true
}

for (let i in Game.rooms) {
  var room = Game.rooms[i]

  if (room.memory["setup_complete"]) {
    if (Memory["tick"]) {
      room_controller.Run(room)
      construction_controller.Run(room)
      creep_population_controller.Run(room)
      Memory["tick"] = false
    } else {
      Memory["tick"] = true
    }

    creep_controller.Run(room)


  } else {
    LogMsg(LOG_LEVEL.INFO, "Setting up room for the first time!")
    room_controller.Setup(room)
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
