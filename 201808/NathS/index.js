'use strict';

const {
	ALLBOTS,
	CARDS,
	DECK,
	ACTIONS,
} = require('../constants.js');

class BOT {
    constructor() {
        this.turn = 0;
    }

    shuffleActions( actions ) {
        return actions[ Math.floor( Math.random() * actions.length ) ];
    }

    count(card, pile){
        let counter = 0
        pile.forEach( visibleCard => {
            if(visibleCard == card){
                counter++;
            }
        });
        return counter;
    }

    removeAction(action, actionsAvailable){
        if(actionsAvailable.includes(action))
            actionsAvailable.splice(actionsAvailable.indexOf(action), 1 );
        //return actionsAvailable;
    }

    ifCounteredPreviously(history, player, action){
        history.forEach( event => {
            if( event.type == 'counter-action' && event.from == player.name && event.action == action) {
                return true;
            }else{
                return false;
            }
        });
    }

	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
        this.turn++;

        // console.log("=======================================");
        // console.log("Nathan: " + myCards);
        //console.log("Discarded: " + discardedCards);

        let action;
        let actionsAvailable = ACTIONS();
        let against = otherPlayers[ Math.floor( Math.random() * otherPlayers.length ) ].name;
        
    // Dequalify actions
        //don't coup if I have less than 7 coins
        if( myCoins < 7) {
            this.removeAction('couping', actionsAvailable);
        }

        //dont assassinate if I have less than 3 coins
        if(myCoins < 3) {
            this.removeAction('assassination', actionsAvailable);
        }

        //dont assassinate if I have less than 3 coins
        if(myCards.length == 1 && !myCards.includes('duke')) {
            this.removeAction('taking-3', actionsAvailable);
        }

        //don't swap if I have cards that I like
        if(myCards.includes('duke') || myCards.includes('assassin')) {
            this.removeAction('swapping', actionsAvailable);
        }

        // don't swap if I have 1 card that is not an ambassador
        if(myCards.length == 1 && !myCards.includes('ambassador')) {
            this.removeAction('swapping', actionsAvailable);
        }

        if(this.count("captain", discardedCards)>=2 && !myCards.includes('captain')){
            this.removeAction('stealing', actionsAvailable);
        }

        if(this.count("assassin", discardedCards)==3){
            this.removeAction('assassination', actionsAvailable);
        }

        if(this.count("ambassador", discardedCards)==3){
            this.removeAction('swapping', actionsAvailable);
        }

        if(this.count("duke", discardedCards)==3){
            this.removeAction('taking-3', actionsAvailable);
        }

        // don't steal if no one has 2 or more coins...
        let letsSteal = false;
        otherPlayers.some( player => {
            if( player.coins > 2 ) {
                letsSteal = true;
                return true;
            }
        });
        // ...or if I have 3 or more coins, and no captain
        if( !letsSteal || (myCards.length ==1 && !myCards.includes('captain')) || (myCoins >= 3 && !myCards.includes('captain'))){
            this.removeAction('stealing', actionsAvailable);
        }

        //don't swap if I have lots of coins and I don't have an ambassador
        if(myCoins > 4 && !myCards.includes('ambassador')){
            this.removeAction('swapping', actionsAvailable);
        }

        //don't assassinate if I have one card left, which is not an assassin
        if(myCards.length==1 && !myCards.includes('assassin')){
            this.removeAction('assassination', actionsAvailable);
        }

    // randomly choose action 
        action = this.shuffleActions( actionsAvailable );

    // overwrite actions
        
        //take 3 coins until I get called out on it
        if(myCards.includes('duke')){
            action = 'taking-3';
        }

        //decide if I should swap
        if((myCards.includes('ambassador') || myCards[0]==myCards[1]) && actionsAvailable.includes('swapping')){
            action = this.shuffleActions( [ action, 'swapping' ] );
        }

        if(myCards.includes('assassin') && myCoins >= 3){
            //if there is one player left and I have two cards, targeted attack!
            if(otherPlayers.length===1 && myCards.length===2){
                action = 'assassination';
            }
            //find someone to pick on
            else {
                const target = otherPlayers.find(player => player.cards.length === 1);
                if (target) {
                    action = 'assassination'
                    against = target;
                };

                // no target found
                if( !target ){
                    action = this.shuffleActions( [ action, 'assassination' ] );
                }
            }
        }

        //if I can steal, I am trying to pick up, steal instead
        if(
            (action == "taking-1" || action == "taking-3" || action == "foreign-aid") &&
            myCards.includes('captain') &&
            actionsAvailable.includes('stealing')
        ){
            action='stealing';
        }

        //try to find someone to steal from
        if( action == 'stealing'){
            otherPlayers.some( player => {
                if( player.coins >= 2 & !this.ifCounteredPreviously(history, player, 'stealing')) {
                    against = player.name;
                    return true;
                }
            });
        }

        if(this.turn == 1){
            if(myCards.includes('duke')){
                action = 'taking-3';
            }else{
                action = 'foreign-aid';
            }
        }

        if( myCoins >= 7 ) {
            if(myCards.includes('assassin')){
                action = 'assassination';
            }else{
                action = 'couping';
            }
        }

        if( myCoins >= 10 ) {
			action = 'couping';
        }

		return {action,against};
	}

	OnChallengeActionRound({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom }) {
        
        const visibleCards = [...myCards, ...discardedCards];

        if(action == 'stealing'){
            if(toWhom == "NathS" && action == "stealing" && myCoins < 2){
                return false;
            }else if(this.count("captain", visibleCards)==3){
                return true;
            }else{
                return false
            }
        }
        
        else if(action == 'assassination'){
            if (toWhom == "NathS" && myCards.length==1){
                return true;
            } else if (this.count('assassin', visibleCards)==3){
                return true;
            } else {
                return false;
            }
        }
        
        else if(action == "exchange"){
            if(this.count("ambassador", visibleCards)==3){
                return true;
            }else{
                return false;
            }
        }

        else if(action == "taking-3"){
            if(this.count("duke", visibleCards)==3){
                return true;
            }else{
                return false;
            }
        }

        else{
            return false;
        }
	}

	OnCounterAction({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom }) {
        const visibleCards = [...myCards, ...discardedCards];

        if( action === 'assassination' ) {
            if (myCards.includes('contessa') || (myCards.length === 1 && this.count("contessa", discardedCards)<1)){
                return 'contessa';
            }
			return false;
        }
        
		else if( action === 'stealing' ) {
            if (myCards.includes('ambassador')){
                return 'ambassador';
            }else if(myCards.includes('captain')){
                return 'captain';
            }else if(myCoins==0){
                return false;
            }else{
                return false;
            } 			
		}
	}

	OnCounterActionRound({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom, card }) {
        const visibleCards = [...myCards, ...discardedCards];

        if(action == "blocking" && this.count("duke", visibleCards)==3){
            return true;
        }
        
        if(action == "assassination"){
            //there is one player left with one card, and I have two cards left
            if(otherPlayers.length == 1 && otherPlayers[0].cards.length == 1 && myCards == 2){            return true
            }else if(this.count("contessa", visibleCards)<1){
                return true
            }else if(toWhom == "NathS" && myCards.length==1){
                return true;
            }else{
                return false;
            }
		}
	}

	OnSwappingCards({ history, myCards, myCoins, otherPlayers, discardedCards, newCards }) {
		return newCards;
	};

	OnCardLoss({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		return myCards[ 0 ];
	};
}

module.exports = exports = BOT;
