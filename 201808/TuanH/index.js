'use strict';

const {
	ALLBOTS,
	CARDS,
	DECK,
	ACTIONS,
} = require('../constants.js');

const CARD_SCORE = {
	'duke': 0,
	'captain': 1,
	'contessa': 2,
	'ambassador': 3,
	'assassin': 4,
}

const count = (card, cards) => cards.filter(c => c === card).length;

const cardFor = action => ({
	'taking-3': 'duke',
	'assassination': 'assassin',
	'stealing': 'captain',
	'swapping': 'ambassador',
	}[action]);

const blockersFor = action => ({
	'assassination': ['contessa'],
	'stealing': ['captain', 'ambassador'],
	'foreign-aid': ['duke']
	}[action] || []);

const findHealthyPlayers = players => players.map(player => [player.coins * player.cards, player]).sort((a, b) => (b[0] - a[0])).map(item => item[1]);

class BOT {
	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		const knownCards = myCards.concat(discardedCards);
		const againstPlayer = findHealthyPlayers(otherPlayers)[0];

		let action;
		if (myCoins >= 6) {
			action = 'couping';
		}
		if (myCoins >= 3) {
			action = 'assassination';
		}
		if (myCards.includes(cardFor('assassination')) && myCoins >= 3) {
			action = 'assassination';
		} else if( myCoins > 6 ) {
			action = 'couping';
		} else if (myCards.includes(cardFor('taking-3'))) {
			action = 'taking-3';
		} else if (myCards.includes(cardFor('swapping'))) {
			action = 'swapping';
		} else if (myCards.includes(cardFor('stealing')) && againstPlayer.coins >= 2) {
			action = 'stealing';
		} else if (blockersFor('foreign-aid').every(c => count(c, knownCards) === 3)) {
			action = 'foreign-aid';
		} else {
			action = 'taking-1';
		}

		return {
			action,
			against: againstPlayer.name
		};
	}

	OnChallengeActionRound({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom }) {
		const knownCards = myCards.concat(discardedCards);
		const shouldCallOut = knownCards.filter(card => card === cardFor(action)).length === 3;
		return shouldCallOut;
	}

	OnCounterAction({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom }) {
		const haveBlockers = blockersFor(action).find(card => myCards.includes(card));
		if (haveBlockers) {
			return haveBlockers;
		}
	}

	OnCounterActionRound({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom, card }) {
		const knownCards = myCards.concat(discardedCards);
		const shouldCallOut = knownCards.filter(c => c === card).length === 3;
		return shouldCallOut;

		if (action === 'assassination' && myCards.length === 1) {
			return 'contessa';
		}

		return false;
	}

	OnSwappingCards({ history, myCards, myCoins, otherPlayers, discardedCards, newCards }) {
		return newCards;
	};

	OnCardLoss({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		if (myCards.length == 1) {
			return myCards[0];
		}

		if (CARD_SCORE[myCards[0]] > CARD_SCORE[myCards[1]]) {
			return myCards[1];
		} else {
			return myCards[0];
		}
	};
}

module.exports = exports = BOT;
