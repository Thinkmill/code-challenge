'use strict';

const {
	ALLBOTS,
	CARDS,
	DECK,
	ACTIONS,
} = require('../constants.js');


class BOT {

	shuffleActions( actions ) {
		return actions[ Math.floor( Math.random() * actions.length ) ];
	}


	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		let action
		let actionsAvailable = ACTIONS();
		const against = otherPlayers[ Math.floor( Math.random() * otherPlayers.length ) ].name;

		console.log("===========================================")
		console.log("myCards= " + myCards)

		// Dequalify actions
		//don't coup if I have less than 7 coins
		if( myCoins < 7) {
			actionsAvailable.splice( actionsAvailable.indexOf('couping'), 1 );
		}

		if( myCoins < 3) {
			actionsAvailable.splice( actionsAvailable.indexOf('assassination'), 1 );}


// randomly choose action
action = this.shuffleActions( actionsAvailable );


		if(action == 'couping' && myCoins<7){
			ACTIONS()[ Math.floor( Math.random() * ACTIONS().length ) ];
		}
		if(myCards.includes('assassin') && myCoins>2){
			action='assassination'
		}

		if(myCards.includes('captain')){
			action='stealing';
		}

		if(myCards.includes('duke')){
			action='taking-3';

	

		if( myCoins > 10 ) {
			action = 'couping';
		}

		return {
			action,
			against,
		};
	}

	OnChallengeActionRound({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom }) {
		
		if(toWhom=="SanjiyaD"){
			return [ true, false ][ Math.floor( Math.random() * 2 ) ];
		}else{
			return false;
		}
	}

	OnCounterAction({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom }) {
		
		if( action === 'assassination' ) {
			return [ false, 'contessa' ][ Math.floor( Math.random() * 2 ) ];
		}
		else if( action === 'stealing' ) {
			return [ false, 'ambassador', 'captain' ][ Math.floor( Math.random() * 3 ) ];
		}
	}
	else if( action === 'foreign-aid' ) {
		return [ false, 'duke', ][ Math.floor( Math.random() * 3 ) ];



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
