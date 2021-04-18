var room_construct = require('room.construct')
var creep_controller = require('creep.controller')

function Build(creep, constructionSite) {
    if(creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
        creep.moveTo(constructionSite);
    }
}

function UpgradeController(creep){
    creep.moveTo(creep.room.controller)
    creep.upgradeController(creep.room.controller)
}



module.exports = {

    run(creep) {
        // Id the builder doesn't have energy instruct the builder to head to the nearest spawn.
        if(creep.carry.energy == 0) {
            creep_controller.GetEnergy(creep)
		} else {
        
            var room = Game.rooms[creep.memory.activetask.room]
            console.log(JSON.stringify(room))
            var posx = creep.memory.activetask.pos.x
            var posy = creep.memory.activetask.pos.y
            
            switch(creep.memory.activetask.task) {
    
                case "build":
                    console.log("Building at: " + posx + "," + posy )
                    console.log(JSON.stringify(room.lookAt(posx,posy)))
                    Build(creep, room.lookAt(posx,posy)[0].constructionSite)
                    break;
                
                case "upgrade_controller":
                    UpgradeController(creep)
                    break;
    
//                case "null":
//                    console.log(creep.room.name)
//                    creep.memory.activetask = room_construct.PopBuildTask(creep.room)
//                    break;    
                    
              default:
                creep.memory.activetask.task = "upgrade_controller"
            }
        }
    }
};
