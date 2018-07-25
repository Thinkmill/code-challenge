'use strict';

const {
	ALLBOTS,
	CARDS,
	DECK,
	ACTIONS,
} = require('../constants.js');

// Utils
const randomPick = (items) => {
	return items[Math.floor(Math.random() * items.length)];
}

const foundInArray = (item, key, array) => {
	let found = false;
	for (var i = 0; i < array.length; i++) {
		if( array[key][i] === i ) {
			found = true;
			break;
		}
	};
	return found;
}

const hasCard = (card, cards) => cards.indexOf(card) > -1 ? true: false;

// constants
const EARLY_GAME_ACTIONS = ['taking-1', 'foreign-aid', 'taking-3'];

class BOT {
	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		let action;
		let against;

		let safeAction = randomPick(['taking-1', 'foreign-aid']);
		action = safeAction;

		const weakPlayers = otherPlayers.filter(player => {
			return player.cards === 1;
		});

		const wealthyPlayers = otherPlayers.filter(player => {
			return player.coins > 2;
		})

		const randomPlayer = randomPick(otherPlayers);

		if (history.length < 3) {
			action = randomPick(EARLY_GAME_ACTIONS);
		}
		else {
			if (myCoins > 10) {
				action = 'couping';
				against = weakPlayers.length > 0 ? randomPick(weakPlayers) : randomPlayer;
			}
			else if (myCoins > 3 && myCoins < 10) {
				if (myCards.length > 0) {
					if (hasCard('assassin', myCards)) {
						action = 'assassination';
						against = weakPlayers.length > 0 ? randomPick(weakPlayers) : randomPlayer;
					}
					else if (hasCard('captain', myCards)) {
						action = 'stealing';
						against = wealthyPlayers.length > 0 ? randomPick(wealthyPlayers) : randomPlayer;
					}
					else {
						action = 'foreign-aid';
					}
				}
			}
			else {
				if (myCards.length > 0) {
					if (hasCard('duke', myCards)) {
						action = 'taking-3';
					}
					else if (hasCard('ambassador', myCards)) {
						action = 'swapping';
					}
					else if (hasCard('captain', myCards)) {
						action = 'stealing';
						against = wealthyPlayers.length > 0 ? randomPick(wealthyPlayers) : randomPlayer;
					}
					else {
						action = safeAction;
					}
				}
			}
		}
		return {
			action,
			against: against.name,
		};
	}

	OnChallengeActionRound({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom }) {
		return false;
	}

	OnCounterAction({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom }) {
		if( action === 'assassination' ) {
			return [ false, 'contessa' ][ Math.floor( Math.random() * 2 ) ];
		}
		else if( action === 'stealing' ) {
			return [ false, 'ambassador', 'captain' ][ Math.floor( Math.random() * 3 ) ];
		}
	}

	OnCounterActionRound({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom, card }) {
		return [ true, false ][ Math.floor( Math.random() * 2 ) ];
	}

	OnSwappingCards({ history, myCards, myCoins, otherPlayers, discardedCards, newCards }) {
		return newCards;
	};

	OnCardLoss({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		return myCards[ 0 ];
	};
}


module.exports = exports = BOT;
