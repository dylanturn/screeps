/************************************************
* Responsible for making descisions about which *
* structures to create construction sites for.  *
*************************************************/

const construction_road = require('./construction.road');
const construction_extension = require('./construction.extension');
const construction_container = require('./construction.container');

// Ensures the global memory objects will exist.
function setupMemory(room) {
  if (!room.memory.construction) {
    if (!Array.isArray(room.memory.construction)) {
      room.memory.construction = []
    }
  }
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

function setup(room) {
  setupMemory(room)
  room.find(FIND_MY_SPAWNS).forEach(function (spawn) {
    construction_road.ConstructRoads(room, spawn)
  });
}

function run(room) {

  construction_container.ConstructContainers(room)
  
  // Handles constructing new spawn extensions
  room.find(FIND_MY_SPAWNS).forEach(function (spawn) {
    construction_extension.ConstructSpawnExtensions(room, spawn)
  });

  updateConstructionSiteList(room)
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
      console.log(`The construction controller has failed with error:\n${err} - ${err.stack}`)
    }
  }
}
