/************************************************
* Manages the population of our creeps by role. *
*************************************************/

const { LogMsg } = require('./logger')
const { LOG_LEVEL } = require('./constants')
const creep_role_harvester = require('./creep.role.harvester')
const creep_role_worker = require('./creep.role.worker')
const creep_role_builder = require('./creep.role.builder')
const creep_role_transporter = require('./creep.role.transporter')

// Configurable parameters.
const max_harvesters = 4;
const max_builders = 4;
const max_workers = 2;
const max_transporters = 4;

function getDesiredHarvesters(room) {
  return max_harvesters
}

function getDesiredBuilders(room) {
  if(room.memory.harvesters.length >= getDesiredHarvesters(room)){
    return max_builders
  }
  return 0
}

function getDesiredWorkers(room) {
  if (room.memory.builders.length >= getDesiredBuilders(room)) {
    return max_workers
  }
  return 0
}

function getDesiredTransporters(room) {
  const containers = room.find(FIND_STRUCTURES,
    {
      filter: function (object) {
        return object.structureType == STRUCTURE_STORAGE ||
          object.structureType == STRUCTURE_CONTAINER
      }
    });
  if (containers.length > 0) {
    return max_transporters
  }
  return 0
}

// Removes references to creeps that no longer exist. This helps control CPU usage.
function populationControl(room) {
  let screep_name_list = Object.keys(Game.creeps)
  let registered_creeps = Object.keys(Memory.creeps)
  for (let i in registered_creeps) {
    if (!screep_name_list.includes(registered_creeps[i])) {
      LogMsg(LOG_LEVEL.INFO, `Delete Creep: ${registered_creeps[i]}`)
      delete Memory.creeps[registered_creeps[i]]
    }
  }
}

function spawnCreep(spawn, creep_spec) {
  // ToDo: Look into using the energyStructures parameter to prioritize
  //       pulling energy from extensions near energy sources.
  return spawn.createCreep(creep_spec.parts, null, {
    active_role: creep_spec.active_role,
    primary_role: creep_spec.primary_role,
    valid_secondary_roles: creep_spec.valid_secondary_roles,
    active_task: { "task": null, "pos": { "room": null, "x": 0, "y": 0 } }
  })
}

function setup(room) {
  room.memory["harvesters"] = []
  room.memory["builders"] = []
  room.memory["workers"] = []
  room.memory["transporters"] = []
}

function run(room) {

  var harvester_count = room.memory.harvesters.length
  var builder_count = room.memory.builders.length
  var worker_count = room.memory.workers.length
  var transporter_count = room.memory.transporters.length

  /******************
  * Screep Spawning *
  ******************/
 if(room.find(FIND_MY_SPAWNS).length <= 0){
   return
 }
  var spawn = room.find(FIND_MY_SPAWNS)[0]

  // Make sure that at the very least we have harvesters binging in the energy
  // We've got to do this to prevent against colony collapse
  if (harvester_count < getDesiredHarvesters(room)) {
    spawnCreep(spawn, creep_role_harvester.GetSpec())
  } else {

    if (builder_count < getDesiredBuilders(room)) {
      spawnCreep(spawn, creep_role_builder.GetSpec())
    }

    if (worker_count < getDesiredWorkers(room)) {
      spawnCreep(spawn, creep_role_worker.GetSpec())
    }

    if (transporter_count < getDesiredTransporters(room)) {
      spawnCreep(spawn, creep_role_transporter.GetSpec())
    }

  }

  populationControl(room)
}

module.exports = {
  GetDesiredHarvesters(room) {
    return getDesiredHarvesters(room)
  },
  GetDesiredBuilders(room) {
    return getDesiredBuilders(room)
  },
  GetDesiredWorkers(room) {
    return getDesiredWorkers(room)
  },
  GetDesiredTransporters(room) {
    return getDesiredTransporters(room)
  },
  Setup(room) {
    return setup(room)
  },
  Run(room) {
    try {
      run(room)
    } catch (err) {
      LogMsg(LOG_LEVEL.ERROR, `The creep population controller has failed with error:\n${err} - ${err.stack}`)
    }
  }
};
