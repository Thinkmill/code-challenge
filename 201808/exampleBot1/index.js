'use strict';

const {
	ALLBOTS,
	CARDS,
	DECK,
	ACTIONS,
} = require('../constants.js');


class BOT {
	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		let action = ACTIONS[ Math.floor( Math.random() * ACTIONS.length ) ];
		const against = otherPlayers[ Math.floor( Math.random() * otherPlayers.length ) ].name;

		if( myCoins > 10 ) {
			action = 'couping';
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
