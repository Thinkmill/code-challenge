'use strict';

const { unique, toArray } = require('./utils');
const {
	getActionFrom,
	getBlockersFor,
	getCanditate,
	getCardFor,
	getCount,
	getCounterFrom,
	getMostInfluential,
	getPassiveAction,
} = require('./helpers');

function aggregatePlayerData({
	discardedCards,
	history,
	myCards,
	otherPlayers,
}) {
	let knownCards = [...myCards, ...discardedCards];
	const init = () => ({ actions: [], counters: [] });

	let historicData = history.reduce((obj, event) => {
		let presumptionMade = false;

		// log actions for a given a player
		if (event.type === 'action' && event.from) {
			if (!obj[event.from]) obj[event.from] = init();
			obj[event.from].actions.push(event.action);

			// could assume foreign aid block, but not until their bot actually does it
			// if (event.action === 'taking-3') {
			// 	presumptionMade = true;
			// 	obj[event.from].counters.push('foreign-aid');
			// }
			if (event.action === 'swapping' || event.action === 'stealing') {
				presumptionMade = true;
				obj[event.from].counters.push('stealing');
			}
		}
		// log counter actions for a given a player
		if (event.type === 'counter-action' && event.counterer) {
			if (!obj[event.counterer]) obj[event.counterer] = init();
			obj[event.counterer].counters.push(event.action);
		}

		// remove erroneous actions/counters when player bluffing
		if (event.type === 'challenge-round' && event.challengee) {
			if (!obj[event.challengee]) obj[event.challengee] = init();
			if (event.lying) {
				obj[event.challengee].actions.pop();
				if (presumptionMade) obj[event.challengee].counters.pop();
			}
		}
		if (event.type === 'counter-round' && event.challengee) {
			if (!obj[event.challengee]) obj[event.challengee] = init();
			if (event.lying) obj[event.challengee].counters.pop();
		}

		// filter out actions/counters when a player loses a card
		if (event.type === 'lost-card' && event.player) {
			if (!obj[event.player]) obj[event.player] = init();
			obj[event.player].actions = obj[event.player].actions.filter(
				x => x !== getActionFrom(event.lost)
			);
			obj[event.player].counters = obj[event.player].counters.filter(
				x => x !== getCounterFrom(event.lost)
			);
		}

		return obj;
	}, {});

	// remove own and deceased bots | reintroduce coins & cards
	let cleanData = {};
	otherPlayers.forEach(player => {
		cleanData[player.name] = { ...historicData[player.name], ...player };
	});

	// wash away actions/counters that appear 3x in known cards
	return toArray(cleanData);
}

function makeAction(args) {
	const { history, myCards, myCoins, otherPlayers, turnCount } = args;
	const playerData = aggregatePlayerData(args);
	// console.log('playerData', playerData);
	const exchangeCards = { action: 'swapping', against: null };
	const canAssassinate = myCoins >= 3;
	const isHeadToHead = otherPlayers.length === 1;

	// you're gonna die -- attempt hail mary
	if (isHeadToHead && otherPlayers[0].coins >= 7) {
		// you can steal and they won't block
		if (
			myCards.includes(getCardFor('stealing')) &&
			getCanditate('stealing', playerData)
		) {
			return {
				action: 'stealing',
				against: otherPlayers[0].name,
			};
		}

		// you can afford to assassinate
		if (canAssassinate) {
			return {
				action: 'assassination',
				against: otherPlayers[0].name,
			};
		}
	}

	// sneaky tax: grab 3 early
	// NOTE: too dangerous with random challenge bots...
	// if (turnCount === 0) {
	// 	return { action: 'taking-3', against: null };
	// }

	// lay low early in the game when good hand
	// NOTE: doesn't seem to change the outcome
	// if (
	// 	turnCount <= 2 &&
	// 	(myCards.includes(getCardFor('taking-3')) ||
	// 		myCards.includes(getCardFor('stealing')))
	// ) {
	// 	return getPassiveAction(playerData);
	// }

	if (myCoins >= 7) {
		return {
			action: 'couping',
			against: getMostInfluential(otherPlayers).name,
		};
	}
	if (myCards.includes(getCardFor('assassination')) && canAssassinate) {
		let candidate = getCanditate('assassination', playerData);
		if (candidate) return { action: 'assassination', against: candidate.name };
	}
	if (myCards.includes(getCardFor('taking-3'))) {
		return {
			action: 'taking-3',
			against: null,
		};
	}
	if (myCards.includes(getCardFor('stealing'))) {
		let candidate = getCanditate('stealing', playerData);
		if (candidate) return { action: 'stealing', against: candidate.name };
	}
	if (myCards.includes(getCardFor('swapping'))) {
		return exchangeCards;
	}

	return getPassiveAction(playerData);
}

module.exports = exports = { aggregatePlayerData, makeAction };
