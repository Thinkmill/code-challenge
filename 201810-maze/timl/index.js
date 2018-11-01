'use strict';

class BOT {
	Move({ MAP }) {
		return MAP[2][3] ? 'right' : 'down';
	}
}

module.exports = exports = BOT;
