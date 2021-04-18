module.exports = {
    PopBuildTask(room) {
        return room.memory.build_queue.pop()
    },
    BuildOnPlain(room, posX, posY, type) {
        if( room.lookAt(posX,posY)[0].type == "terrain" ) {
           if( room.lookAt(posX,posY)[0].terrain == "plain" ) {
                room.createConstructionSite(posX,posY,type)
                
                addTask(room, "build", posX, posY)
                console.log(`Added build task for ${type} in room ${room.name} at position ${posX},${posY}`)
                return true;
            } 
        }
        return false;
    }
    
}

function addTask(room, task_type, posX, posY){
    var task_spec = JSON.parse('{ "task": "null", "room":"null", "pos":{ "x":"0", "y":"0" }}')
    task_spec.task = task_type
    task_spec.room = room.name
    task_spec.pos.x = posX
    task_spec.pos.y = posY
    room.memory.build_queue.push(task_spec)
    //room.memory.build_queue = build_queue
}
