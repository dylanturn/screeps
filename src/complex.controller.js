const { LogMsg } = require('./logger')
const { LOG_LEVEL } = require('./constants')
const { PaintTemplatePositions, UpdateStructureCounts } = require('./complex.util')
const { ConstructSpawns } = require('./complex.controller.spawn')
const { ConstructExtensions } = require('./complex.controller.extension')
const { ConstructContainers } = require('./complex.controller.container')
const { ConstructRoads } = require('./complex.controller.road')

module.exports = {
  Setup(room) {
    return setup(room)
  },
  Run(room) {
    try {
      run(room)
    }
    catch (err) {
      LogMsg(LOG_LEVEL.ERROR, `The complex controller has failed with error:\n${err} - ${err.stack}`)
    }
  }
}

function setup(room){
  if(typeof(Memory["complex_deployment_phase"]) === 'undefined')
    Memory["complex_deployment_phase"] = 0
  if(typeof(Memory["complexes"]) === 'undefined')
    Memory["complexes"] = {}
  if(typeof(Memory["complex_inventory"]) === 'undefined')
    Memory["complex_inventory"] = {}

  if(typeof(room.memory["planned_structure_counts"]) === 'undefined')
    room.memory["planned_structure_counts"] = {
      "spawn": 0,
      "container": 0,
      "road": 0,
      "extension": 0,
      "storage": 0,
      "tower": 0,
    }
}

function run(room){
  PaintTemplatePositions(room)
  UpdateStructureCounts(room)
  switch(Memory["complex_deployment_phase"]){
    case 0:
      console.log(`Constructing spawn complex`)
      if(ConstructSpawns(room))
        Memory["complex_deployment_phase"] = 1
      return
    case 1:
      console.log(`Constructing roads from room controllers and sources to the spawn`)
      if(ConstructRoads(room))
        Memory["complex_deployment_phase"] = 2
      return
    case 2:
      console.log(`Constructing room controller and source container complexes`)
      if(ConstructContainers(room))
        Memory["complex_deployment_phase"] = 3
      return
    case 3:
      console.log(`Constructing extension complexs`)
      if(ConstructExtensions(room))
        if(room.memory["planned_structure_counts"]["extension"] >= 60){
          Memory["complex_deployment_phase"] = 4
        } else {
          Memory["complex_deployment_phase"] = 3
        }
        
      return
  }
}