var config = require('../../config')
var creep_populatiom_manager = require('../../creep/population_manager')
var room_construct = require('../foreman')

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

        if(room_construct.BuildOnPlain(room, posX1, posY1, STRUCTURE_EXTENSION)){
            var creep_spec = config.Get_Builder_Spec()
            var task_spec = config.GetTaskSpec()
            task_spec.task = "build"
            task_spec.room = room.name
            task_spec.posx = posX1
            task_spec.posy = posY1
            creep_spec.activetask = task_spec
            creep_populatiom_manager.Spawn_New(spawn, creep_spec)
        }

        /*if( room.lookAt(posX1,posY1)[0].type == "terrain" ) {
            
           if( room.lookAt(posX1,posY1)[0].terrain == "plain" ) {

                room.createConstructionSite(posX1,posY1,STRUCTURE_EXTENSION)
                activetask.room = room.name
                activetask.pos.x = posX1
                activetask.pos.y = posY1
                creep_spec.activetask = JSON.stringify(activetask)
                creep_populatiom_manager.Spawn_New(spawn, creep_spec)

            } 
        }

        if( room.lookAt(posX2,posY2)[0].type == "terrain" ) {

            if( room.lookAt(posX2,posY2)[0].terrain == "plain" ) {

                room.createConstructionSite(posX2,posY2,STRUCTURE_EXTENSION)

            }
        }

        if( room.lookAt(posX3,posY3)[0].type == "terrain" ) {

            if( room.lookAt(posX3,posY3)[0].terrain == "plain" ) {

                room.createConstructionSite(posX3,posY3,STRUCTURE_EXTENSION)

            }
        }

        if( room.lookAt(posX4,posY4)[0].type == "terrain" ) {

            if( room.lookAt(posX4,posY4)[0].terrain == "plain" ) {

                room.createConstructionSite(posX4,posY4,STRUCTURE_EXTENSION)

            }
        }*/

    }
}
