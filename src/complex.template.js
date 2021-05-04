module.exports = {
  /**
   * Returns the complex template that matches the given name.
   * @param {String} name - The name of the complex template.
   * @returns {ComplexComponent[]} - An array of components that make up the complex
   */
  GetComplexTemplate(name){return getComplexTemplate(name)},

  /**
   * Counts number of structures by type in the given template
   * @param {String} name 
   * @returns {Object}
   */
  GetTemplateStructureCounts(name){ return getTemplateStructureCounts(name)},

  /**
   * Returns the templates width
   * @param {String} name - The name of the complex template.
   * @returns {Number} - The templates width as a whole number
   */
  GetTemplateWidth(name){return getTemplateWidth(name)},

  /**
   * Returns the templates height
   * @param {String} name - The name of the complex template.
   * @returns {Number} - The templates height as a whole number
   */
  GetTemplateHeight(name){return getTemplateHeight(name)},

  /**
   * Returns the templates area
   * @param {String} name - The name of the complex template.
   * @returns {Number} - The templates area as a whole number in units squared
   */
  GetTemplateArea(name){return getTemplateArea(name)},

  /**
   * Returns the templates center complex component
   * @param {String} name - The name of the complex template.
   * @returns {ComplexComponent} - The complex component at the center of the template
   */
  GetTemplateCenter(name){return getTemplateCenter(name)},

  /**
   * Returns a boolean that indicates wether or not the given template contains connectors
   * @param {String} name - The name of the complex template.
   * @returns {Boolean} - True if the complex has connectors.
   */
  GetTemplateHasConnectors(name){return getTemplateHasConnectors(name)},

  /**
   * Returns an array of the templates road connectors
   * @param {String} name - The name of the complex template.
   * @returns {ComplexComponent[]} - An array of the templates road connector components
   */
  GetTemplateConnectors(name){return getTemplateConnectors(name)},

  /**
   * Returns the templates northern road connector
   * @param {String} name - The name of the complex template.
   * @returns {ComplexComponent} - The complex templates northern road connector
   */
  GetTemplateConnectorNorth(name){
    return getTemplateConnectorNorth(name)
  },

  /**
   * Returns the templates eastern road connector
   * @param {String} name - The name of the complex template.
   * @returns {ComplexComponent} - The complex templates eastern road connector
   */
  GetTemplateConnectorEast(name){return getTemplateConnectorEast(name)},

  /**
   * Returns the templates southern road connector
   * @param {String} name - The name of the complex template.
   * @returns {ComplexComponent} - The complex templates southern road connector
   */
  GetTemplateConnectorSouth(name){return getTemplateConnectorSouth(name)},

  /**
   * Returns the templates western road connector
   * @param {String} name - The name of the complex template.
   * @returns {ComplexComponent} - The complex templates western road connector
   */
  GetTemplateConnectorWest(name){return getTemplateConnectorWest(name)},

  TEMPLATE_SINGLE_ROAD: "single_road_template",

  
  TEMPLATE_SPAWN: "spawn_template",
  TEMPLATE_SPAWN_ALT: "spawn_template_alt",

  
  TEMPLATE_SPAWN_EXTENSION: "spawn_extension_template",
  TEMPLATE_SPAWN_EXTENSION_ALT: "spawn_extension_template_alt",

  
  TEMPLATE_SINGLE_CONTAINER: "single_container_template",
  TEMPLATE_SMALL_CONTAINER: "small_container_template",


  TEMPLATE_SINGLE_TOWER: "single_tower_template",
  TEMPLATE_SMALL_TOWER: "small_tower_template",


  TEMPLATE_SINGLE_EXTENSION: "single_extension_template",

  TEMPLATE_SMALL_EXTENSION: "small_extension_template",
  TEMPLATE_SMALL_EXTENSION_ALT: "small_extension_template_alt",

  TEMPLATE_MEDIUM_EXTENSION: "meduim_extension_template",
  TEMPLATE_MEDIUM_EXTENSION_ALT: "meduim_extension_template_alt",

  TEMPLATE_LARGE_EXTENSION: "large_extension_template",
  TEMPLATE_LARGE_EXTENSION_ALT: "large_extension_template_alt"
}

const z = STRUCTURE_SPAWN
const c = STRUCTURE_CONTAINER
const r = STRUCTURE_ROAD
const e = STRUCTURE_EXTENSION
const s = STRUCTURE_STORAGE
const t = STRUCTURE_TOWER
const x = null

const templates = {
  

  // Single Road Template
  single_road_template: [
    cmp(r,[ 0, 0],false)
  ],


  // Single Container Template
  single_container_template: [
    cmp(c,[ 0, 0],false)
  ],
  small_container_template: [
    cmp(r,[-1,-1],false), cmp(r,[ 0,-1],false), cmp(r,[ 1,-1],false),
    cmp(r,[-1, 0],false), cmp(c,[ 0, 0],false), cmp(r,[ 1, 0],false),
    cmp(r,[-1, 1],false), cmp(r,[ 0, 1],false), cmp(r,[ 1, 1],false)
  ],
  

  // Single Tower Template
  single_tower_template: [
    cmp(t,[ 0, 0],false)
  ],
  small_tower_template: [
    cmp(r,[-1,-1],false), cmp(r,[ 0,-1],false), cmp(r,[ 1,-1],false),
    cmp(r,[-1, 0],false), cmp(t,[ 0, 0],false), cmp(r,[ 1, 0],false),
    cmp(r,[-1, 1],false), cmp(r,[ 0, 1],false), cmp(r,[ 1, 1],false)
  ],


  // Spawn Extension Templates (For second and third spawns.)
  spawn_template: [
    cmp(x,[-3,-3],false), cmp(x,[-2, -3],false), cmp(r,[-1, -3],false), cmp(r,[ 0 , -3], true), cmp(r,[ 1, -3],false), cmp(x,[ 2, -3],false), cmp(x,[ 3, -3],false),
    cmp(x,[-3,-2],false), cmp(r,[-2, -2], true), cmp(e,[-1, -2],false), cmp(r,[ 0 , -2],false), cmp(e,[ 1, -2],false), cmp(r,[ 2, -2], true), cmp(x,[ 3, -2],false),
    cmp(r,[-3,-1],false), cmp(e,[-2, -1],false), cmp(s,[-1, -1],false), cmp(r,[ 0 , -1],false), cmp(e,[ 1, -1],false), cmp(e,[ 2, -1],false), cmp(r,[ 3, -1],false),
    cmp(r,[-3, 0], true), cmp(r,[-2,  0],false), cmp(r,[-1,  0],false), cmp(z,[ 0 ,  0],false), cmp(r,[ 1,  0],false), cmp(r,[ 2,  0],false), cmp(r,[ 3,  0], true),
    cmp(r,[-3, 1],false), cmp(e,[-2,  1],false), cmp(t,[-1,  1],false), cmp(r,[ 0 ,  1],false), cmp(c,[ 1,  1],false), cmp(e,[ 2,  1],false), cmp(r,[ 3,  1],false),
    cmp(x,[-3, 2],false), cmp(r,[-2,  2], true), cmp(e,[-1,  2],false), cmp(r,[ 0 ,  2],false), cmp(e,[ 1,  2],false), cmp(r,[ 2,  2], true), cmp(x,[ 3,  2],false),
    cmp(x,[-3, 3],false), cmp(x,[-2,  3],false), cmp(r,[-1,  3],false), cmp(r,[ 0 ,  3], true), cmp(r,[ 1,  3],false), cmp(x,[ 2,  3],false), cmp(x,[ 3,  3],false),
  ],
  spawn_template_alt: [
    { "type": e, "pos": [-2, -2], "conn": false }, { "type": e, "pos": [-1, -2], "conn": false }, { "type": r, "pos": [0, -2], "conn": true  }, { "type": e, "pos": [1, -2], "conn": false }, { "type": e, "pos": [2, -2], "conn": false },
    { "type": e, "pos": [-2, -1], "conn": false }, { "type": s, "pos": [-1, -1], "conn": false }, { "type": r, "pos": [0, -1], "conn": false }, { "type": e, "pos": [1, -1], "conn": false }, { "type": e, "pos": [2, -1], "conn": false },
    { "type": r, "pos": [-2,  0], "conn": true  }, { "type": r, "pos": [-1,  0], "conn": false }, { "type": z, "pos": [0,  0], "conn": false }, { "type": r, "pos": [1,  0], "conn": false }, { "type": r, "pos": [2,  0], "conn": true  },
    { "type": e, "pos": [-2,  1], "conn": false }, { "type": t, "pos": [-1,  1], "conn": false }, { "type": r, "pos": [0,  1], "conn": false }, { "type": c, "pos": [1,  1], "conn": false }, { "type": e, "pos": [2,  1], "conn": false },
    { "type": e, "pos": [-2,  2], "conn": false }, { "type": e, "pos": [-1,  2], "conn": false }, { "type": r, "pos": [0,  2], "conn": true  }, { "type": e, "pos": [1,  2], "conn": false }, { "type": e, "pos": [2,  2], "conn": false }
  ],
  
  
  // Spawn Extension Templates (For spawns that already exist.)
  spawn_extension_template: [
    cmp(x,[-3,-3],false), cmp(x,[-2, -3],false), cmp(r,[-1, -3],false), cmp(r,[ 0 , -3], true), cmp(r,[ 1, -3],false), cmp(x,[ 2, -3],false), cmp(x,[ 3, -3],false),
    cmp(x,[-3,-2],false), cmp(r,[-2, -2], true), cmp(e,[-1, -2],false), cmp(r,[ 0 , -2],false), cmp(e,[ 1, -2],false), cmp(r,[ 2, -2], true), cmp(x,[ 3, -2],false),
    cmp(r,[-3,-1],false), cmp(e,[-2, -1],false), cmp(s,[-1, -1],false), cmp(r,[ 0 , -1],false), cmp(e,[ 1, -1],false), cmp(e,[ 2, -1],false), cmp(r,[ 3, -1],false),
    cmp(r,[-3, 0], true), cmp(r,[-2,  0],false), cmp(r,[-1,  0],false), cmp(x,[ 0 ,  0],false), cmp(r,[ 1,  0],false), cmp(r,[ 2,  0],false), cmp(r,[ 3,  0], true),
    cmp(r,[-3, 1],false), cmp(e,[-2,  1],false), cmp(t,[-1,  1],false), cmp(r,[ 0 ,  1],false), cmp(c,[ 1,  1],false), cmp(e,[ 2,  1],false), cmp(r,[ 3,  1],false),
    cmp(x,[-3, 2],false), cmp(r,[-2,  2], true), cmp(e,[-1,  2],false), cmp(r,[ 0 ,  2],false), cmp(e,[ 1,  2],false), cmp(r,[ 2,  2], true), cmp(x,[ 3,  2],false),
    cmp(x,[-3, 3],false), cmp(x,[-2,  3],false), cmp(r,[-1,  3],false), cmp(r,[ 0 ,  3], true), cmp(r,[ 1,  3],false), cmp(x,[ 2,  3],false), cmp(x,[ 3,  3],false),
  ],
  spawn_extension_template_alt: [
    { "type": e, "pos": [-2, -2], "conn": false }, { "type": e, "pos": [-1, -2], "conn": false }, { "type": r, "pos": [0, -2], "conn": true  }, { "type": e, "pos": [1, -2], "conn": false }, { "type": e, "pos": [2, -2], "conn": false },
    { "type": e, "pos": [-2, -1], "conn": false }, { "type": s, "pos": [-1, -1], "conn": false }, { "type": r, "pos": [0, -1], "conn": false }, { "type": e, "pos": [1, -1], "conn": false }, { "type": e, "pos": [2, -1], "conn": false },
    { "type": r, "pos": [-2,  0], "conn": true  }, { "type": r, "pos": [-1,  0], "conn": false }, { "type": x, "pos": [0,  0], "conn": false }, { "type": r, "pos": [1,  0], "conn": false }, { "type": r, "pos": [2,  0], "conn": true  },
    { "type": e, "pos": [-2,  1], "conn": false }, { "type": t, "pos": [-1,  1], "conn": false }, { "type": r, "pos": [0,  1], "conn": false }, { "type": c, "pos": [1,  1], "conn": false }, { "type": e, "pos": [2,  1], "conn": false },
    { "type": e, "pos": [-2,  2], "conn": false }, { "type": e, "pos": [-1,  2], "conn": false }, { "type": r, "pos": [0,  2], "conn": true  }, { "type": e, "pos": [1,  2], "conn": false }, { "type": e, "pos": [2,  2], "conn": false }
  ],
  

  // Small Extension Templates
  small_extension_template: [
    cmp(r,[-1,-1],false), cmp(r,[ 0,-1],false), cmp(r,[ 1,-1],false),
    cmp(r,[-1, 0],false), cmp(e,[ 0, 0],false), cmp(r,[ 1, 0],false),
    cmp(r,[-1, 1],false), cmp(r,[ 0, 1],false), cmp(r,[ 1, 1],false)
  ],
  small_extension_template_alt: [
    { "type": e, "pos": [-1, -1], "conn": false }, { "type": r, "pos": [0, -1], "conn": true  },  { "type": e, "pos": [1, -1], "conn": false },
    { "type": r, "pos": [-1,  0], "conn": true  }, { "type": r, "pos": [0,  0], "conn": false },  { "type": r, "pos": [1,  0], "conn": true  },
    { "type": e, "pos": [-1,  1], "conn": false }, { "type": r, "pos": [0,  1], "conn": true  },  { "type": e, "pos": [1,  1], "conn": false }
  ],


  // Medium Extension Templates
  meduim_extension_template: [
    cmp(x,[-2, -2],false), cmp(x,[ -1, -2],false), cmp(r,[ 0,-2],false), cmp(x,[ 1,-2],false), cmp(x,[ 2,-2],false),
    cmp(x,[-2, -1],false), cmp(r,[ -1, -1],false), cmp(e,[ 0,-1],false), cmp(r,[ 1,-1],false), cmp(x,[ 2,-1],false),
    cmp(r,[-2,  0],false), cmp(e,[ -1,  0],false), cmp(e,[ 0, 0],false), cmp(e,[ 1, 0],false), cmp(r,[ 2, 0],false),
    cmp(x,[-2,  1],false), cmp(r,[ -1,  1],false), cmp(e,[ 0, 1],false), cmp(r,[ 1, 1],false), cmp(x,[ 2, 1],false),
    cmp(x,[-2,  2],false), cmp(x,[ -1,  2],false), cmp(r,[ 0, 2],false), cmp(x,[ 1, 2],false), cmp(x,[ 2, 2],false)
  ],
  meduim_extension_template_alt: [
    { "type": e, "pos": [-2, -2], "conn": false }, { "type": e, "pos": [-1, -2], "conn": false }, { "type": r, "pos": [0, -2], "conn": true  }, { "type": e, "pos": [1, -2], "conn": false }, { "type": e, "pos": [2, -2], "conn": false },
    { "type": e, "pos": [-2, -1], "conn": false }, { "type": e, "pos": [-1, -1], "conn": false }, { "type": r, "pos": [0, -1], "conn": false }, { "type": e, "pos": [1, -1], "conn": false }, { "type": e, "pos": [2, -1], "conn": false },
    { "type": r, "pos": [-2,  0], "conn": true  }, { "type": r, "pos": [-1,  0], "conn": false }, { "type": r, "pos": [0,  0], "conn": false }, { "type": r, "pos": [1,  0], "conn": false }, { "type": r, "pos": [2,  0], "conn": true  },
    { "type": e, "pos": [-2,  1], "conn": false }, { "type": e, "pos": [-1,  1], "conn": false }, { "type": r, "pos": [0,  1], "conn": false }, { "type": e, "pos": [1,  1], "conn": false }, { "type": e, "pos": [2,  1], "conn": false },
    { "type": e, "pos": [-2,  2], "conn": false }, { "type": e, "pos": [-1,  2], "conn": false }, { "type": r, "pos": [0,  2], "conn": true  }, { "type": e, "pos": [1,  2], "conn": false }, { "type": e, "pos": [2,  2], "conn": false }
  ],


  // Large Extension Templates
  large_extension_template: [
    cmp(x,[-3,-3],false), cmp(x,[-2, -3],false), cmp(r,[-1, -3],false), cmp(r,[ 0 , -3], true), cmp(r,[ 1, -3],false), cmp(x,[ 2, -3],false), cmp(x,[ 3, -3],false),
    cmp(x,[-3,-2],false), cmp(r,[-2, -2], true), cmp(e,[-1, -2],false), cmp(r,[ 0 , -2],false), cmp(e,[ 1, -2],false), cmp(r,[ 2, -2], true), cmp(x,[ 3, -2],false),
    cmp(r,[-3,-1],false), cmp(e,[-2, -1],false), cmp(s,[-1, -1],false), cmp(r,[ 0 , -1],false), cmp(e,[ 1, -1],false), cmp(e,[ 2, -1],false), cmp(r,[ 3, -1],false),
    cmp(r,[-3, 0], true), cmp(r,[-2,  0],false), cmp(r,[-1,  0],false), cmp(r,[ 0 ,  0],false), cmp(r,[ 1,  0],false), cmp(r,[ 2,  0],false), cmp(r,[ 3,  0], true),
    cmp(r,[-3, 1],false), cmp(e,[-2,  1],false), cmp(t,[-1,  1],false), cmp(r,[ 0 ,  1],false), cmp(s,[ 1,  1],false), cmp(e,[ 2,  1],false), cmp(r,[ 3,  1],false),
    cmp(x,[-3, 2],false), cmp(r,[-2,  2], true), cmp(e,[-1,  2],false), cmp(r,[ 0 ,  2],false), cmp(e,[ 1,  2],false), cmp(r,[ 2,  2], true), cmp(x,[ 3,  2],false),
    cmp(x,[-3, 3],false), cmp(x,[-2,  3],false), cmp(r,[-1,  3],false), cmp(r,[ 0 ,  3], true), cmp(r,[ 1,  3],false), cmp(x,[ 2,  3],false), cmp(x,[ 3,  3],false),
  ],
  large_extension_template_alt: [
    { "type": x, "pos": [-3, -3], "conn": false }, { "type": x, "pos": [-2, -3], "conn": false }, { "type": e, "pos": [-1, -3], "conn": false }, { "type": r, "pos": [0, -3], "conn": true  }, { "type": e, "pos": [1, -3], "conn": false }, { "type": x, "pos": [2, -3], "conn": false }, { "type": x, "pos": [3, -3], "conn": false },
    { "type": x, "pos": [-3, -2], "conn": false }, { "type": e, "pos": [-2, -2], "conn": false }, { "type": e, "pos": [-1, -2], "conn": false }, { "type": r, "pos": [0, -2], "conn": false }, { "type": e, "pos": [1, -2], "conn": false }, { "type": e, "pos": [2, -2], "conn": false }, { "type": x, "pos": [3, -2], "conn": false },
    { "type": e, "pos": [-3, -1], "conn": false }, { "type": e, "pos": [-2, -1], "conn": false }, { "type": e, "pos": [-1, -1], "conn": false }, { "type": r, "pos": [0, -1], "conn": false }, { "type": e, "pos": [1, -1], "conn": false }, { "type": e, "pos": [2, -1], "conn": false }, { "type": e, "pos": [3, -1], "conn": false },
    { "type": r, "pos": [-3,  0], "conn": true  }, { "type": r, "pos": [-2,  0], "conn": false }, { "type": r, "pos": [-1,  0], "conn": false }, { "type": r, "pos": [0,  0], "conn": false }, { "type": r, "pos": [1,  0], "conn": false }, { "type": r, "pos": [2,  0], "conn": false }, { "type": r, "pos": [3,  0], "conn": true  },
    { "type": e, "pos": [-3,  1], "conn": false }, { "type": e, "pos": [-2,  1], "conn": false }, { "type": e, "pos": [-1,  1], "conn": false }, { "type": r, "pos": [0,  1], "conn": false }, { "type": e, "pos": [1,  1], "conn": false }, { "type": e, "pos": [2,  1], "conn": false }, { "type": e, "pos": [3,  1], "conn": false },
    { "type": x, "pos": [-3,  2], "conn": false }, { "type": e, "pos": [-2,  2], "conn": false }, { "type": e, "pos": [-1,  2], "conn": false }, { "type": r, "pos": [0,  2], "conn": false }, { "type": e, "pos": [1,  2], "conn": false }, { "type": e, "pos": [2,  2], "conn": false }, { "type": x, "pos": [3,  2], "conn": false },
    { "type": x, "pos": [-3,  3], "conn": false }, { "type": x, "pos": [-2,  3], "conn": false }, { "type": e, "pos": [-1,  3], "conn": false }, { "type": r, "pos": [0,  3], "conn": true  }, { "type": e, "pos": [1,  3], "conn": false }, { "type": x, "pos": [2,  3], "conn": false }, { "type": x, "pos": [3,  3], "conn": false }
  ]
}

/**
 * Counts number of structures by type in the given template
 * @param {String} name 
 * @returns {Object}
 */
function getTemplateStructureCounts(name){
  let structures = {}
  getComplexTemplate(name).forEach(component => {
    if(component.type !== x){
      if(typeof(structures[component.type]) === 'undefined'){
        structures[component.type] = 1
      } else {
        structures[component.type]++
      }
    }
  })
  return structures
}

/**
 * Formats and returns a complex component
 * Used to make templates easier to read
 * @param {*} type 
 * @param {*} pos 
 * @param {*} conn 
 * @returns 
 */
 function cmp(type, pos, conn){
  return { "type": type, "pos": pos, "conn": conn }
}

/**
 * Returns the complex template that matches the given name.
 * @param {String} name - The name of the complex template.
 * @returns {ComplexComponent[]} - An array of components that make up the complex
 */
function getComplexTemplate(name){
  return templates[name]
}

/**
 * Returns the templates width
 * @param {String} name - The name of the complex template.
 * @returns {Number} - The templates width as a whole number
 */
function getTemplateWidth(name){
  return Math.sqrt(templates[name].length)
}

/**
 * Returns the templates height
 * @param {String} name - The name of the complex template.
 * @returns {Number} - The templates height as a whole number
 */
function getTemplateHeight(name){
  return Math.sqrt(templates[name].length)
}

/**
 * Returns the templates area
 * @param {String} name - The name of the complex template.
 * @returns {Number} - The templates area as a whole number in units squared
 */
function getTemplateArea(name){
  return templates[name].length
}

/**
 * Returns the templates center complex component
 * @param {String} name - The name of the complex template.
 * @returns {ComplexComponent} - The complex component at the center of the template
 */
function getTemplateCenter(name){
  return templates[name][(getTemplateArea(name)-1)/2]
}

/**
 * Returns a boolean that indicates wether or not the given template contains connectors
 * @param {String} name - The name of the complex template.
 * @returns {Boolean} - True if the complex has connectors.
 */
 function getTemplateHasConnectors(name){
  for(let i in templates[name]){
    if(templates[name][i]["conn"]){
      return true
    }
  }
  return false
}

/**
 * Returns an array of the templates road connectors
 * @param {String} name - The name of the complex template.
 * @returns {ComplexComponent[]} - An array of the templates road connector components
 */
function getTemplateConnectors(name){
  let connectors = []
  templates[name].forEach(component => {
    if(component["conn"]){
      connectors.push(component)
    }
  });
  return connectors
}

/**
 * Returns the templates northern road connector
 * @param {String} name - The name of the complex template.
 * @returns {ComplexComponent} - The complex templates northern road connector
 */
function getTemplateConnectorNorth(name){
  const template = templates[name]
  const connector_offset = -Math.abs((getTemplateHeight(name)-1)/2)
  for(let i in template){
    let component = template[i]
    if((component.pos[0] === 0) && (component.pos[1] === connector_offset)){
      if(component.conn === true){
        return component
      }
    }
  }
  throw `Failed to locate northern road connector for template ${name} with the following offsets: X=0, Y=${connector_offset}`;
}

/**
 * Returns the templates northern road connector
 * @param {String} name - The name of the complex template.
 * @returns {ComplexComponent} - The complex templates eastern road connector
 */
function getTemplateConnectorEast(name){
  const template = templates[name]
  const connector_offset = (getTemplateHeight(name)-1)/2
  for(let i in template){
    let component = template[i]
    if((component.pos[0] === connector_offset) && component.pos[1] === 0){
      if(component.conn){
        return component
      }
    }
  }
  throw `Failed to locate eastern road connector for template ${name} with the following offsets: X=0, Y=${connector_offset}`;
}

/**
 * Returns the templates northern road connector
 * @param {String} name - The name of the complex template.
 * @returns {ComplexComponent} - The complex templates southern road connector
 */
function getTemplateConnectorSouth(name){
  const template = templates[name]
  const connector_offset = (getTemplateHeight(name)-1)/2
  for(let i in template){
    let component = template[i]
    if((component.pos[0] === 0) && component.pos[1] === connector_offset){
      if(component.conn){
        return component
      }
    }
  }
  throw `Failed to locate southern road connector for template ${name} with the following offsets: X=0, Y=${connector_offset}`;
}

/**
 * Returns the templates northern road connector
 * @param {String} name - The name of the complex template.
 * @returns {ComplexComponent} - The complex templates western road connector
 */
function getTemplateConnectorWest(name){
  const template = templates[name]
  const connector_offset = -Math.abs((getTemplateHeight(name)-1)/2)
  for(let i in template){
    let component = template[i]
    if((component.pos[0] === connector_offset) && component.pos[1] === 0){
      if(component.conn){
        return component
      }
    }
  }
  throw `Failed to locate western road connector for template ${name} with the following offsets: X=0, Y=${connector_offset}`;
}
