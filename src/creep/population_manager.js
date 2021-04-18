var config = require('../config')
var util = require('../util')

module.exports = {
    run(spawn, harvester_count, builder_count) {
        var energylevel = spawn.energy

        if(energylevel == 300) {
            if(harvester_count == 0){
                var spec = config.GetHarvesterSpec();
                spawn.createCreep([WORK, CARRY, MOVE] ,null, { primaryrole: spec.primaryrole, secondaryrole: spec.secondaryrole, activerole: spec.activerole, activetask: spec.activetask })
            }
        }

        if (harvester_count < config.GetMaxHarvesters()) {
            var spec = config.GetHarvesterSpec();
                spawn.createCreep([WORK, CARRY, MOVE] ,null, { primaryrole: spec.primaryrole, secondaryrole: spec.secondaryrole, activerole: spec.activerole, activetask: spec.activetask })
        }

        if (builder_count < config.GetMaxBuilders() && harvester_count >= config.GetMaxHarvesters()) {
            var spec = config.GetBuilderSpec();
            spawn.createCreep([WORK, CARRY, MOVE] ,null, { primaryrole: spec.primaryrole, secondaryrole: spec.secondaryrole, activerole: spec.activerole, activetask: spec.activetask })
        }

    },

    Spawn_New(spawn, creep_spec) {
        spawn.createCreep([WORK, CARRY, MOVE],null, { primaryrole: creep_spec.primaryrole, secondaryrole: creep_spec.secondaryrole, activerole: creep_spec.activerole, activetask: creep_spec.activetask }) 
    }

};
