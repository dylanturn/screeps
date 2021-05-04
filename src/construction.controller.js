/************************************************
* Responsible for making descisions about which *
* structures to create construction sites for.  *
*************************************************/


const { LogMsg } = require('./logger')
const { LOG_LEVEL } = require('./constants')
const { ConstructContainers } = require('./construction.container')
const { ConstructRoads } = require('./construction.road')
const { GetRoomComponents } = require('./complex.util')

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

function constructRoads(room, position) {
  console.log(`constructing STRUCTURE_ROAD at ${JSON.stringify(position)}`)
  try {
    return room.createConstructionSite(position, STRUCTURE_ROAD)
  } catch (err) {
    console.log(err)
    LogMsg(LOG_LEVEL.ERROR, `Failed to construct the road!\n${err} - ${err.stack}`)
  }
}

function constructExtension(room, position) {
  console.log(`constructing STRUCTURE_EXTENSION at ${JSON.stringify(position)}`)
  try {
    if(room.controller.level >= 2){
      return room.createConstructionSite(position, STRUCTURE_EXTENSION)
    }
    return false
  } catch (err) {
    console.log(err)
    LogMsg(LOG_LEVEL.ERROR, `Failed to construct the extension!\n${err} - ${err.stack}`)
  }
}

function constructContainer(room, position) {
  console.log(`constructing STRUCTURE_CONTAINER at ${JSON.stringify(position)}`)
  try {
    return room.createConstructionSite(position, STRUCTURE_CONTAINER)
  } catch (err) {
    console.log(err)
    LogMsg(LOG_LEVEL.ERROR, `Failed to construct the container!\n${err} - ${err.stack}`)
  }
}

function constructTower(room, position) {
  console.log(`constructing STRUCTURE_TOWER at ${JSON.stringify(position)}`)
  try {
    return room.createConstructionSite(position, STRUCTURE_TOWER)
  } catch (err) {
    console.log(err)
    LogMsg(LOG_LEVEL.ERROR, `Failed to construct the tower!\n${err} - ${err.stack}`)
  }
}

function constructionBlocked(room, position) {
  let objects = room.lookAt(position)
  for (let i in objects) {
    let object = objects[i]
    if (object.type === LOOK_STRUCTURES || object.type === LOOK_CONSTRUCTION_SITES) {
      console.log(`FOUND: ${JSON.stringify(object)}`)
      return true
    }
    return false
  }
}

function constructSites(room){
  console.log("----- start -----")
  for (const [key, value] of Object.entries(GetRoomComponents(room))) {
    if (!value){continue}
    let raw_position = key.split(':')
    let position = new RoomPosition(Number(raw_position[0]), Number(raw_position[1]), room.name)
    console.log(value)
    if (!constructionBlocked(room, position)) {
      if (value === "container") {
        if(constructContainer(room, position) == OK){
          console.log("----- end-container -----")
          return
        } else if (value === "extension") {
        if(constructExtension(room, position) == OK){
          console.log("----- end-extension -----")
          return
        }
      } else if (value === "road") {
        if(constructRoads(room, position) == OK){
          console.log("----- end-road -----")
          return
        } 
      } else if (value === "tower") {
        if(constructTower(room, position) == OK){
          console.log("----- end-tower -----")
          return
        }
      }
    } else {
      console.log("Construction blocked")
    }
  }
  console.log("----- end -----")
  }
}
function run(room) {
  if(room.find(FIND_MY_CONSTRUCTION_SITES).length < 100){
    constructSites(room)
  }
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
      console.log(err)
      console.log(err.stack)
      LogMsg(LOG_LEVEL.ERROR, `The construction controller has failed with error:\n${err} - ${err.stack}`)
    }
  }
}
