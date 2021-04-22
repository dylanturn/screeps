const construction_util = require('./construction.util')
const construction_road = require('./construction.road')

module.exports = {
    ConstructSpawnExtensions(room, spawn) {
        
        const extension_structures = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }
        });

        const extension_construction_sites = room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: { structureType: STRUCTURE_EXTENSION }
        });

        var total_extensions = extension_structures.length + extension_construction_sites.length

        var origX = spawn.pos.x
        var origY = spawn.pos.y
        
        var posX1 = origX-2   // x-1
        var posY1 = origY-2   // y-1

        var posX2 = origX+2   // x+1
        var posY2 = origY-2   // y-1
        
        var posX3 = origX+2   // x+1
        var posY3 = origY+2   // y+1
        
        var posX4 = origX-2   // x-1
        var posY4 = origY+2   // y+1

        var used_capacity_pct = (room.energyAvailable / room.energyCapacityAvailable)*100

        if (total_extensions < 4 && used_capacity_pct >= 90){            
            if (room.controller.level >= 2){
                if(construction_util.BuildOnPlain(room, posX1, posY1, STRUCTURE_EXTENSION)){
                    return {"x": posx1, "y": posy1}
                } else if(construction_util.BuildOnPlain(room, posX2, posY2, STRUCTURE_EXTENSION)){
                    construction_road.ConstructRoad({"x": posx1, "y": posy1})
                    return {"x": posx2, "y": posy2}
                } else if(construction_util.BuildOnPlain(room, posX3, posY3, STRUCTURE_EXTENSION)){
                    construction_road.ConstructRoad({"x": posx2, "y": posy2})
                    return {"x": posx3, "y": posy3}
                } else if(construction_util.BuildOnPlain(room, posX4, posY4, STRUCTURE_EXTENSION)){
                    construction_road.ConstructRoad({"x": posx3, "y": posy3})
                    return {"x": posx4, "y": posy4}
                } else {
                    return null
                }   
            }
        }
    }
}
