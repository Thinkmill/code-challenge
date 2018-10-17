'use strict';

class BOT {
	constructor({ size, start, finish }) {}

	Move({ MAP }) {
		const actions = ['right', 'down'];
		return actions[ Math.floor( Math.random() * actions.length ) ];
	}
}

module.exports = exports = BOT;
