
const constants = require('./constants')

function setup(room) {
  if (!room.memory.spawns) {
    if (!Array.isArray(room.memory.spawns)) {
      room.memory.spawns = []
    }
  }
  if (!room.memory.sources) {
    if (!Array.isArray(room.memory.sources)) {
      room.memory.sources = {}
      var sources = room.find(FIND_SOURCES)
      for (var i in sources) {
        room.memory.sources[sources[i].id] = { "pos": sources[i].pos }
      }
    }
  }
}

function findSourceMidpoint(room) {
  energy_sources = room.find(FIND_SOURCES)

  s_a = energy_sources[0]
  s_b = energy_sources[1]

  result = PathFinder.search(s_a.pos, { "pos": s_b.pos, "range": 1 })
  var midpoint = result.path[Math.floor(result.path.length / 2)];

  if (Memory.debug) {
    for (var i in result.path) {
      var point = result.path[i]
      room.visual.circle(point, { fill: 'blue', stroke: 'transparent' });
    }
    room.visual.circle(midpoint, { fill: 'green', stroke: 'transparent' });
  }

  return midpoint
}

function inspectArea(room, midpoint, size) {
  var top_y = midpoint.y - size
  var left_x = midpoint.x - size
  var bottom_y = midpoint.y + size
  var right_x = midpoint.x + size

  if(top_y < 0){
    top_y = 0
  }

  if (left_x < 0){
    left_x = 0
  }

  if (bottom_y > 49){
    bottom_y = 49
  }

  if(right_x > 49){
    right_x = 49
  }

  const area = room.lookAtArea(top_y, left_x, bottom_y, right_x, true);

  return area
}

function filterBuildObstructions(room, midpoint, plot_candidates) {
  // break the area up into 4 quadrants
  var plot_quad_a = []// {"x": 0, "y": 0}
  var plot_quad_b = []// {"x": 0, "y": 0}
  var plot_quad_c = []// {"x": 0, "y": 0}
  var plot_quad_d = []// {"x": 0, "y": 0}

  var invalid_build_locations = []
  plot_candidates.forEach(plot => {
    if (plot.type === "structure" || plot.type === "constructionSite") {
      invalid_build_locations.push(JSON.stringify({ "x": plot.x, "y": plot.y }))
    }
  })

  var plot_terrain = plot_candidates.filter(plot => plot.type === "terrain")

  plot_terrain.forEach(plot => {

    // plot_quad_a (x-1,y-1)
    if (plot.x <= midpoint.x && plot.y <= midpoint.y) {
      room.visual.circle(plot, { fill: 'transparent', stroke: 'blue' })
      if (plot.terrain !== "wall" && !invalid_build_locations.includes(JSON.stringify({ "x": plot.x, "y": plot.y }))) {
        plot_quad_a.push(plot)
      } else {
        room.visual.circle(plot, { fill: 'red', stroke: 'transparent' })
      }
    }

    // plot_quad_b (x,y-1)
    if (plot.x >= midpoint.x && plot.y <= midpoint.y) {
      room.visual.circle(plot, { fill: 'transparent', stroke: 'yellow' })
      if (plot.terrain !== "wall" && !invalid_build_locations.includes(JSON.stringify({ "x": plot.x, "y": plot.y }))) {
        plot_quad_b.push(plot)
      } else {
        room.visual.circle(plot, { fill: 'red', stroke: 'transparent' })
      }
    }

    // plot_quad_c (x,y)
    if (plot.x >= midpoint.x && plot.y >= midpoint.y) {
      room.visual.circle(plot, { fill: 'transparent', stroke: 'purple' })
      if (plot.terrain !== "wall" && !invalid_build_locations.includes(JSON.stringify({ "x": plot.x, "y": plot.y }))) {
        plot_quad_c.push(plot)
      } else {
        room.visual.circle(plot, { fill: 'red', stroke: 'transparent' })
      }
    }

    // plot_quad_d (x-1,y)
    if (plot.x <= midpoint.x && plot.y >= midpoint.y) {
      room.visual.circle(plot, { fill: 'transparent', stroke: 'white' })
      if (plot.terrain !== "wall" && !invalid_build_locations.includes(JSON.stringify({ "x": plot.x, "y": plot.y }))) {
        plot_quad_d.push(plot)
      } else {
        room.visual.circle(plot, { fill: 'red', stroke: 'transparent' })
      }
    }
  })

  return {
    "quad_a": plot_quad_a,
    "quad_b": plot_quad_b,
    "quad_c": plot_quad_c,
    "quad_d": plot_quad_d,
    "length": plot_quad_a.length+plot_quad_b.length+plot_quad_c.length+plot_quad_d.length
  }
}

function calculateNewSearchPoint(room, search_point, search_area_size, valid_plots){
  
  var quad_a_len = valid_plots.quad_a.length
  var quad_b_len = valid_plots.quad_b.length
  var quad_c_len = valid_plots.quad_c.length
  var quad_d_len = valid_plots.quad_d.length

  var new_search_point = { "x": 0, "y": 0 }

  // Find out how far North (x, y-1) to go
  var vector_north = (quad_a_len+quad_b_len)/search_area_size

  // Find out how far South (x, y+1) to go
  var vector_south = (quad_c_len+quad_d_len)/search_area_size

  // Find out how far West (x-1, y) to go
  var vector_west = (quad_b_len+quad_c_len)/search_area_size

  // Find out how far East (x+1, y) to go
  var vector_east = (quad_a_len+quad_d_len)/search_area_size


  if(vector_north > vector_south){
    new_search_point.x = Math.ceil(search_point.x*(1-(vector_north/1)))
  } else {
    new_search_point.x = Math.ceil(search_point.x*(1+(vector_south/1)))
  }

  if(vector_west > vector_east){
    new_search_point.y = Math.ceil(search_point.x*(1-(vector_west/1)))
  } else {
    new_search_point.y = Math.ceil(search_point.x*(1+(vector_east/1)))
  }

  room.visual.circle(new_search_point, { fill: 'pink', stroke: 'transparent' })
  console.log(JSON.stringify(new_search_point))
  return new_search_point
}

function locateValidBuildPlot(room, search_point, search_size_factor){
  
  // Figure out how large the search area will be
  const search_area_size = Math.pow((search_size_factor+1), 2)*4 

  // The maximum number of times we will seach for a plot
  const max_iterations = 10
  var iteration_number = 0

  do {
    console.log(`Iteration Number: ${iteration_number}`)

    // Generate a list of points within the area
    var plot_candidates = inspectArea(room, search_point, search_size_factor)

    // Examine each point to determine if the area is valid
    var valid_plots = filterBuildObstructions(room, search_point, plot_candidates)

    console.log(`Valid Plots: ${valid_plots.length}`)
    console.log(`Search Area: ${search_area_size}`)

    if(valid_plots.length < search_area_size){
      // If the area isn't valid, figure out which direction to move the search
      console.log("Calculate new search_point")
      search_point = calculateNewSearchPoint(room, search_point, search_area_size, valid_plots)
    }
    
    // increment the search iteration counter
    iteration_number++
  } while (valid_plots.length < search_area_size && iteration_number <= max_iterations);


  if(iteration_number <= max_iterations){
    return search_point
  } else {
    return constants.BUILD_PLOT_SEARCH_TIMEOUT
  }
}

function getValidBuildArea(search_point, search_size_factor, min_search_size_factor){
  do{
    console.log(`SEARCH SIZE! ${search_size_factor}`)
    // Try to find the best plot
    valid_build_plot = locateValidBuildPlot(room, search_point, search_size_factor)

    if(valid_build_plot === constants.BUILD_PLOT_SEARCH_TIMEOUT){
      // decrement the search size factor since we couldn't find a valid spod
      search_size_factor--
    }
    
  } while(valid_build_plot === constants.BUILD_PLOT_SEARCH_TIMEOUT && search_size_factor > min_search_size_factor)
  
  if(valid_build_plot !== constants.BUILD_PLOT_SEARCH_TIMEOUT){
    console.log(`FINAL POINT: ${valid_build_plot}`)
    room.visual.rect(new RoomPosition(valid_build_plot.x - search_size_factor, valid_build_plot.y - search_size_factor, room.name), search_size_factor * 2, search_size_factor * 2, { fill: 'purple' })
  } else {
    console.log("Search timed out!")
  }
}

function run(room) {
  /*********************************************
  * Test code for trying out different layouts *
  **********************************************/

  // Plot a walkable path between the two energy sources
  // Return the midpoint. This is where the search starts
  var midpoint = findSourceMidpoint(room)

  if (Memory.debug) {
    room.visual.rect(new RoomPosition(midpoint.x - search_size_factor, midpoint.y - search_size_factor, room.name), search_size_factor * 2, search_size_factor * 2, { fill: 'green' })
  }

  var valid_spawn_point = getValidBuildArea(midpoint, 4, 2)
}

module.exports = {
  Setup(room) {
    setup(room)
  },
  Run(room) {
    try {
      run(room)
    }
    catch (err) {
      console.log(`Failed to execute layout simulation\n${err} - ${err.stack}`)
    }
  }
}