const { EvaluateBuildArea, FindBuildArea, ValidateBuildAreaBounds } = require('./complex.util.locator');
const { GetComplexTemplate, GetTemplateHasConnectors, GetTemplateConnectorNorth, GetTemplateConnectorEast, GetTemplateConnectorSouth, GetTemplateConnectorWest, GetTemplateStructureCounts } = require('./complex.template');
const { LogMsg } = require('./logger');
const { LOG_LEVEL, BUILD_PLOT_OBSTRUCTED } = require('./constants');

module.exports = {


  /**
   * Creates construction sites at the given origin for the structures defined within the given template
   * @param {String} complex_template
   * @param {RoomPosition} complex_origin
   * @returns {Boolean}
   */
   ConstructComplex(complex_template, complex_origin) {
    return constructComplex(complex_template, complex_origin)
  },

  /**
   * 
   * @param {Room} room 
   * @param {RoomPosition} position 
   * @param {String} template 
   * @param {String} direction 
   */
  CreateConnectorFlag(room, position, template, direction){
    return createConnectorFlag(room, position, template, direction)
  },

  /**
   * Provides a standrardized way to create flags for room planning
   * @param {RoomPosition} origin 
   * @param {String} template 
   * @returns {ComplexComponent[]} connectors
   */
  CreateTemplateConnectorFlags(origin, template){
    return createTemplateConnectorFlags(origin, template)
  },

  /**
   * 
   * @param {Room} room 
   * @returns 
   */
  GetRoomComponents(room){
    return getRoomComponents(room)
  },

  /**
   * Gets the number of structures in the given complex template and adds then to planned_structure_counts
   * @param {Room} room  
   */
  UpdateStructureCounts(room, complex_template){
    return updateStructureCounts(room)
  },

  /**
   * Stores the complex in memory
   * @param {String} complex_template
   * @param {RoomPosition} complex_origin
   */
  StoreComplexLayout(complex_template, complex_origin){
    return storeComplexLayout(complex_template, complex_origin)
  },


  /**
   * Used to find the origin offset when building a neighbor complex on a connector
   * @param {String} room_name 
   * @param {String} template 
   * @param {Complex} complex 
   * @param {Number[]} connector_offset 
   * @returns {RoomPosition}
   */
  GetConnectorBuildOffset(room_name, template, complex, connector_offset) {
    return getConnectorBuildOffset(room_name, template, complex, connector_offset)
  },

  /**
   * 
   * @param {String} template - The name of the complex template that will be constructed
   * @param {Flag} flag - The flag that represents the road connector the complex will be attached to
   * @returns {RoomPosition} position - The origin for the new complex
   */
  GetNeighborComplexOriginByFlag(template, flag) {
    return getNeighborComplexOriginByFlag(template, flag)
  },

  /**
   * 
   * @param {String} template_name  - An optional remplate name to filter for.
   * @returns {Complex[]} filtered_complexes - An object that contains all the found complexes
   */
   GetComplexTemplates(template_name=null){
    return getComplexTemplates(template_name)
  },

  /**
   * Gets the complex object from memory
   * @param {String} complex_name 
   * @returns {Complex}
   */
  GetComplex(complex_name){
    return getComplex(complex_name)
  },

  /**
   * Gets the complex object from memory
   * @param {RoomPosition} position
   * @returns {Complex|Boolean}
   */
  GetComplexAt(position){
    return getComplexAt(position)
  },

  /**
   * Get the connectors for the given complex
   * @param {String} complex_name 
   */
  GetComplexConnectors(complex_name){
    return getComplex(complex_name).connectors
  },

  /**
   * Paints the position within each template
   * @param {Room} room 
   */
  PaintTemplatePositions(room) {
    return paintTemplatePositions(room)
  }
}

/**
 * Creates construction sites at the given origin for the structures defined within the given template
 * @param {String} complex_template
 * @param {RoomPosition} complex_origin
 * @returns {Boolean}
 */
 function constructComplex(complex_template, complex_origin) {

  const room = Game.rooms[complex_origin.roomName]
  const template = GetComplexTemplate(complex_template)
  const template_radius = (Math.sqrt(template.length)-1)/2

  for(let i in template){
    const component = template[i]
    const position_x = complex_origin.x+component.pos[0]
    const position_y = complex_origin.y+component.pos[1]
    LogMsg(LOG_LEVEL.TRACE, `Search for obstructions at ${position_x}:${position_y}`)
    if(Memory["terrain_walls"].includes(`${position_x}:${position_y}`)){
      LogMsg(LOG_LEVEL.TRACE, `Found wall at ${position_x}:${position_y}`)
      return false
    }
    if(Object.keys(Memory["complex_components"]).includes(`${position_x}:${position_y}`)){
      LogMsg(LOG_LEVEL.TRACE, `Found complex at ${position_x}:${position_y}`)
      return false
    }
  }
  
  const evaluated_build_area = EvaluateBuildArea(complex_origin, template_radius)  
  if(evaluated_build_area !== OK){
    const build_position = FindBuildArea(complex_template, room, complex_origin, template_radius, 16)
    if(typeof(build_position) !== "string"){
      storeComplexLayout(complex_template, complex_origin)
      if(GetTemplateHasConnectors(complex_template)){
        createTemplateConnectorFlags(complex_origin, complex_template)
      }
      return true
    } else {
      LogMsg(LOG_LEVEL.ERROR, `Failed to find build area for ${complex_template}: ${build_position} @ ${JSON.stringify(complex_origin)}`)
      return false
    }
  } else {
    storeComplexLayout(complex_template, complex_origin)
    if(GetTemplateHasConnectors(complex_template)){
      createTemplateConnectorFlags(complex_origin, complex_template)
    }
    return true
  }
}

/**
 * 
 * @param {Room} room 
 * @param {RoomPosition} position 
 * @param {String} template 
 * @param {String} direction 
 */
 function createConnectorFlag(room, position, template, direction){
  let flag_name = room.createFlag(
    position.x,
    position.y,
    `${position.x}_${position.y}`,
    COLOR_CYAN,
    COLOR_BLUE)
    Game.flags[flag_name].memory["type"] = "connector"
    Game.flags[flag_name].memory["template"] = template
    Game.flags[flag_name].memory["direction"] = direction
}

/**
 * Provides a standrardized way to create flags for room planning
 * @param {RoomPosition} origin 
 * @param {String} template 
 * @returns {ComplexComponent[]} connectors
 */
function createTemplateConnectorFlags(origin, template){
  let room = Game.rooms[origin.roomName]
  let connectors = []

  // NORTH
  const connector_north = GetTemplateConnectorNorth(template)
  createConnectorFlag(
    room,
    new RoomPosition((origin.x+connector_north.pos[0]), (origin.y+connector_north.pos[1]), room.name),
    template,
    "NORTH")
  connectors.push(connector_north)

  // EAST
  const connector_east = GetTemplateConnectorEast(template)
  createConnectorFlag(
    room,
    new RoomPosition((origin.x+connector_east.pos[0]), (origin.y+connector_east.pos[1]), room.name),
    template,
    "EAST")
  connectors.push(connector_east)
  
  // SOUTH
  const connector_south = GetTemplateConnectorSouth(template)
  createConnectorFlag(
    room,
    new RoomPosition((origin.x+connector_south.pos[0]), (origin.y+connector_south.pos[1]), room.name),
    template,
    "SOUTH")
  connectors.push(connector_south)

  // WEST
  const connector_west = GetTemplateConnectorWest(template)
  createConnectorFlag(
    room,
    new RoomPosition((origin.x+connector_west.pos[0]), (origin.y+connector_west.pos[1]), room.name),
    template,
    "WEST")
  connectors.push(connector_west)
  
  return connectors
}

/**
 * 
 * @param {Room} room 
 * @returns
 */
function getRoomComponents(room){
  return Memory["complex_components"]
}


/**
 * Gets the number of structures in the given complex template and adds then to planned_structure_counts
 * @param {Room} room 
 */
function updateStructureCounts(room){
  room.memory["planned_structure_counts"] = {
    "road": 0,
    "extension": 0,
    "storage": 0,
    "tower": 0,
    "container": 0
  }

  for(let i in Memory["complex_inventory"]){
    let component = i.split(':')
    if(component[2] !== "null"){
      room.memory["planned_structure_counts"][component[2]]++
    }
  }
}

/**
 * Stores the complex in memory
 * @param {String} complex_template
 * @param {RoomPosition} complex_origin
 */
function storeComplexLayout(complex_template, complex_origin) {

  const complex_key = `${complex_origin.roomName}_${complex_origin.x}_${complex_origin.y}`
  const complex_components = GetComplexTemplate(complex_template)
  Memory["complexes"][complex_key] = {
    "template": complex_template,
    "room_name": complex_origin.roomName,
    "position_x": complex_origin.x,
    "position_y": complex_origin.y,
    "length_x": Math.sqrt(complex_components.length),
    "length_y": Math.sqrt(complex_components.length),
    "components": complex_components,
    "connectors": complex_components.filter(component => component.conn),
  }

  // Generate a global structure map.
  complex_components.forEach(component => {
    const posx = complex_origin.x +component.pos[0]
    const posy = complex_origin.y+component.pos[1]
    const component_key = `${complex_origin.roomName}:${complex_template}:${String(component.type)}:${posx}:${posy}`
    Memory["complex_inventory"][component_key] = [posx,posy]
    Memory["complex_components"][`${posx}:${posy}`] = component.type
  })
  
}

/**
 * Used to find the origin offset when building a neighbor complex on a connector
 * @param {String} room_name 
 * @param {String} template 
 * @param {Complex} complex 
 * @param {Number[]} connector_offset 
 * @returns {RoomPosition}
 */
function getConnectorBuildOffset(room_name, template, complex, connector_offset) {
  const lx = (Math.sqrt(GetComplexTemplate(template).length)) + 2
  const ly = (Math.sqrt(GetComplexTemplate(template).length)) + 2

  var px = connector_offset[0]
  var py = connector_offset[1]

  var pos_x = complex.position_x + px
  var pos_y = complex.position_y + py

  // North
  if ((px === 0) && (py > 0))
    pos_y = (pos_y - ly) - 1

  // East
  if ((px < 0) && (py === 0))
    pos_x = (pos_x + lx) + 1

  //South
  if ((px === 0) && (py < 0))
    pos_y = (pos_y + ly) + 1

  // West
  if ((px > 0) && (py === 0))
    pos_x = (pos_x - lx) - 1

  return new RoomPosition(pos_x, pos_y, room_name)
}

/**
 * 
 * @param {String} template - The name of the complex template that will be constructed
 * @param {Flag} flag - The flag that represents the road connector the complex will be attached to
 * @returns {RoomPosition} position - The origin for the new complex
 */
function getNeighborComplexOriginByFlag(template, flag) {
  let position_x = flag.pos.x
  let position_y = flag.pos.y

  /***************************************************************************************************** 
   * Note: We're offsetting the position by 2 instead of 1 to put one unit of space between each plot. *
   *****************************************************************************************************/

  switch (flag.memory["direction"]) {
    case "NORTH":
      let north_connector = GetTemplateConnectorNorth(template)
      let north_offset_x = north_connector.pos[0]
      let north_offset_y = north_connector.pos[1] - 2
      position_x = position_x + north_offset_x
      position_y = position_y + north_offset_y
      return new RoomPosition(position_x, position_y, flag.pos.roomName)
    case "EAST":
      let east_connector = GetTemplateConnectorEast(template)
      let east_offset_x = east_connector.pos[0] + 2
      let east_offset_y = east_connector.pos[1]
      position_x = position_x + east_offset_x
      position_y = position_y + east_offset_y
      return new RoomPosition(position_x, position_y, flag.pos.roomName)
    case "SOUTH":
      let south_connector = GetTemplateConnectorSouth(template)
      let south_offset_x = south_connector.pos[0]
      let south_offset_y = south_connector.pos[1] + 2
      position_x = position_x + south_offset_x
      position_y = position_y + south_offset_y
      return new RoomPosition(position_x, position_y, flag.pos.roomName)
    case "WEST":
      let west_connector = GetTemplateConnectorWest(template)
      let west_offset_x = west_connector.pos[0] - 2
      let west_offset_y = west_connector.pos[1]
      position_x = position_x + west_offset_x
      position_y = position_y + west_offset_y
      return new RoomPosition(position_x, position_y, flag.pos.roomName)
  }
  throw (`Failed to find the neighbor complexs origin by flag. Template: ${template} - Flag: ${JSON.stringify(flag)}`)
}

/**
 * 
 * @param {String} template_name  - An optional remplate name to filter for.
 * @returns {Complex[]} filtered_complexes - An object that contains all the found complexes
 */
 function getComplexTemplates(template_name=null){
  let filtered_complexes = []
  if(template_name){
    for (const [key, value] of Object.entries(Memory["complexes"])) {
      if(value.template === "template_name"){
        filtered_complexes.push(value)
      }
    }
  } else {
    filtered_complexes = Object.values(Memory["complexes"])
  }
  return filtered_complexes
 }

/**
 * Gets the complex object from memory
 * @param {String} complex_name 
 * @returns {Complex}
 */
function getComplex(complex_name){
  return Memory["complexes"][complex_name]
}

/**
 * Gets the complex object from memory
 * @param {RoomPosition} position
 * @returns {Complex|Boolean}
 */
 function getComplexAt(position){
  return Memory["complexes"][`${position.roomName}_${position.x}_${position.y}`]
}

/**
 * Paints the position within each template
 * @param {Room} room 
 */
function paintTemplatePositions(room) {

  if(room.visual.getSize() >= 512000) {return}

  const color_map = {
    "spawn": "red",
    "container": "green",
    "road": "white",
    "extension": "purple",
    "storage": "orange",
    "tower": "pink"
  }

  const complex_components = Memory["complex_inventory"]
  for (const [key, value] of Object.entries(complex_components)) {
    const component_properties = key.split(":");
    const component_position = value
    if (room.name == component_properties[0]) {
      const pos = new RoomPosition(component_position[0], component_position[1], component_properties[0])
      room.visual.circle(pos, { stroke: color_map[component_properties[2]], fill: 'transparent' })
    }
  }
}