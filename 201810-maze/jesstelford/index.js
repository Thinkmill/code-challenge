const X = 0;
const Y = 1;
const VISIBLE_DISTANCE = 2;
const VISIBLE_WIDTH = (VISIBLE_DISTANCE * 2) + 1;
const VISIBLE_HEIGHT = (VISIBLE_DISTANCE * 2) + 1;
const IS_TRAVERSIBLE = true;

const spliceImmutably = (collection, index, deleteNum = collection.length, newStuff = []) => {
  if (index < 0) { throw new Error('Index must be a positive integer'); }
  if (deleteNum < 0) { throw new Error('deleteNum must be a positive integer'); }
  if (!Array.isArray(newStuff)) { throw new Error('Must provide an array to insert'); }
  return collection.slice(0, index).concat(...newStuff, collection.slice(index + deleteNum));
};

// TODO implement a non-naive algorithm
function createPriorityQueue(comparator) {
  const queue = [];

  function indexOfLowestPriority() {
    let lowestPriority = Infinity;
    let lowestIndex = -1;

    for (let index = 0; index < queue.length; index += 1) {
      if (comparator(queue[index].priority, lowestPriority) < 0) {
        lowestPriority = queue[index].priority;
        lowestIndex = index;
      }
    }

    return lowestIndex;
  }

  function indexOfItem(item) {
    return queue.find(item => item.item === item);
  }

  return {
    //  returns the (numerically) lowest priority of any item in the queue (or infinity if the queue is empty)
    topKey() {
      if (!queue.length) {
        return Infinity;
      }
      return queue[indexOfLowestPriority()].priority;
    },

    //  removes the item with the lowest priority from the queue and returns it
    pop() {
      if (!queue.length) {
        return null;
      }

      const index = indexOfLowestPriority();
      const result = queue[index];

      queue.splice(index, 1);

      return result.item;
    },

    //  inserts a item with a given priority into the queue
    insert(item, priority) {
      queue.push({ item, priority });
    },

    //  removes a item from the queue
    remove(item) {
      const index = indexOfItem(item);
      if (index !== -1) {
        queue.splice(index, 1);
      }
    },

    //  returns true if the queue contains the specified item, false if not
    contains(item) {
      const index = indexOfItem(item);
      return index !== -1;
    },
  };
}

function createAstar(map) {
  return {
    computeShortestPath([startX, startY], [endX, endY]) {
      // The set of nodes already evaluated
      const closedSet = [];

      // The set of currently discovered nodes that are not evaluated yet.
      // Initially, only the start node is known.
      const openSet = [[startX, startY]];

      // For each node, which node it can most efficiently be reached from.
      // If a node can be reached from many nodes, cameFrom will eventually contain the
      // most efficient previous step.
      const cameFrom = map.map(row => row.map(() => null));

      // For each node, the cost of getting from the start node to that node.
      const gScore = map.map(row => row.map(() => Infinity));

      // The cost of going from start to start is zero.
      gScore[startY][startX] = 0;

      // For each node, the total cost of getting from the start node to the goal
      // by passing by that node. That value is partly known, partly heuristic.
      const fScore = map.map(row => row.map(() => Infinity));

      // For the first node, that value is completely heuristic.
      fScore[startY][startX] = heuristic([startX, startY], [endX, endY]);

      while (openSet.length) {
        const [currentX, currentY] = popLowestFScoreFromOpen(openSet, fScore);
        if (currentX === endX && currentY === endY) {
          return reconstructPath([endX, endY]);
        }

        closedSet.push([currentX, currentY]);

        getNeighbours(currentX, currentY).forEach(([neighbourX, neighbourY]) => {
          if (closedSet.find(([closedX, closedY]) => neighbourX === closedX && neighbourY === closedY)) {
            return;
          }

          const currentGScore = gScore[currentX][currentY] + getCostBetween([currentX, currentY], [neighbourX, neighbourY])

          if (!openSet.find(([openX, openY]) => neighbourX === openX && neighbourY === openY)) {
            // New node discovered
            openSet.push([neighbourX, neighbourY]);
          } else if (currentGScore >= gScore[neighbourY][neighbourX]) {
            // This is not a better path
            return;
          }

          // This is the best path so far, so we record it
          cameFrom[neighbourY][neighbourX] = [currentX, currentY];
          gScore[neighbourY][neighbourX] = currentGScore;
          fScore[neighbourY][neighbourX] = gScore[neighbourY][neighbourX] + heuristic([neighbourX, neighbourY], [endX, endY]);
        });


      }
    },
  }

  function getCostBetween() {
    // NOTE: No diagonal movements
    return 1;
  }

  function getNeighbours(x, y) {
    const result = [];

    if (x > 0 && map[y][x - 1]) {
      result.push([x - 1, y]);
    }

    if (y > 0 && map[y - 1][x]) {
      result.push([x, y - 1]);
    }

    if (x < map[y].length - 1 && map[y][x + 1]) {
      result.push([x + 1, y]);
    }

    if (y < map.length - 1 && map[y + 1][x]) {
      result.push([x, y + 1]);
    }

    return result;
  }

  // Return the best path (not inclusive of the starting position)
  function reconstructPath([endX, endY]) {
    const path = [[endX, endY]];

    let currentX = endX;
    let currentY = endY;

    while (currentX !== startX || currentY !== startY) {
      [currentX, currentY] = cameFrom[currentY][currentX];
      path.unshift([currentX, currentY]);
    }

    return path;
  }

  function popLowestFScoreFromOpen(openSet, fScore) {
    let lowestScore = Infinity;
    let lowestIndex = -1;
    openSet.forEach(([x, y], index) => {
      if (fScore[y][x] < lowestScore) {
        lowestScore = fScore[y][x];
        lowestIndex = index;
      }
    });

    if (lowestIndex !== -1) {
      // capture result
      const result = openSet[lowestIndex];
      // remove it from the array
      openSet.splice(lowestIndex, 1);
      // return it
      return result;
    }

    return null;
  }

  function heuristic([fromX, fromY], [endX, endY]) {
    // NOTE: No diagonal movements, so the diagonal is not an accurate heuristic
    // Instead we use the straight edge distances
    return Math.abs(endX - fromX) + Math.abs(endY - fromY);
  }
}

// For much wow, see: https://en.wikipedia.org/wiki/Lifelong_Planning_A*
function createLifelongPlanningAstar([startX, startY], [endX, endY], map) {

  const comparator = (prioLeft, prioRight) => {
    if (prioLeft[0] < prioRight[0]) {
      return -1;
    }
    if (prioLeft[0] > prioRight[0]) {
      return 1;
    }
    if (prioLeft[1] < prioRight[1]) {
      return -1;
    }
    if (prioLeft[1] > prioRight[1]) {
      return 1;
    }
    return 0;

  }

  const queue = createPriorityQueue(comparator);

  const nodeMap = map.map((row, rowIndex) => row.map((colIndex) => ({
    g: Infinity,
    rhs: Infinity,
    traversible: true,
    x: colIndex,
    y: rowIndex,
  })));

  nodeMap[startY][startX].rhs = 0;

  queue.insert(nodeMap[startY][startX], calculateKey(startX, startY));

  return {
    updateNodes(nodes) {
      nodes.forEach(({ x, y, traversible }) => {
        // TODO: More?
        nodeMap[y][x].traversible = traversible;
      });
    },

    /** Expands the nodes in the priority queue. */
    computeShortestPath() {
      const goalNode = nodeMap[endY][endX];

      while ((goalNode.rhs != goalNode.g) || comparator(queue.topKey(), calculateKey(endX, endY))) {
        const node = queue.pop();
        if (node.g > node.rhs) {
          node.g = node.rhs;
        } else {
          node.g = Infinity;
          updateNode(node.x, node.y);
        }

        getSuccessors(node.x, node.y).forEach(([x, y]) => {
          updateNode(x, y);
        });
      }
    }
  };

  function heuristic([fromX, fromY]) {
    // NOTE: No diagonal movements, so the diagonal is not an accurate heuristic
    // Instead we use the straight edge distances
    return Math.abs(endX - fromX) + Math.abs(endY - fromY);
  }

  function calculateKey(x, y) {
    const node = nodeMap[y][x];
    return [min(node.g, node.rhs) + heuristic([x, y]), min(node.g, node.rhs)];
  }

  function getPredecessors(x, y) {
    // TODO: Get the adjacent x/y coords?

  }

  function getSuccessors(x, y) {
    // TODO: Get the adjacent x/y coords?

  }

  function getCostBetween(from, to) {
    if (!to.traversible) {
      return Infinity;
    }

    // NOTE: No diagonal movements
    return 1;
  }

  /* Recalculates rhs for a node and removes it from the queue.
   * If the node has become locally inconsistent, it is (re-)inserted into the queue with its new key.
   */
  function updateNode(x, y) {
    if (x === startX && y === startY) {
      return;
    }

    const node = nodeMap[y][x];
    node.rhs = Infinity;

    getPredecessors(x, y).forEach(([preX, preY]) => {
      const predecessor = nodeMap[preY][preX];
      node.rhs = Math.min(node.rhs, predecessor.g + getCostBetween(predecessor, node));
    });

    if (queue.contains(node)) {
      queue.remove(node);
    }

    if (node.g != node.rhs) {
      queue.insert(node, calculateKey(x, y));
    }
  }
}

class BOT {
  // size = {width: 50, height: 15}
  // start = [0, 0]
  // end = [14, 49]
  constructor({ size, start, end }) {
    this.start = start;
    this.position = [...this.start];
    this.end = end;
    this.size = {...size};

    this.map = Array(size.height).fill(null).map(() =>
      // Default to the entire map being traversable
      Array(size.width).fill(IS_TRAVERSIBLE)
    );

    this.astar = createAstar(this.map);

    this.Move = this.Move.bind(this);
    this.mergeVisibleRangeIntoMap = this.mergeVisibleRangeIntoMap.bind(this);
  }

  mergeVisibleRangeIntoMap(visible) {
    const startRow = Math.max(0, this.position[Y] - VISIBLE_DISTANCE);
    const endRow = Math.min(this.size.height - 1, this.position[Y] + VISIBLE_DISTANCE);
    const startCol = Math.max(0, this.position[X] - VISIBLE_DISTANCE);
    const endCol = Math.min(this.size.width - 1, this.position[X] + VISIBLE_DISTANCE);
    const visibleRowOffset = -Math.min(0, this.position[Y] - VISIBLE_DISTANCE)
    const visibleColOffset = -Math.min(0, this.position[X] - VISIBLE_DISTANCE)

    const aStarNodes = [];

    // TODO: Could we make this an immutable operation?
    for (let mapRow = startRow; mapRow <= endRow; mapRow += 1) {
      const visibleRow = visible[visibleRowOffset + (mapRow - startRow)].slice(visibleColOffset);
      this.map[mapRow] = spliceImmutably(this.map[mapRow], startCol, (endCol - startCol) + 1, visibleRow);

      // Queue up node changes for Astar
      aStarNodes.push(...visibleRow.map((traversible, visibleIndex) => ({
        x: visibleColOffset + visibleIndex,
        y: mapRow,
        traversible,
      })));
    }
  };

  Move({ MAP }) {
    this.mergeVisibleRangeIntoMap(MAP);
    const [nextX, nextY] = this.astar.computeShortestPath(this.position, this.end)[0];

    let action;

    if (nextX < this.position[X]) {
      action = 'left';
      this.position[X] = this.position[X] - 1;
    } else if (nextX > this.position[X]) {
      action = 'right';
      this.position[X] = this.position[X] + 1;
    } else if (nextY < this.position[Y]) {
      action = 'up';
      this.position[Y] = this.position[Y] - 1;
    } else if (nextY > this.position[Y]) {
      action = 'down';
      this.position[Y] = this.position[Y] + 1;
    }

    return action;
  }
}

module.exports = exports = BOT;
