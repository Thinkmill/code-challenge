'use strict';

let { CARDS } = require('../constants.js');

const ME = 'TimL';

const count = (card, cards) => cards.filter(c => c === card).length;

const cardFor = (action) =>
	({
		'taking-3': 'duke',
		assassination: 'assassin',
		stealing: 'captain',
		swapping: 'ambassador',
	}[action]);

const blockersFor = (action) =>
	({
		assassination: ['contessa'],
		stealing: ['captain', 'ambassador'],
		'foreign-aid': ['duke'],
	}[action] || []);

const reformatHistory = (history) => {
	const newHistory = [];
	let currentTurn = [];
	history.forEach(record => {
		if (record.type === 'action' && currentTurn.length > 0) {
			newHistory.push(currentTurn);
			currentTurn = [];
		}
		currentTurn.push(record);
	});
	return newHistory;
};

const historyAfterLossOrSwap = (history, player, card) => {
	history = reformatHistory(history);
	const i = history.indexOf(
		[...history].reverse().find(
			turn => ((turn.find(record => record.type === 'lost-card' && record.player === player && record.lost === card)) ||
					 (turn.find(record => record.action === 'swap-1' && record.from === player && record.card === card)) ||
					 (turn.find(record => record.action === 'swapping' && record.from === player)))
		)
	) + 1
	return i ? history = history.slice(i) : history;
}

const doesPlayerHave = (history, player, card, otherPlayers) =>
	player.constructor === Array ? player.some(p => doesPlayerHave(history, p.name, card, otherPlayers)) :
		historyAfterLossOrSwap(history, player, card).some(
			turn => (turn[0].from === player && cardFor(turn[0].action) === card) ||
					(turn.find(record => record.type === 'counter-action' && record.counterer === player && record.counter === card)));

const safeish = (history, visibleCards, action, against, otherPlayers) =>
	blockersFor(action).every(c => count(c, visibleCards) === 3) ||
	!blockersFor(action).some(c => doesPlayerHave(history, against, c, otherPlayers));

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

const findTargets = (players) =>
	players
		.map((p) => [p.coins * p.cards, p])
		.sort((a, b) => b[0] - a[0])
		.map((x) => x[1]);

class BOT {
	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		const target = findTargets(otherPlayers)[0];
		const visibleCards = [...myCards, ...discardedCards];

		let action;
		if (
			myCards.includes(cardFor('assassination')) &&
			myCoins >= 3 &&
			safeish(history, visibleCards, 'assassination', target.name, otherPlayers)
		) {
			action = 'assassination';
		} else if (myCoins >= 7) {
			action = 'couping';
		} else if (myCards.includes(cardFor('taking-3'))) {
			action = 'taking-3';
		} else if (myCards.includes(cardFor('swapping'))) {
			action = 'swapping';
		} else if (
			myCards.includes(cardFor('stealing')) &&
			safeish(history, visibleCards, 'stealing', target.name, otherPlayers) &&
			target.coins >= 2
		) {
			action = 'stealing';
		} else if (safeish(history, visibleCards, 'foreign-aid', otherPlayers)) {
			action = 'foreign-aid';
		} else {
			action = 'taking-1';
		}

		return {
			action,
			against: target.name,
		};
	}

	OnChallengeActionRound({ myCards, discardedCards, action }) {
		// If they're obviously bullshitting, call them
		return (count(cardFor(action), [...myCards, ...discardedCards]) === 3);
	}

	OnCounterAction({ myCards, action }) {
		// If we can counter this, then do counter this.
		const match = blockersFor(action).find(c => myCards.includes(c));
		if (match) {
			return match;
		}

		// If we're gonna be dead, fight it!
		if (action === 'assassination' && myCards.length === 1) {
			return 'contessa';
		}
		return false;
	}

	OnCounterActionRound({history, myCards, otherPlayers, discardedCards, card, counterer}) {
		// If they're obviously bullshitting, call them
		if (count(card, [...myCards, ...discardedCards]) === 3) return true;

		// If it looks like they have it, let it slide.
		if (doesPlayerHave(history, counterer, card, otherPlayers)) return false;

		// If it looks like they're holding other cards, call them.
		const cardsHeld = CARDS()
			.filter(c => doesPlayerHave(history, counterer, c, otherPlayers) && count(c, [...myCards, ...discardedCards]) < 3).length
		const other = otherPlayers.find(p => p.name === counterer);
		return other && cardsHeld >= other.cards;
	}

	OnSwappingCards({ myCards, newCards }) {
		// Pick the best two non-identical cards
		const sorted = sortCards([...myCards, ...newCards]);
		const first = sorted[0];
		return myCards.length === 1 ? [first] : [first, sorted.find(c => c !== first) || first];
	}

	OnCardLoss({ myCards }) {
		return sortCards([...myCards]).slice(-1)[0];
	}
}

module.exports = exports = BOT;
