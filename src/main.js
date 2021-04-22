const room_controller = require('./room.controller')
const creep_controller = require('./creep.controller')
const construction_controller = require('./construction.controller')
const creep_population_controller = require('./creep.population.controller')

const creep_role_harvester = require('./creep.role.harvester')
const creep_role_worker = require('./creep.role.worker')
const creep_role_builder = require('./creep.role.builder')
const creep_role_transporter = require('./creep.role.transporter')

for(let i in Game.rooms){
    room = Game.rooms[i]

    for(var z in Game.creeps){
        var creep = Game.creeps[z]
        if(creep.memory.activerole == "harvester"){
            var harv_spec = creep_role_harvester.GetSpec()
            creep.memory.active_role = harv_spec.active_role
            creep.memory.primary_role = harv_spec.primary_role
            creep.memory.valid_secondary_roles = harv_spec.valid_secondary_roles
          }
      
      
          if(creep.memory.activerole == "builder"){
            var build_spec = creep_role_builder.GetSpec()
            creep.memory.active_role = build_spec.active_role
            creep.memory.primary_role = build_spec.primary_role
            creep.memory.valid_secondary_roles = build_spec.valid_secondary_roles
          }
    }

    if(room.memory.setup_complete) {
        room_controller.Run(room)
        construction_controller.Run(room)
        creep_population_controller.Run(room)
        creep_controller.Run(room)

    } else {
        console.log("Setting up room for the first time!")
        room_controller.Setup(room)
        construction_controller.Setup(room)
        creep_controller.Setup(room)
        room.memory.setup_complete = true
        room.memory.print_tick_stats = true
        Memory.print_tick_stats = true
        console.log("Room Setup Complete!")
    }

    if(Memory.print_tick_stats && room.memory.print_tick_stats) {
        console.log(`--- Tick Stats: ${room.name} ---`);
        console.log(`Harvesters:       ${room.memory.harvesters.length}`);
        console.log(`Builders:         ${room.memory.builders.length}`);
        console.log(`Energy Available: ${room.energyAvailable}`)
        console.log(`Energy Capacity:  ${room.energyCapacityAvailable}`)
        console.log(`Energy Used(%):   ${((room.energyAvailable / room.energyCapacityAvailable)*100).toFixed(2)}%`)
    }
}
