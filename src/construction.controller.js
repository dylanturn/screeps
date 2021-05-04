/************************************************
* Responsible for making descisions about which *
* structures to create construction sites for.  *
*************************************************/


const { LogMsg } = require('./logger')
const { LOG_LEVEL } = require('./constants')
const { ConstructContainers } = require('./construction.container')
const { ConstructRoads } = require('./construction.road')

function setup(room) {
  if (!room.memory["construction"]) {
    if (!Array.isArray(room.memory["construction"])) {
      room.memory["construction"] = []
    }
  }

  /*const spawns = room.find(FIND_MY_SPAWNS)
  for(let i in spawns){
    let spawn = spawns[i]
    ConstructRoads(room, spawn)
  }
  ConstructContainers(room)*/

}


// Populates an array object that contains the construction sites within the room
function updateConstructionSiteList(room) {
  room.memory.construction = []
  room.find(FIND_MY_CONSTRUCTION_SITES).forEach(function (site) {
    room.memory.construction.push({
      "type": site.structureType,
      "progress": site.progress,
      "progress_total": site.progressTotal,
      "pos": site.pos
    })
  });
}


function run(room) {

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
      console.log(err)
      console.log(err.stack)
      LogMsg(LOG_LEVEL.ERROR, `The construction controller has failed with error:\n${err} - ${err.stack}`)
    }
  }
}
