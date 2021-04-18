/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('population_control');
 * mod.thing == 'a thing'; // true
 */

var room_name = "W7S56";

var spawn_name = "Spawn1";

var max_harvesters = 5;

var max_builders = 5;

var build_queue_limit = 5;

var room_controller_id = "5bbcac619099fc012e6355e0";

var energy_source_list = '{ "source_id_list": [] }';

var miniral_source_list = '{ "source_list": [ {"type":"oxygen", "id":"58dbc92734e898064bcc333a"} ] }';

var harvester_spec = '{ "variant":"default", "parts": [ "WORK", "CARRY", "MOVE" ], "primaryrole": "harvester", "secondaryrole": "builder", "activerole": "harvester", "activetask": { "task": "build", "room":"null", "pos":{ "x":"0", "y":"0" } } }';

var builder_spec = '{ "variant":"default", "parts": [ "WORK", "CARRY", "MOVE" ], "primaryrole": "builder", "secondaryrole": "harvester", "activerole": "builder", "activetask": { "task": "build", "room":"null", "pos":{ "x":"0", "y":"0" } }}';

var workerSpec = '{ "variant":"default", "parts": [ "WORK", "CARRY", "MOVE" ], "task": "null", "room":"null", "pos":{ "x":"0", "y":"0" }, "targetID": "null", "status":"null" }'

var task_spec = '{ "task": "null", "room":"null", "pos":{ "x":"0", "y":"0" } }'

module.exports = {
    run() {

    },
    getMaxHarvesters(){
      return max_harvesters
    },
    getMaxBuilders(){
      return max_builders
    },
    getRoomName() {
      return room_name
    },
    GetBuildQueueLimit() {
      return build_queue_limit
    },
    Get_Spawn_Name() {
        return spawn_name
    },
    GetWorkerSpec() {
        return JSON.parse(workerSpec)
    },
    Get_Harvester_Spec() {
        var base_spec = JSON.parse(harvester_spec)
        var active_spec = JSON.parse(task_spec)
        base_spec.activetask = active_spec
        return base_spec
    },
    Get_Builder_Spec() {
        var base_spec = JSON.parse(builder_spec)
        var active_spec = JSON.parse(task_spec)
        base_spec.activetask = active_spec
        return base_spec
    },
    Get_Energy_Sources() {
        var source_id_list = []
        for (var source in Game.rooms[getRoomName()].find(FIND_SOURCES)){
            source_id_list.push(source.id)
        }
        return source_id_list
    },
    GetMiniralSources() {
        return miniral_source_list
    },
    GetTaskSpec() {
        return JSON.parse(task_spec)
    }
};

