'use strict';

const { ALLBOTS, CARDS, DECK, ACTIONS } = require('../constants.js');
class BOT {
	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		let action = 'taking-1';

		if (myCards.includes('duke')) {
			action = 'taking-3';
		} else {
			action = 'foreign-aid';
		}

		if (myCoins >= 3 && myCards.includes('assassin')) {
			action = 'assassinate';
		}

		const against = otherPlayers.includes('TimL') ? 'TimL' : otherPlayers[Math.floor(Math.random() * otherPlayers.length)]

		if (myCoins >= 7) {
			action = 'couping';
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
		switch(action) {
			case 'assassination':
				return [false, 'contessa'][Math.floor(Math.random() * 2)];
			case 'stealing':
				return [false, 'captain', 'ambassador'][Math.floor(Math.random() * 2)];
			case 'foreign-aid':
				return [false, 'duke'][Math.floor(Math.random() * 2)];
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
		return [true, false][Math.floor(Math.random() * 2)];
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
		if (!myCards.length) {
			console.warn('Of course you\'d kill me off, racists');
		} else {
			const probableCause = history[history.length - 2];
			const perpetrator = this.findPerpetrator(probableCause)
			console.warn(`I trusted you ${perpetrator}, and I thought we were friends...`)
		}
		return myCards[0];
	}

	findPerpetrator(probableCause) {
		if (probableCause.type === 'challenge-round') {
			if (probableCause.lying) {
				return probableCause.challenger;
			}
			return probableCause.challengee;
		} else if (probableCause.type === 'counter-round') {
			if (probableCause.lying) {
				return probableCause.challengee;
			}
			return probableCause.challenger;
		} else {
			return probableCause.from;
		}
	}
}

module.exports = exports = BOT;
