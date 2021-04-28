const { LogMsg } = require('./logger')
const { LOG_LEVEL } = require('./constants')

/**
 * Sets up the global memory objects.
 */
function globalSetup() {
  if (typeof Memory["tick"] === undefined) {
    Memory["tick"] = true
  }
  if (typeof Memory["log_level"] === undefined) {
    Memory["log_level"] = LOG_LEVEL.INFO
  }
}

const median = arr => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

/**
 * Hashes the given word list and returns a sorted hash list
 * @param {Array} word_list - The list of words to sort.
 */
function wordHash(word_list) {
  const R = 31; //Small Prime Number
  const M = 65536; //Array Size
  var hash_list = []

  word_list.forEach(word => {
    let hash = 0
    for (let i = 0; i < word.length; i++) {
      hash = R * hash + word.charCodeAt(i) / M
    }
    hash_list.push(hash)
  })

  return hash_list.sort(function (a, b) {
    return a - b;
  });
}

/**
 * Bin hashes the given word list into the given number of bins
 * @param {Array} word_list - The list of words to sort.
 * @param {Number} bin_count - The number of bins to sort the words into.
 */
function binHash(word_list, bin_count) {
  const word_hash_list = wordHash(word_list)
  var index = 0
  var binned_words = []

  var spread = word_hash_list.slice(-1)[0] / bin_count

  for (let i = 0; i < bin_count; i++) {
    binned_words.push(word_hash_list.filter(word => word >= index && word <= index + spread))
  }
}


// Calculates the distance between two points on a 2D grid
function getDistance(posA, posB) {
  return Math.sqrt(Math.pow((posA.x - posB.x), 2) + Math.pow((posA.y - posB.y), 2))
}

function getClosestByPos(posA, posArray) {
  var smallest_distance = Number.MAX_SAFE_INTEGER
  var closest_pos = null
  for (let i in posArray) {
    var distance = getDistance(posA, posArray[i])
    if (distance < smallest_distance) {
      smallest_distance = distance
      closest_pos = posArray[i]
    }
  }
  return closest_pos
}

function getClosestByObject(posA, objects) {
  var posArray = []
  for (let i in objects) {
    posArray.push(objects[i].pos)
  }
  var closest_pos = getClosestByPos(posA, posArray)
  for (let i in objects) {
    if (objects[i].pos.x === closest_pos.x && objects[i].pos.y === closest_pos.y) {
      return objects[i]
    }
  }
  LogMsg(LOG_LEVEL.ERROR, `Failed to find closest object out of ${objects.length} input objects`)
  return null
}

module.exports = {

  GlobalSetup() {
    globalSetup()
  },

  // Returns the distance between two points: posA:{x,y} and posB:{x,y}
  GetDistance(posA, posB) {
    return getDistance(posA, posB)
  },

  // Returns the closest position(B) to the given position(A)
  GetClosestByPos(posA, ...posB) {
    return getClosestByPos(posA, ...posB)
  },

  // Returns the closest object to the given position(A)
  GetClosestByObject(posA, objects) {
    return getClosestByObject(posA, objects)
  }
};

