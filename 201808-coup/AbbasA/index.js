'use strict';

const count = (card, cards) => cards.filter((c) => c === card).length;

const sortCards = (cards) => {
	const order = {
		duke: 0,
		captain: 1,
		contessa: 2,
		ambassador: 3,
		assassin: 4,
	};
	const inverseOrder = Object.entries(order).reduce(
		(o, [k, v]) => ({ ...o, [v]: k }),
		{}
	);
	return cards
		.map((c) => order[c])
		.sort()
		.map((x) => inverseOrder[x]);
};

const { ALLBOTS, CARDS, DECK, ACTIONS } = require('../constants.js');

class BOT {
	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		let action;
		const against =
			otherPlayers[Math.floor(Math.random() * otherPlayers.length)].name;

		if (myCoins >= 7) {
			action = 'couping';
		} else if (myCards.includes('duke')) {
			action = 'taking-3';
		} else if (myCards.includes('assassin') && myCoins >= 3) {
			action = 'assassination';
		} else if (myCards.includes('captain')) {
			action = 'stealing';
		} else if (myCards.includes('ambassador')) {
			action = 'swapping';
		} else {
			action = 'taking-1';
		}

		return {
			action,
			against,
		};
	}

	OnChallengeActionRound({}) {
		return false;
	}

	OnCounterAction({ myCards, action }) {
		if (myCards.includes('captain') && action === 'stealing') {
			return 'captain';
		} else if (myCards.includes('ambassador') && action === 'stealing') {
			return 'ambassador';
		} else if (myCards.includes('contessa') && action === 'assassination') {
			return 'contessa';
		} else if (myCards.includes('duke') && action === 'foreign-aid') {
			return 'duke';
		} else if (myCards.length === 1 && action === 'assassination') {
			return 'contessa';
		} else {
			return false;
		}
	}

	OnCounterActionRound({}) {
		return false;
	}

	OnSwappingCards({ myCards, newCards }) {
		const sorted = sortCards([...myCards, ...newCards]);
		const first = sorted[0];
		return myCards.length === 1
			? [first]
			: [first, sorted.find((c) => c !== first) || first];
	}

	OnCardLoss({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		return sortCards([...myCards]).slice(-1)[0];
	}
}

module.exports = exports = BOT;
