// Calculates the distance between two points on a 2D grid
function getDistance(posA, posB) {
  return Math.sqrt(Math.pow((posA.x-posB.x),2)+Math.pow((posA.y-posB.y),2))
}

function getClosestByPos(posA, posArray){
  var smallest_distance = Number.MAX_SAFE_INTEGER
  var closest_pos = null
  for (var i in posArray){
    var distance = getDistance(posA, posArray[i])
    if (distance < smallest_distance) {
        smallest_distance = distance
        closest_pos = posArray[i]
    }
  }
  return closest_pos
}

function getClosestByObject(posA, objects) {
  posArray = []
  for(var i in objects){
    posArray.push(objects[i].pos)
  }

  var closest_pos = getClosestByPos(posA, posArray)

  for(var i in objects){
   if(objects[i].pos == closest_pos) {
     return objects[i]
   }
  }
  return null
}

module.exports = {

    // Returns the distance between two points: posA:{x,y} and posB:{x,y}
    GetDistance(posA, posB) {
      return getDistance(posA, posB)
    },

    // Returns the closest position(B) to the given position(A)
    GetClosestByPos(posA, ...posB){
      return getClosestByPos(posA, ...posB)
    },

    // Returns the closest object to the given position(A)
    GetClosestByObject(posA, objects){
      return getClosestByObject(posA, objects)
    }
};

