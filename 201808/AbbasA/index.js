'use strict';

const { ALLBOTS, CARDS, DECK, ACTIONS } = require('../constants.js');

class BOT {
	constructor() {}

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
		return false;
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
		return false;
	}

	OnSwappingCards({
		history,
		myCards,
		myCoins,
		otherPlayers,
		discardedCards,
		newCards,
	}) {
		return newCards;
	}

	OnCardLoss({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		return myCards[0];
	}
}

module.exports = exports = BOT;
