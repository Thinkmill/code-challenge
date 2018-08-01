'use strict';

const AVERAGE_TURNS = 14;
const ME = 'JossM';
const CARDS = {
	duke: { action: 'taking-3', counter: 'foreign-aid' },
	captain: { action: 'stealing', counter: 'stealing' },
	assassin: { action: 'assassination', counter: null },
	ambassador: { action: 'swapping', counter: 'stealing' },
	contessa: { action: null, counter: 'assassination' },
};

module.exports = exports = { AVERAGE_TURNS, CARDS, ME };
