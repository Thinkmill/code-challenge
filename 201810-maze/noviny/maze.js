const NUMBER = 100000000;

const getDistance = (position, goal, grid) => {
	let [posHeight, posWidth] = position;
	if (!grid[posHeight] || !grid[posHeight][posWidth]) return NUMBER;
	let [goalHeight, goalWidth] = goal;

	let distance =
		Math.abs(posHeight - goalHeight) + Math.abs(posWidth - goalWidth);
	return distance;
};

const getSurrounds = ([height, width]) => {
	let down = [height + 1, width];
	let up = [height - 1, width];
	let left = [height, width - 1];
	let right = [height, width + 1];
	return { up, down, left, right };
};

const distancesAround = (position, goal, grid) => {
	let { up, down, left, right } = getSurrounds(position);
	return [
		{ direction: "up", distance: getDistance(up, goal, grid), position: up },
		{
			direction: "down",
			distance: getDistance(down, goal, grid),
			position: down
		},
		{
			direction: "left",
			distance: getDistance(left, goal, grid),
			position: left
		},
		{
			direction: "right",
			distance: getDistance(right, goal, grid),
			position: right
		}
	];
};

const getBestDistance = (position, goal, grid) => {
	let distances = distancesAround(position, goal, grid);
	return distances
		.filter(a => a.distance < 100000000)
		.sort((a, b) => a.distance - b.distance)[0];
};

const updateMap = (topLeft, map, newInfo) => {
	let [colOffset, rowOffset] = topLeft;

	newInfo.forEach((row, colIndex) => {
		let modifiedColIndex = colIndex + colOffset;
		row.forEach((square, rowIndex) => {
			let modifiedRowIndex = rowIndex + rowOffset;
			if (
				map[modifiedColIndex] &&
				map[modifiedColIndex][modifiedRowIndex] === null
			) {
				map[modifiedColIndex][modifiedRowIndex] = square;
			}
		});
	});
	return map;
};

class BOT {
	constructor({ size, start, end }) {
		this.size = size;
		this.stack = [start];
		this.currentPosition = start;
		this.fakeGrid = [...Array(size.height)].map(() =>
			[...Array(size.width)].map(() => null)
		);
		this.end = end;
	}

	Move({ MAP }) {
		let [column, row] = this.currentPosition;
		this.fakeGrid = updateMap([column - 2, row - 2], this.fakeGrid, MAP);
		let newPosition = getBestDistance(
			this.currentPosition,
			this.end,
			this.fakeGrid
		);

		if (!newPosition) {
			// backtrack function
			let prior = this.stack.pop();
			let [backCol, backRow] = prior;
			this.currentPosition = [backCol, backRow];
			if (column < backCol) return "down";
			if (column > backCol) return "up";
			if (row < backRow) return "right";
			if (row > backRow) return "left";
		}

		this.fakeGrid[newPosition.position[0]][newPosition.position[1]] = false;

		this.currentPosition = newPosition.position;

		this.stack.push([column, row]);
		return newPosition.direction;
	}
}

module.exports = exports = BOT;
