'use strict';

const {
	ALLPLAYER,
	CARDS,
	DECK,
	ACTIONS,
} = require('../constants.js');


const OnTurn = ({ history, myCards, myCoins, otherPlayers, discardedCards }) => {
	let action = ACTIONS[ Math.floor( Math.random() * ACTIONS.length ) ];
	const against = otherPlayers[ Math.floor( Math.random() * otherPlayers.length ) ].name;

	if( myCoins > 10 ) {
		action = 'couping';
	}

	return {
		action,
		against,
	};
};

const OnChallengeActionRound = ({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom }) => {
	return [ true, false ][ Math.floor( Math.random() * 2 ) ];
};

const OnCounterAction = ({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom }) => {
	if( action === 'assassination' ) {
		return [ false, 'contessa' ][ Math.floor( Math.random() * 2 ) ];
	}
	else if( action === 'stealing' ) {
		return [ false, 'ambassador', 'captain' ][ Math.floor( Math.random() * 3 ) ];
	}
};

const OnCounterActionRound = ({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom }) => {
	return [ true, false ][ Math.floor( Math.random() * 2 ) ];
};

const OnSwappingCards = ({ history, myCards, myCoins, otherPlayers, discardedCards, newCards }) => {
	return newCards;
};

const OnCardLoss = ({ history, myCards, myCoins, otherPlayers, discardedCards }) => {
	return myCards[ 0 ];
};


module.exports = exports = {
	OnTurn,
	OnChallengeActionRound,
	OnCounterAction,
	OnCounterActionRound,
	OnSwappingCards,
	OnCardLoss,
};
