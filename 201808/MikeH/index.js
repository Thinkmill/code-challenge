'use strict';

const HonestBot = require('./HonestBot');

class BOT {
	constructor () {
		this.bot = new HonestBot();
		this.OnTurn = this.bot.OnTurn;
		this.OnChallengeActionRound = this.bot.OnChallengeActionRound;
		this.OnCounterAction = this.bot.OnCounterAction;
		this.OnCounterActionRound = this.bot.OnCounterActionRound;
		this.OnSwappingCards = this.bot.OnSwappingCards;
		this.OnCardLoss = this.bot.OnCardLoss;
	}
}

module.exports = exports = BOT;
