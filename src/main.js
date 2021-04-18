var config = require('config');
var harvester = require('creep.role.harvester');
var builder = require('creep.role.builder');

var creep_populatiom_manager = require('creep.population_manager');
var creep_controller = require('creep.controller')

var spawn_extent = require('room.construct.spawn.extent')
var storage_manager = require('spawn.storage_mgmt')

var pending_tasks = []
var harvesters = []
var builders = []
var energylevel = Game.spawns[config.Get_Spawn_Name()].energy

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
        harvesters.push(harvester.run(creep));
        
    }
    
    if(creep.memory.activerole == "builder") {
        builders.push(builder.run(creep));
    }
}

for(var room in Game.rooms){
    if(!Game.rooms[room].memory.sources) {
        if(!Array.isArray(Game.rooms[room].memory.build_queue)) {
            Game.rooms[room].memory.sources = []    
        }
    }
    if(!Game.rooms[room].memory.build_queue) {
        if(!Array.isArray(Game.rooms[room].memory.build_queue)){
            Game.rooms[room].memory.build_queue = []    
        }
    }
}

var spawn = Game.spawns[config.Get_Spawn_Name()]
creep_populatiom_manager.run(spawn, harvesters.length, builders.length);

for (var i in Game.spawns) {
    storage_manager.run(Game.rooms[Game.spawns[i].room.name], Game.spawns[i])
}

console.log(" -- Tick Stats "+ config.Get_Spawn_Name() +" -- ");
console.log("Energy Level: " + energylevel);
console.log("Harvesters:   " + harvesters.length);
console.log("Builders:     " + builders.length);
