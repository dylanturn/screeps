const util = require('util');

var construction_controller = require('construction.controller')
var creep_controller = require('creep.controller')

for(var room_name in Game.rooms){
    room = Game.rooms[room_name]

    // TODO: Maybe move all this to room.controller?
    if(!room.memory.setup_complete) {
        console.log("Setting up room for the first time!")
        construction_controller.setup(room)
        creep_controller.setup(room)
        room.memory.setup_complete = true
        console.log("Room Setup Complete!")
    }

    construction_controller.run(room)
    creep_controller.run(room)

    console.log(" -- Tick Stats "+ room.name +" -- ");
    console.log("Energy Level: " + util.GetFirstRoomSpawn(room).energy);
    console.log("Harvesters:   " + Memory.harvesters.length);
    console.log("Builders:     " + Memory.builders.length);
}
    