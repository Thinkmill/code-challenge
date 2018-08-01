'use strict';

const { ALLBOTS, CARDS, DECK, ACTIONS } = require('../constants.js');

class BOT {
	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		let action = ['taking-1', 'foreign-aid', 'taking-3'][
			Math.floor(Math.random() * 3)
		];
		const against =
			otherPlayers[Math.floor(Math.random() * otherPlayers.length)].name;

		if (myCoins >= 7) {
			action = 'couping';
			return { action, against };
		}

		if (myCoins >= 3 && myCards.includes('assassin')) {
			action = 'assassination';
			return { action, against };
		}

		if (myCards.includes('duke')) {
			action = 'taking-3';
			return { action, against };
		}

		if (myCards.includes('captain')) {
			action = 'stealing';
			return { action, against };
		}

		if (myCoins === 0 && myCards.includes('ambassador')) {
			action = 'swapping';
			return { action, against };
		}

		if (myCoins === 0) {
			action = 'foreign-aid';
			return { action, against };
		}

		return { action, against };
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
		// return [ true, false ][ Math.floor( Math.random() * 2 ) ];
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
		if (action === 'assassination' && myCards.includes('contessa')) {
			return 'contessa';
		}
		if (action === 'stealing' && myCards.includes('ambassador')) {
			return 'ambassador';
		}
		if (action === 'stealing' && myCards.includes('captain')) {
			return 'captain';
		}
		return false;
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
		// return [ true, false ][ Math.floor( Math.random() * 2 ) ];
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
