const room_controller = require('./room.controller')
const construction_controller = require('./construction.controller')
const creep_controller = require('./creep.controller')

for(var i in Game.rooms){
    room = Game.rooms[i]

    if(room.memory.setup_complete) {
        room_controller.Run(room)
        construction_controller.run(room)
        creep_controller.run(room)

    } else {
        console.log("Setting up room for the first time!")
        room_controller.Setup(room)
        construction_controller.setup(room)
        creep_controller.setup(room)
        room.memory.setup_complete = true
        room.memory.print_tick_stats = true
        console.log("Room Setup Complete!")
    }

    if(room.memory.print_tick_stats) {
        console.log(`--- Tick Stats: ${room.name} ---`);
        console.log(`Harvesters:       ${Memory.harvesters.length}`);
        console.log(`Builders:         ${Memory.builders.length}`);
        console.log(`Energy Available: ${room.energyAvailable}`)
        console.log(`Energy Capacity:  ${room.energyCapacityAvailable}`)
        console.log(`Energy Used(%):   ${((room.energyAvailable / room.energyCapacityAvailable)*100).toFixed(2)}%`)
    }
}
    