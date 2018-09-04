'use strict';

const {
	getBlockersFor,
	getCardFor,
	getCount,
	loseCard,
	swapCards,
} = require('./helpers');
const { makeAction } = require('./logic');
const { ME } = require('./constants');

class CoupCouper {
	constructor() {
		this.turnCount = 0;
	}
	OnTurn(args) {
		return makeAction({ ...args, turnCount: this.turnCount++ });
	}
	OnChallengeActionRound({
		history,
		otherPlayers,
		action,
		discardedCards,
		myCards,
		toWhom,
	}) {
		if (toWhom !== ME) return false; // limit challenges, do not draw attention
		return getCount(getCardFor(action), [...myCards, ...discardedCards]) === 3;
	}
	OnCounterAction({ history, otherPlayers, action, myCards }) {
		if (action === 'assassination' && myCards.length === 1) return 'contessa';
		const canBlock = getBlockersFor(action).find((c) => myCards.includes(c));
		return canBlock || false;
	}
	OnCounterActionRound({
		history,
		otherPlayers,
		action,
		card,
		discardedCards,
		myCards,
	}) {
		return getCount(card, [...myCards, ...discardedCards]) === 3;
	}
	OnSwappingCards({ history, otherPlayers, myCards, newCards }) {
		return swapCards([...myCards, ...newCards]);
	}
	OnCardLoss({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		if (myCards.length === 1) return myCards[0];
		return loseCard(myCards);
	}
}

module.exports = exports = CoupCouper;
