'use strict';

const {
	ALLBOTS,
	CARDS,
	DECK,
	ACTIONS,
} = require('../constants.js');


class BOT {
	constructor() {
		this.ROUND = 0;
	}

	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		// let action = ACTIONS()[ Math.floor( Math.random() * ACTIONS().length ) ];
		let action = ['taking-1', 'foreign-aid'][ Math.floor( Math.random() * 2) ];
		let against = otherPlayers[ Math.floor( Math.random() * otherPlayers.length ) ].name;

		let playerWithMoreCoins = otherPlayers.reduce((a, b) => a.coins > b.coins ? a : b);
		let playerWithMoreCards = otherPlayers.reduce((a, b) => a.cards > b.cards ? a : b);
		let enemy = [ playerWithMoreCoins.name, playerWithMoreCards.name ][ Math.floor( Math.random() * 2 ) ];

		this.ROUND ++;
		
		//In the early game, you want to be the Duke so you can gain the coin advantage. 
		//The Assassin can be nice to knock opponents down in influence early and 
		//The Contessa can help to block early assassination attempts as well. 
		//If you are none of these, you may want to take the Ambassador action and exchange your cards with the Court Deck.
		if (this.ROUND <= 2) {

			if(myCards.includes('duke')) {
				action = 'taking-3';
			}
			if(myCards.includes('ambassador')) {
				action = 'swapping';
			}

			action = [ 'taking-3', 'swapping' ][ Math.floor( Math.random() * 2 ) ];
		}

		if( myCoins >= 3 && myCards.includes('assassin') && discardedCards.includes('contessa')) {
			action = 'assassination';
			against = enemy;
		}

		if( myCoins > 10 ) {
			action = 'couping';
			against = enemy;
		}

		return {
			action,
			against,
		};
	}

	OnChallengeActionRound({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom }) {
		if (this.ROUND <= 2) {
			if (action === 'taking-3') {
				return false;
			}
		}
		return [ true, false ][ Math.floor( Math.random() * 2 ) ];
	}

	OnCounterAction({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom }) {
		if( action === 'assassination' ) {
			//If you have 2 influence, NEVER:
			//Falsely claim to be the Contessa when you are being assassinated.
			//Challenge an Assassin who is assassinating you.
			if (myCards.length === 2 && myCards.indexOf('contessa') === -1) {
				return false;
			} else if (myCards.includes('contessa')) {
				return 'contessa';
			} else {
				return [ false, 'contessa' ][ Math.floor( Math.random() * 2 ) ];
			}
		}

		if( action === 'stealing' ) {
			return [ false, 'ambassador', 'captain' ][ Math.floor( Math.random() * 3 ) ];
		}

		if( action === 'foreign-aid' ) {
			return [ false, 'duke'][ Math.floor( Math.random() * 2 ) ];
		}

		if( action === 'taking-3' ) {
			return [ false, 'duke'][ Math.floor( Math.random() * 2 ) ];
		}
	}

	OnCounterActionRound({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom, card }) {
		return [ true, true, false ][ Math.floor( Math.random() * 3 ) ];
	}

	OnSwappingCards({ history, myCards, myCoins, otherPlayers, discardedCards, newCards }) {
		// let optionCards = myCards.concat(newCards);
		// let newHand = [];
		// // let randowCard = newCards[ Math.floor( Math.random() * (newHand.length) )]

		// //remove duplicated 
		// optionCards.forEach( card => {
		// 	if (newHand.indexOf(card) < 0) {
		// 		return newHand.push(card);
		// 	}
		// });
		// console.log('------------------------------------');
		// console.log(myCards, newCards, newHand);
		// console.log('------------------------------------');
		// if (myCards.includes('captain')) {
		// 	 return myCards;
		// }

		if(myCards.length === 2) {
			return newCards;
		}

		return myCards;

	};

	OnCardLoss({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		return myCards[ 0 ];
	};
}


module.exports = exports = BOT;
