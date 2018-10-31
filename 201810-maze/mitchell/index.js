"use strict";

let inverse = {
	up: "down",
	down: "up",
	right: "left",
	left: "right"
};

class Reverse {}

class BOT {
	constructor({ size, start, end }) {
		this.history = [];
		this.xDirection = start[0] < end[0] ? "right" : "left";
		this.yDirection = start[1] < end[1] ? "down" : "up";
		this.shouldReverse = 0;
	}

	Move({ MAP }) {
		try {
			let ret = this._move(MAP);
			this.history.push(ret);
			return ret;
		} catch (e) {
			if (e instanceof Reverse) {
				return inverse[this.history.pop()];
			}
			throw e;
		}
	}

	_move(map) {
		if (this.shouldReverse) {
			this.shouldReverse--;
			this.previousWasReverse = true;
			throw new Reverse();
		}
		let index = 2;

		let y = {
			up: map[index - 1][index],
			down: map[index + 1][index]
		};
		let x = {
			right: map[index][index + 1],
			left: map[index][index - 1]
		};

		if (Math.random() > 0.5 && y[this.yDirection]) {
			return this.yDirection;
		} else if (x[this.xDirection]) {
			return this.xDirection;
		} else {
			if (this.previousWasReverse) {
				this.shouldReverse += 2;
			}
			this.shouldReverse++;
			throw new Reverse();
		}
	}
}

module.exports = exports = BOT;
