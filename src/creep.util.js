function getRoomName(creep){
    return creep.room.name
  }
  
function getRoomSpawns(creep){
    return creep.room.find(FIND_MY_SPAWNS)
}