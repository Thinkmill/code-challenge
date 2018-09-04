'use strict';

const { CARDS } = require('./constants');
const { clone, toArray, unique } = require('./utils');

function cardPreference(shouldReverse) {
	const order = Object.keys(CARDS);
	return shouldReverse ? order.reverse() : order;
}
function loseCard(cards) {
	return cardPreference(true).filter((c) => cards.includes(c))[0];
}
function swapCards(cards) {
	const uniqueCards = cards.filter(unique);
	return cardPreference()
		.filter((c) => uniqueCards.includes(c))
		.slice(0, 2);
}
function getCount(card, cards) {
	return cards.filter((c) => c === card).length;
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
function getCounterAction(action) {
	const actions = {
		swapping: 'stealing',
		stealing: 'stealing',
		'taking-3': 'foreign-aid',
	};

	return actions[action];
}
function getBlockersFor(action) {
	const actions = {
		assassination: ['contessa'],
		stealing: ['captain', 'ambassador'],
		'foreign-aid': ['duke'],
	};

	return actions[action] || [];
}
function getActionFrom(card) {
	return card && CARDS[card].action;
}
function getCounterFrom(card) {
	return card && CARDS[card].counter;
}
function getMostInfluential(players) {
	const byCoin = (a, b) => b.coins - a.coins;
	const withTwo = players.filter((p) => p.cards === 2);
	const withOne = players.filter((p) => p.cards === 1);
	const arr = withTwo.length ? withTwo.sort(byCoin) : withOne.sort(byCoin);

	return arr[0] || players[0];
}
function getPassiveAction(playerData) {
	const aidWillBeCountered = Boolean(
		playerData.filter((p) => {
			return p.counters && p.counters.includes('foreign-aid');
		}).length
	);
	// console.log('aidWillBeCountered', aidWillBeCountered);
	const action = aidWillBeCountered ? 'taking-1' : 'foreign-aid';
	return { action, against: null };
}
function getCanditate(action, playerData) {
	return playerData.filter((p) => {
		// console.log('getCanditate for', action, p.name, p.counters);
		if (!p.counters || !p.counters.length) return true;
		return !p.counters.includes(action);
	})[0];
}

module.exports = exports = {
	cardPreference,
	getActionFrom,
	getBlockersFor,
	getCanditate,
	getCardFor,
	getCount,
	getCounterAction,
	getCounterFrom,
	getMostInfluential,
	getPassiveAction,
	loseCard,
	swapCards,
};
