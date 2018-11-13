const myPosition = map => map[2][2];
const justLeft = map => (map[2][1] ? "left" : false);
const justRight = map => (map[2][3] ? "right" : false);
const justUp = map => (map[1][2] ? "up" : false);
const justDown = map => (map[3][2] ? "down" : false);

class BOT {
	constructor({ size, start, end }) {
		this.size = size;
		this.start = start;
		this.end = end;
		this.rowsToTravel = start[0] - end[0];
		this.columnsToTravel = start[1] - end[1];
	}

	Move({ MAP }) {
		// let preferColumn =
		// 	Math.abs(this.rowsToTravel) > Math.abs(this.columnsToTravel);
		// if (preferColumn) {
		// 	if (this.columnsToTravel < 0) {
		// 		if (justLeft(MAP)) {
		// 			this.columnsToTravel++;
		// 			return "left";
		// 		} else {
		// 			// try move closer in rows instead
		// 		}
		// 	} else {
		// 		if (justRight(MAP)) {
		// 			this.columnsToTravel--;
		// 			return "right";
		// 		} else {
		// 			// try to move closer in rows instead
		// 		}
		// 	}
		// } else {
		// 	if (this.rowsToTravel < 0) {
		// 		if (justUp(MAP)) {
		// 			this.rowsToTravel++;
		// 			return "up";
		// 		}
		// 	} else {
		// 		if (justDown(MAP)) {
		// 			this.rowsToTravel--;
		// 			return "down";
		// 		}
		// 	}
		// }

		if (!justLeft(MAP) && justDown(MAP)) return "down";
		if (!justDown(MAP) && justRight(MAP)) return "right";
		if (!justRight(MAP) && justUp(MAP)) return "up";
		if (!justUp(MAP)) return "left";

		if (justRight(MAP)) return "right";
		else return "down";
	}
}

module.exports = exports = BOT;
