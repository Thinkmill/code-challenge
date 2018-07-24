'use strict';

const {
	ALLBOTS,
	CARDS,
	// DECK,
	// ACTIONS,
} = require('../constants.js');

const MY_NAME = 'MikeH';
const {
	ACTIONS,
	BLOCK_ACTIONS,
	cardsInPlay,
} = require('./constants');

function determineOtherPlayersCards (history, otherPlayers) {
	const allPlayes = otherPlayers.concat(MY_NAME)
	const likelyCardDistribution = history.reduce((acc, item) => {
		switch (item.type) {
			case 'action':
				const playerName = item.from;
				const action = ACTIONS.find(a => a.key === item.action);
				const card = action.requiredCard;
				if (card) {
					// The action taken implies the card they have.
					// do we trust them?
					acc[playerName][card] += 0.2;
				}
				break;
			case 'lost-card':
				const { player, lost } = item;
				// This is 100% - except that it's not.. they could have had 2.
				acc[player][lost] = 0;
				acc[player].cardCount -= 1;
		}
		return acc;
	}, otherPlayers.reduce((p, name) => {
		// For each player in the game
		p[n] = CARDS.reduce((c, card) => {
			// There is a 50% chance that any player has a given card
			c[card] = 0.5;
		});
		return acc;
	}, {}));
};


class BOT {

	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		// Determine possible actions (without lying)
		const possibleActions = ACTIONS.filter((action) => {
			// Do I have enough coins?
			if (action.cost > myCoins) return false;

			// Do I have the required cards
			if (action.requiredCard) {
				return myCards.includes(action.requiredCard);
			}
			return true;
		}, []);

		// Determine best action to take. (naieve - just based on income)
		const priorityActions = possibleActions.sort((a, b) => b.income - a.income);

		// Just random for now.
		const against = otherPlayers[ Math.floor( Math.random() * otherPlayers.length ) ].name;

		let action;
		if( myCoins > 10 ) {
			action = 'couping';
		} else {
			action = priorityActions[0].key;
		}

		return {
			action,
			against,
		};
	}

	OnChallengeActionRound({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom }) {
		console.log('OnChallengeActionRound', history);
		return [ true, false ][ Math.floor( Math.random() * 2 ) ];
	}

	OnCounterAction({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom }) {
		if( action === 'assassination' ) {
			const hasContessa = myCards.includes('contessa');
			return hasContessa ? 'contessa' : false;
		}
		else if( action === 'stealing' ) {
			const counterCard = myCards.find(c => c === 'ambassador' || c === 'captain');
			return counterCard ? counterCard : false;
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
