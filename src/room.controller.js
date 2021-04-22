
function setup(room){
    if(!room.memory.spawns) {
        if(!Array.isArray(room.memory.spawns)) {
            room.memory.spawns = []
        }
    }
    if(!room.memory.sources) {
        if(!Array.isArray(room.memory.sources)) {
            room.memory.sources = {}
            var sources = room.find(FIND_SOURCES)
            for (var i in sources){
                room.memory.sources[sources[i].id] = {"pos": sources[i].pos}
            }
        }
    }
}

function run(room){
    /*********************************************
    * Test code for trying out different layouts *
    **********************************************/
    
    // Plot a walkable path between the two energy sources
    // Return the midpoint.
    var source_midpoint = findSourceMidpoint(room)
}

function findSourceMidpoint(room){
    energy_sources = room.find(FIND_SOURCES)
     
    s_a = energy_sources[0]
    s_b = energy_sources[1]

    result = PathFinder.search(s_a.pos, {"pos": s_b.pos, "range": 1})

    for(var i in result.path){
        var point = result.path[i]
        room.visual.circle(point,{fill: 'blue', stroke: 'blue'});
    }

    var midpoint = result.path[Math.floor(result.path.length / 2)];
    room.visual.circle(midpoint,{fill: 'green', stroke: 'green'});

    return midpoint
}

module.exports = {
    Setup(room){
        setup(room)
    },
    Run(room) {
        try {
            run(room)
        }
        catch(err) {
            console.log(`Failed to execute layout simulation\n${err}`)
        }
    }
}