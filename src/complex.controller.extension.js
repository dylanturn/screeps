const { ConstructComplex } = require('./complex.util')
const { GetNeighborComplexOriginByFlag } = require("./complex.util")
const { LogMsg } = require('./logger')
const { LOG_LEVEL } = require('./constants')
const templates = require('./complex.template')

const ordered_template_list = [
  templates.TEMPLATE_LARGE_EXTENSION,
  templates.TEMPLATE_LARGE_EXTENSION_ALT,
  templates.TEMPLATE_MEDIUM_EXTENSION,
  templates.TEMPLATE_MEDIUM_EXTENSION_ALT,
  templates.TEMPLATE_SMALL_EXTENSION,
  templates.TEMPLATE_SMALL_EXTENSION_ALT,
]

module.exports = {
  ConstructExtensions(room){
    return constructExtensions(room)
  },
}

function constructExtensions(room) {    
  
  const flags = room.find(FIND_FLAGS)
  for(let i in flags){
    let flag = flags[i]
    if(flag.memory["type"] === "connector"){
      for(let j in ordered_template_list){
        if(tryPlaceTemplate(ordered_template_list[j], flag)){
          return true
        }
      }
    }
  }
  return false
}

function tryPlaceTemplate(template, flag){
  try {
    const complex_origin = GetNeighborComplexOriginByFlag(template, flag)
    if(ConstructComplex(template, complex_origin)){
      flag.remove()
      return true
    }
    return false
  }
  catch (err) {
    flag.remove()
    LogMsg(LOG_LEVEL.ERROR, `The complex controller has failed with error:\n${err} - ${err.stack}`)
  }
  return false
}
