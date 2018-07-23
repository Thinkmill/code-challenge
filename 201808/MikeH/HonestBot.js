'use strict';

const {
	ALLBOTS,
	CARDS,
	DECK,
	// ACTIONS,
} = require('../constants.js');

const ACTIONS = require

class BOT {
	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		// Determine possible actions (without lying)
		const possibleActions = ACTIONS.filter((action) => {
			// Do I have enough coins?
			if (action.cost > myCoins) return false;
			// Do I have the required cards
			const myMatch = action.requires.find(r => myCards.includes(r));
			if (action.requires.length && !myMatch) return false;
		}, []);

		// Determine best action to take. (naieve - just based on income)
		const priorityActions = possibleActions.sort((a, b) => b.income - a.income);

		// Just random for now.
		const against = otherPlayers[ Math.floor( Math.random() * otherPlayers.length ) ].name;

		let action;
		if( myCoins > 10 ) {
			action = 'couping';
		} else {
			action = priorityActions[0];
		}

		return {
			action,
			against,
		};
	}

	OnChallengeActionRound({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom }) {
		return [ true, false ][ Math.floor( Math.random() * 2 ) ];
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
