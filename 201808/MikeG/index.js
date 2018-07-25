'use strict';

const {
	ALLBOTS,
	CARDS,
	DECK,
	ACTIONS,
} = require('../constants.js');

const GAME_STAGE_EARLY = 0;
const GAME_STAGE_MID = 1;
const GAME_STAGE_LATE = 2;

let gameTurn = 0;

class BOT {
	// Really basic strat is based on early / late game assumptions (Fyi I haven't played COUP yet...)
	getGameStageStrategy(){
		let gameStrategy;
		// Early play the Duke to get the coins
		if(gameTurn < 2){
			gameStrategy = {
				bluff: 0.5,
				challenge: 0.5,
				gameStage: GAME_STAGE_EARLY,
				action: 'taking-3'
			}
		// Start tighting up mid game
		} else if (gameTurn < 4){
			gameStrategy = {
				bluff: 0.3,
				challenge: 0.7,
				gameStage: GAME_STAGE_MID,
				action: 'taking-1'
			}
		// Late game TODO: What is the COUP late game? 
		} else{
			gameStrategy = {
				bluff: 0.2,
				challenge: 0.8,
				gameStage: GAME_STAGE_EARLY,
				action: 'taking-1'
			}
		}
		return this.getPlayerStrategy(gameStrategy);
	}

	// Apply any player strategy mod based on history / for the trolling!
	getPlayerStrategy(gameStrategy){
		// Random challenge / bluff. TODO implement actual player / history strats
		gameStrategy.bluff = Math.random();
		gameStrategy.challenge = Math.random();
		return gameStrategy;
	}

	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		let action = ACTIONS()[ Math.floor( Math.random() * ACTIONS().length ) ];
		const against = otherPlayers[ Math.floor( Math.random() * otherPlayers.length ) ].name;
		++gameTurn;
		// TODO: Understand the end game 
		if( myCoins > 10 ) {
			action = 'couping';
		} else{
			action = this.getGameStageStrategy().action;
		}

		return {
			action,
			against,
		};
	}

	OnChallengeActionRound({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom }) {
		return [ true, false ][ Math.floor( this.getGameStageStrategy().challenge * 2 ) ];
	}

	OnCounterAction({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom }) {
		if( action === 'assassination' ) {
			return [ false, 'contessa' ][ Math.floor( this.getGameStageStrategy().bluff * 2 ) ];
		}
		else if( action === 'stealing' ) {
			return [ false, 'ambassador', 'captain' ][ Math.floor( this.getGameStageStrategy().bluff * 3 ) ];
		}
	}

	OnCounterActionRound({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom, card }) {
		return [ true, false ][ Math.floor( this.getGameStageStrategy().challenge * 2 ) ];
	}

	OnSwappingCards({ history, myCards, myCoins, otherPlayers, discardedCards, newCards }) {
		return newCards;
	};

	OnCardLoss({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		return myCards[ 0 ];
	};
}


module.exports = exports = BOT;
