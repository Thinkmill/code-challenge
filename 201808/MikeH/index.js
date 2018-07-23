'use strict';

const HonestBot = require('./honest-bot');

class BOT {
	constructor () {
		this.bot = new HonestBot();
	}

	OnTurn = (opts) => this.bot.OnTurn(opts);
	OnChallengeActionRound = (opts) => this.bot.OnChallengeActionRound(opts);
	OnCounterAction = (opts) => this.bot.OnCounterAction(opts);
	OnCounterActionRound = (opts) => this.bot.OnCounterActionRound(opts);
	OnSwappingCards = (opts) => this.bot.OnSwappingCards(opts);
	OnCardLoss = (opts) => this.bot.OnCardLoss(opts);
}


module.exports = exports = BOT;
