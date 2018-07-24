/*

| Action      | Income | Cost | Requires  | Blockable  |
| ----------- | ------ | ---- | --------- | ---------- |
| Income      |      1 |    0 | -         | -          |
| Foreign Aid |      2 |    0 | -         | Duke       |
| Tax         |      3 |    0 | Duke      | -          |
| Coup        |      0 |    7 | -         | -          |
| Assassinate |      0 |    3 | Assassin  | Contessa   |
| Exchange    |      0 |    0 | Ambassador| -          |
| Steal       |      0 |    2 | Captain   | Cap/Amb    |
*/

const ACTIONS = [
	{ key: 'taking-1',       income: 1, cost: 0, requiredCard: false        , blockableBy: []                        },
	{ key: 'foreign-aid',    income: 2, cost: 0, requiredCard: false        , blockableBy: ['duke']                  },
	{ key: 'couping',        income: 0, cost: 7, requiredCard: false        , blockableBy: []                        },
	{ key: 'taking-3',       income: 3, cost: 0, requiredCard: 'duke'       , blockableBy: []                        },
	{ key: 'assassination',  income: 0, cost: 3, requiredCard: 'assassin'   , blockableBy: ['contessa']              },
	{ key: 'swapping',       income: 0, cost: 0, requiredCard: 'ambassador' , blockableBy: []                        },
	{ key: 'stealing',       income: 0, cost: 2, requiredCard: 'captain'    , blockableBy: ['captain', 'ambassador'] },
];


const BLOCK_ACTIONS = {
	'foreign-aid': ['duke'],
	'assassination': ['contessa'],
	'stealing': ['captain', 'ambassador'],
}

const { CARDS } = require('../constants');

function fullDeck () {
	return CARDS.reduce((a, c) => {
		a[c] = 3;
		return a;
	}, {});
}

// How many of card x are in play
function cardsInPlay (discardedCards, myCards) {
	const knownCards = Array.concat(discardedCards, myCards);
	return knownCards.reduce((a, c) => {
		a[c]--;
		return a;
	}, fullDeck());
}

// const fullDeck = cards.reduce()

module.exports = {
	ACTIONS,
	BLOCK_ACTIONS,
	fullDeck,
	cardsInPlay,
};
