'use strict';

const {
	ALLBOTS,
	CARDS,
	DECK,
	ACTIONS,
} = require('../constants.js');


class BOT {
	constructor() {
		this.hasDuke = [];
		this.hasStealingBlocker = [];
		this.hasContessa = [];
	}

	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		let thisAction = [];
		let thisAgainst = [];
		let allActions = ACTIONS();
		const actionCards = {
			duke: 'foreign-aid',
			assassin: 'assassination',
			captain: 'stealing',
			ambassador: 'swapping',
			contessa: 'taking-1',
		};

		myCards.forEach( action => {
			thisAction.push( actionCards[ action ] );
		});

		if( thisAction.includes('taking-1') && thisAction.includes('foreign-aid') ) {
			thisAction = thisAction.filter( action => action !== 'taking-1' );
		}

		let against;

		if( thisAction.includes( 'stealing' ) ) {
			otherPlayers.some( player => {
				if( player.coins >= 2 && !this.hasStealingBlocker.includes( player.name ) ) {
					against = player.name;
					return true;
				}
			});
			if( !against ) {
				thisAction = thisAction.filter( action => action !== 'stealing' );
			}
		}

		let action = thisAction[ Math.floor( Math.random() * thisAction.length ) ];
		if( !against ) against = otherPlayers[ Math.floor( Math.random() * otherPlayers.length ) ].name;

		if( myCoins > 10 ) {
			action = 'couping';
		}

		return {
			action,
			against,
		};
	}

	OnChallengeActionRound({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom }) {
		return false;
	}

	OnCounterAction({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom }) {
		if( action === 'assassination' ) {
			if( myCards.includes('contessa') ) {
				return 'contessa';
			}
			else {
				return false;
			}
		}
		else if( action === 'stealing' ) {
			if( myCards.includes('ambassador') ) {
				return 'ambassador';
			}
			else if( myCards.includes('captain') ) {
				return 'captain';
			}
			else {
				return false;
			}
		}
	}

	OnCounterActionRound({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom, card }) {
		console.log({action});
		console.log({byWhom});
		console.log({toWhom});
		console.log({card});
		if( action === 'stealing' ) {
			this.hasStealingBlocker.push( toWhom );
		}
		if( action === 'assassination' ) {
			this.hasContessa.push( toWhom );
		}
		if( action === 'foreign-aid' ) {
			this.hasDuke.push( toWhom );
		}
		return false;
	}

	OnSwappingCards({ history, myCards, myCoins, otherPlayers, discardedCards, newCards }) {
		return newCards;
	};

	OnCardLoss({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		return myCards[ 0 ];
	};
}


module.exports = exports = BOT;
