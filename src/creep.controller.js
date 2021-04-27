/****************************************************************
* Responsible for helping the creeps decide which tasks to work *
*****************************************************************/

const constants = require('./constants')
const creep_role_harvester = require('./creep.role.harvester')
const creep_role_worker = require('./creep.role.worker')
const creep_role_builder = require('./creep.role.builder')
const creep_role_transporter = require('./creep.role.transporter')

function setup(room) { }

function run(room) {
  const room_creeps = room.find(FIND_MY_CREEPS)
  room.memory.harvesters = []
  room.memory.builders = []
  room.memory.transporters = []
  room.memory.workers = []

  for (var i in room_creeps) {
    var creep = room_creeps[i];
    
    switch (creep.memory.active_role) {
      case constants.CREEP_ROLES.HARVESTER:
        room.memory.harvesters.push(creep_role_harvester.Run(creep));
        break;
      case constants.CREEP_ROLES.BUILDER:
        room.memory.builders.push(creep_role_builder.Run(creep));
        break;
      case constants.CREEP_ROLES.WORKER:
        room.memory.workers.push(creep_role_worker.Run(creep));
        break;
      case constants.CREEP_ROLES.TRANSPORTER:
        room.memory.transporters.push(creep_role_transporter.Run(creep));
        break;
      default:
        console.log(`Unknown Creep Role: ${creep.memory.activerole}`)
    }
  }
}

module.exports = {
  Setup(room) {
    return setup(room)
  },
  Run(room) {
    try {
      run(room)
    }
    catch (err) {
      console.log(`The creep controller has failed with error:\n${err} - ${err.stack}`)
    }
  }
};
