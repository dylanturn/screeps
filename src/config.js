const max_harvesters = 6;
const max_builders = 4;
const build_queue_limit = 5;

const harvester_spec =  '{ "variant":"default", "parts": [ "WORK", "CARRY", "MOVE" ], "primaryrole": "harvester", "secondaryrole": "builder", "activerole": "harvester", "activetask": { "task": "build", "room":"null", "pos":{ "x":"0", "y":"0" } }}'
const builder_spec =    '{ "variant":"default", "parts": [ "WORK", "CARRY", "MOVE" ], "primaryrole": "builder", "secondaryrole": "harvester", "activerole": "builder", "activetask": { "task": "build", "room":"null", "pos":{ "x":"0", "y":"0" } }}'
const workerSpec =      '{ "variant":"default", "parts": [ "WORK", "CARRY", "MOVE" ], "task": "null", "room":"null", "pos":{ "x":"0", "y":"0" }, "targetID": "null", "status":"null" }'
const task_spec =       '{ "task": "null", "room":"null", "pos":{ "x":"0", "y":"0" } }'

module.exports = {
    GetMaxHarvesters(){
      return max_harvesters
    },
    GetMaxBuilders(){
      return max_builders
    },
    GetBuildQueueLimit() {
      return build_queue_limit
    },
    GetWorkerSpec() {
        return JSON.parse(workerSpec)
    },
    GetHarvesterSpec() {
        var base_spec = JSON.parse(harvester_spec)
        var active_spec = JSON.parse(task_spec)
        base_spec.activetask = active_spec
        return base_spec
    },
    GetBuilderSpec() {
        var base_spec = JSON.parse(builder_spec)
        var active_spec = JSON.parse(task_spec)
        base_spec.activetask = active_spec
        return base_spec
    },
    GetTaskSpec() {
        return JSON.parse(task_spec)
    }
};
