var config = require('../config')
var room_construct = require('../room/foreman')

module.exports = {
    run(room, spawn) {
        var origX = spawn.pos.x
        var origY = spawn.pos.y
        
        var posX1 = origX-1   // x-1
        var posY1 = origY-1   // y-1

        var posX2 = origX+1   // x+1
        var posY2 = origY-1   // y-1
        
        var posX3 = origX+1   // x+1
        var posY3 = origY+1   // y+1
        
        var posX4 = origX-1   // x-1
        var posY4 = origY+1   // y+1
        
        if (room.memory.build_queue.length < config.GetBuildQueueLimit()){
            
            console.log(room.controller.level)
            
            if (room.controller.level >= 2){
                if(!room_construct.BuildOnPlain(room, posX1, posY1, STRUCTURE_EXTENSION)){
                    if(!room_construct.BuildOnPlain(room, posX2, posY2, STRUCTURE_EXTENSION)){
                        if(!room_construct.BuildOnPlain(room, posX3, posY3, STRUCTURE_EXTENSION)){
                            room_construct.BuildOnPlain(room, posX4, posY4, STRUCTURE_EXTENSION)           
                        }
                    }
                }
            }
        }
    }
}
