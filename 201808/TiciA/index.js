'use strict';

const { ALLBOTS, CARDS, DECK, ACTIONS } = require('../constants.js');

const target = (players) =>
	players
		.map((p) => [p.coins * p.cards, p])
		.sort((a, b) => b[0] - a[0])
		.map((x) => x[1]);

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
class BOT {
	constructor() {
		// this.ROUND = 0;
	}

	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		let action = ['taking-1', 'foreign-aid'][Math.floor(Math.random() * 2)];
		let against =
			otherPlayers[Math.floor(Math.random() * otherPlayers.length)].name;
		let enemy = target(otherPlayers);

		// this.ROUND++;

		if (myCoins > 6) {
			action = 'couping';
		} else if (myCards.includes('duke')) {
			action = 'taking-3';
		} else if (myCards.includes('assassin') && myCoins >= 3) {
			action = 'assassination';
			against = enemy[0].name;
		} else if (myCards.includes('captain')) {
			action = 'stealing';
			against = enemy[0].name;
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

	OnChallengeActionRound({
		history,
		myCards,
		myCoins,
		otherPlayers,
		discardedCards,
		action,
		byWhom,
		toWhom,
	}) {
		if (this.ROUND <= 2) {
			if (action === 'taking-3') {
				return false;
			}
		}
		return [true, false][Math.floor(Math.random() * 2)];
	}

	OnCounterAction({
		history,
		myCards,
		myCoins,
		otherPlayers,
		discardedCards,
		action,
		byWhom,
	}) {
		if (myCards.includes('ambassador') && action === 'stealing') {
			return 'ambassador';
		} else if (myCards.includes('captain') && action === 'stealing') {
			return 'captain';
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

	OnCounterActionRound({
		history,
		myCards,
		myCoins,
		otherPlayers,
		discardedCards,
		action,
		byWhom,
		toWhom,
		card,
	}) {
		return [true, false, false][Math.floor(Math.random() * 3)];
	}

	OnSwappingCards({
		history,
		myCards,
		myCoins,
		otherPlayers,
		discardedCards,
		newCards,
	}) {
		// Pick the best two non-identical cards
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
