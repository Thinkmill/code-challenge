// prettier-ignore
const fullGrid = [
  [true, true, true, true, true],
  [false, true, true, true, true],
  [true, true, true, true, true],
  [true, true, true, true, true],
  [true, true, true, true, true],
]

const getDistance = (position, goal, grid) => {
	let [posHeight, posWidth] = position;
	if (!grid[posHeight] || !grid[posHeight][posWidth]) return 100000000;
	let [goalHeight, goalWidth] = goal;

	let distance =
		Math.abs(posHeight - goalHeight) + Math.abs(posWidth - goalWidth);
	return distance;
};

const getSurrounds = ([height, width]) => {
	let down = [height + 1, width];
	let up = [height - 1, width];
	let left = [height, width, -1];
	let right = [height, width + 1];
	return { up, down, left, right };
};

const distancesAround = (position, goal, grid) => {
	let [height, width] = position;
	let { up, down, left, right } = getSurrounds(position);

	return [
		{ direction: "up", distance: getDistance(up, goal, grid) },
		{ direction: "down", distance: getDistance(down, goal, grid) },
		{ direction: "left", distance: getDistance(left, goal, grid) },
		{ direction: "right", distance: getDistance(right, goal, grid) }
	];
};

const getBestDistance = (position, goal, grid) => {
	let distances = distancesAround(position, goal, grid);
	distances = distances.sort((a, b) => a.distance - b.distance);
	return distances[0].direction;
};

let current = [0, 0];
let end = [3, 3];
let stack = [current];
let count = 0;

while (current[0] !== end[0] && current[1] !== end[1] && count < 1000) {
	count++;
	let direction = getBestDistance(current, end, fullGrid);
	let newLocation = getSurrounds(current)[direction];
	stack.push(current);
	current = newLocation;
}

/*
A place for comments so we don't have to all the slashes
from the current location
  a) see best one, otherwise
  b) backtrack to the last place on your stack.ullGrid));

*/
