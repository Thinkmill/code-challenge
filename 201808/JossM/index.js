'use strict';

const { ALLBOTS, CARDS, DECK, ACTIONS } = require('../constants.js');

const CARD_PREFERENCE = [
	'duke',
	'captain',
	'ambassador',
	'contessa',
	'assassin',
];

// ==============================
// Utils
// ==============================

function unique(value, index, self) {
	return self.indexOf(value) === index;
}
function clone(arr) {
	return arr.slice(0);
}

// ==============================
// Helpers
// ==============================

function count(card, cards) {
	return cards.filter(c => c === card).length;
}
function loseCard(cards) {
	const preference = clone(CARD_PREFERENCE).reverse();
	return preference.filter(c => cards.includes(c))[0];
}
function swapCard(current, possible) {
	const combined = [...current, ...possible];
	const uniqueCards = combined.filter(unique);
	const preference = clone(CARD_PREFERENCE);
	return preference.filter(c => uniqueCards.includes(c)).slice(0, 2);
}
function getCardFor(action) {
	const actions = {
		'taking-3': 'duke',
		assassination: 'assassin',
		stealing: 'captain',
		swapping: 'ambassador',
	};

	return actions[action];
}
function getBlockersFor(action) {
	const actions = {
		assassination: ['contessa'],
		stealing: ['captain', 'ambassador'],
		'foreign-aid': ['duke'],
	};

	return actions[action];
}
function getTarget(players) {
	const byCoin = (a, b) => b.coins - a.coins;
	const withTwo = players.filter(p => p.cards === 2);
	const withOne = players.filter(p => p.cards === 1);
	const arr = withTwo.length ? withTwo.sort(byCoin) : withOne.sort(byCoin);

	return arr[0];
}

// ==============================
// Game
// ==============================

class BOT {
	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		// attempt foreign-aid sometimes
		let action = Math.random() > 0.5 ? 'taking-1' : 'foreign-aid';
		let against = getTarget(otherPlayers).name;

		// ==============================
		// random actions
		// ==============================

		if (myCoins >= 7) {
			action = 'couping';
		} else if (myCards.includes(getCardFor('assassination')) && myCoins >= 3) {
			action = 'assassination';
		} else if (myCards.includes(getCardFor('swapping'))) {
			action = 'swapping';
		} else if (myCards.includes(getCardFor('stealing'))) {
			action = 'stealing';
		} else if (myCards.includes(getCardFor('taking-3'))) {
			action = 'taking-3';
		}

		return { action, against };
	}

	OnChallengeActionRound({ action, discardedCards, myCards }) {
		return count(getCardFor(action), [...myCards, ...discardedCards]) === 3;
	}

	OnCounterAction({ action, myCards }) {
		const hasBlock = getBlockersFor(action).find(c => myCards.includes(c));
		return hasBlock || false;
	}

	OnCounterActionRound({ card, discardedCards, myCards }) {
		return count(card, [...myCards, ...discardedCards]) === 3;
	}

	OnSwappingCards({ myCards, newCards }) {
		return swapCard(myCards, newCards);
	}

	OnCardLoss({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		if (myCards.length === 1) return myCards[0];
		return loseCard(myCards);
	}
}

module.exports = exports = BOT;
