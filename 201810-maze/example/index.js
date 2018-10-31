'use strict';

class BOT {
	constructor({ size, start, end }) {}

	Move({ MAP }) {
		const actions = ['up', 'right', 'down', 'left'];
		return actions[ Math.floor( Math.random() * actions.length ) ];
	}
}

module.exports = exports = BOT;
