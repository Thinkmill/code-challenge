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
		this.cardOrder = () => ['captain', 'duke', 'contessa', 'assassin', 'ambassador'];
	}

	CountDiscardPile( discardedCards, myCards ) {
		const discardPile = {};
		[ ...discardedCards, ...myCards ].forEach( card => {
			if( !discardPile[ card ] ) discardPile[ card ] = 1;
			else discardPile[ card ] ++;
		});

		return discardPile;
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

		let action = thisAction[ Math.floor( Math.random() * thisAction.length ) ];
		let against = otherPlayers[ Math.floor( Math.random() * otherPlayers.length ) ].name;

		if( thisAction.includes( 'stealing' ) ) {
			otherPlayers.some( player => {
				if( player.coins >= 2 && !this.hasStealingBlocker.includes( player.name ) ) {
					against = player.name;
					action = 'stealing';
					return true;
				}
			});
		}

		if( myCoins >= 7 ) {
			action = 'couping';
		}

		return {
			action,
			against,
		};
	}

	OnChallengeActionRound({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom }) {
		const discardPile = this.CountDiscardPile( discardedCards, myCards );
		const actionCards = {
			'foreign-aid': 'duke',
			'assassination': 'assassin',
			'stealing': 'captain',
			'swapping': 'ambassador',
			'taking-1': 'contessa',
		};

		if( discardPile[ actionCards[ action ] ] === 3 ) {
			return true;
		}

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
		const allCards = [ ...myCards, ...newCards ];

		const order = this.cardOrder();
		return allCards
			.sort( (a, b) => order.indexOf( a ) - order.indexOf( b ) )
			.slice( 0, myCards.length );
	};

	OnCardLoss({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		const order = this.cardOrder().reverse();

		return myCards
			.sort( (a, b) => order.indexOf( a ) - order.indexOf( b ) )
			.slice( 0, 1 );
	};
}


module.exports = exports = BOT;
