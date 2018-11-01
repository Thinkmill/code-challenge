'use strict';

class BOT {
	constructor({ size, start, end }) {
		console.log(size, start, end);
		this.counter = 0;
		this.size = size;
		this.start = start;
		this.current = start;
		this.end = end;
	}

	updateCurrentPosition (actionTaken) {
		switch (actionTaken) {
			case 'up': {
				const limit = 0;
				const newValue = this.current[0] - 1;
				if (newValue > limit) {
					this.current[0] = newValue;
				}
				break;
			}
			case 'down': {
				const limit = this.size.height;
				const newValue = this.current[0] + 1;
				console.log(newValue, limit);
				if (newValue < limit) {
					this.current[0] = newValue;
				}
				break;
			}
			case 'left': {
				const limit = 0;
				const newValue = this.current[1] - 1;
				if (newValue > limit) {
					this.current[1] = newValue;
				}
				break;
			}
			case 'right': {
				const limit = this.size.width;
				const newValue = this.current[1] + 1;
				if (newValue < limit) {
					this.current[1] = newValue;
				}
				break;
			}
			default:
				break;
		};
		this.counter++;
	}

	getBestMove (MAP) {
		const [ y, x ] = this.current;
		const [ ey, ex ] = this.end;
		if (x < ex) {
			return 'right';
		}
		if (y < ey) {
			return 'down';
		}
	}

	Move({ MAP }) {
		const actionTaken = this.getBestMove(MAP);
		this.updateCurrentPosition(actionTaken);
		return actionTaken;
	}
}

module.exports = exports = BOT;
