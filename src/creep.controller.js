/****************************************************************
* Responsible for helping the creeps decide which tasks to work *
*****************************************************************/

const creep_population_controller = require('creep.population.controller')
const harvester = require('creep.role.harvester');
const builder = require('creep.role.builder');

module.exports = {
    setup(room) {},
    run(room) {

        Memory.harvesters = []
        Memory.builders = []

        for (var i in Game.creeps) {
            var creep = Game.creeps[i];
            
            if(creep.memory.activetask == "idle") {
                creep.memory.activetask = JSON.parse('{ "task": "build", "room":"null", "pos":{ "x":"0", "y":"0" } }')
                creep.memory.activetask.task = "move"
                creep.memory.activetask.room = Game.creeps[i].room.name
                creep.memory.activetask.pos.x = 30
                creep.memory.activetask.pos.y = 30
                break;
            }
            
            if(creep.memory.activetask.task == "move") {
                var posx = creep.memory.activetask.pos.x
                var posy = creep.memory.activetask.pos.y
                creep.moveTo(posx,posy)
                break;
            }
        
            if(creep.memory.activerole == "harvester") {
                Memory.harvesters.push(harvester.run(creep));
                
            }
            
            if(creep.memory.activerole == "builder") {
                Memory.builders.push(builder.run(creep));
            }
        }
        creep_population_controller.run(room);
    }
};
