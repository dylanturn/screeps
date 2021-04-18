var config = require('config')

var energylevel = Game.spawns[config.Get_Spawn_Name()].energy

module.exports = {
    run(spawn, harvester_count, builder_count) {
        
        if(energylevel == 300) {
            if(harvester_count == 0){
                var spec = config.Get_Harvester_Spec();
                spawn.createCreep([WORK, CARRY, MOVE] ,null, { primaryrole: spec.primaryrole, secondaryrole: spec.secondaryrole, activerole: spec.activerole, activetask: spec.activetask })
            }
        }

        if (harvester_count < config.getMaxHarvesters()) {
            var spec = config.Get_Harvester_Spec();
                spawn.createCreep([WORK, CARRY, MOVE] ,null, { primaryrole: spec.primaryrole, secondaryrole: spec.secondaryrole, activerole: spec.activerole, activetask: spec.activetask })
        }

        if (builder_count < config.getMaxBuilders()) {
            var spec = config.Get_Builder_Spec();
            spawn.createCreep([WORK, CARRY, MOVE] ,null, { primaryrole: spec.primaryrole, secondaryrole: spec.secondaryrole, activerole: spec.activerole, activetask: spec.activetask })
        }
    },

    Spawn_New(spawn, creep_spec) {
        spawn.createCreep([WORK, CARRY, MOVE],null, { primaryrole: creep_spec.primaryrole, secondaryrole: creep_spec.secondaryrole, activerole: creep_spec.activerole, activetask: creep_spec.activetask }) 
    }

};

