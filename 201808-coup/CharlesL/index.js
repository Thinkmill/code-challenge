'use strict';

const { ALLBOTS, CARDS, DECK, ACTIONS } = require('../constants.js');
const CARDPREFERENCE = [
	'duke',
	'captain',
	'assassin',
	'contessa',
	'ambassador',
];
const PLAYERSWITHBOTS = [
	'TimL',
	'DomW',
	'JohnM',
	'JossM',
	'AbassA',
	'TuanH',
	'MikeH',
	'TomW',
	'NathS',
	'BenC',
];

let counterHistory = [];
const me = 'CharlesL';

const TOPCONTENDERS = ['TimL', 'DomW', 'JossM', 'JohnM'];
class BOT {
	constructor() {
		this.counterHistory = [];
		console.log(DECK());
		this.playerHistory = ALLBOTS().reduce((acc, curr) => {
			acc[curr] = [];
			return acc;
		}, {});
	}
	shouldForeignAid(discardedCards) {
		const foreignAidBlocks = this.counterHistory.filter(
			(event) => event.action === 'foreign-aid'
		);
		if (!this.cardsStillInPlay(discardedCards, 'duke')) return true;
		return [true, false][Math.floor(Math.random() * 2)];
	}
	findAppropriateTarget(players) {
		const playerNames = players.map((player) => player.name);
		const richestPlayer = players.sort((a, b) => a.coins - b.coins)[0];
		let favoredPlayer;
		for (let index = 0; index < TOPCONTENDERS.length; index++) {
			if (playerNames.includes(TOPCONTENDERS[index])) {
				favoredPlayer = TOPCONTENDERS[index];
				break;
			}
		}
		return favoredPlayer || richestPlayer.name;
	}
	defineAction(myCards, myCoins, discardedCards) {
		let action = 'taking-1';
		if (myCards.includes('ambassador')) {
			action = 'swapping';
		} else if (myCards.includes('duke')) {
			action = 'taking-3';
		} else {
			if (this.shouldForeignAid(discardedCards)) {
				action = 'foreign-aid';
			}
		}

		if (myCoins >= 3 && myCards.includes('assassin')) {
			action = 'assassination';
		}

		if (myCoins >= 7) {
			action = 'couping';
		}
		return action;
	}

	defineAgainst(action, otherPlayers) {
		return this.findAppropriateTarget(otherPlayers);
	}
	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		const action = this.defineAction(myCards, myCoins, discardedCards);
		const against = this.defineAgainst(action, otherPlayers);
		return {
			action,
			against,
		};
	}

	cardsStillInPlay(discardedCards, card) {
		if (
			discardedCards.filter((discardedCard) => discardedCard === card)
				.length === 4
		)
			return false;
		return true;
	}

	OnChallengeActionRound({
		history,
		myCards,
		myCoins,
		otherPlayers,
		discardedCards,
		action,
		byWhom,
		toWhom,
	}) {
		this.playerHistory[byWhom].push({ action, toWhom });
		if (toWhom === me) {
			switch (action) {
				case 'stealing':
					if (!this.cardsStillInPlay(discardedCards, 'captain')) {
						return true;
					}
				case 'assassination':
					if (!this.cardsStillInPlay(discardedCards, 'assassin')) {
						return true;
					}
			}
		}
		return false;
	}

	OnCounterAction({
		history,
		myCards,
		myCoins,
		otherPlayers,
		discardedCards,
		action,
		byWhom,
	}) {
		if (action === 'assassination') return 'contessa';
		if (action === 'stealing') {
			if (myCards.includes('ambassador')) return 'ambassador';
			if (myCards.includes('captain')) return 'captain';
			return ['captain', 'ambassador', false][Math.floor(Math.random() * 3)];
		}
		if (action === 'foreign-aid') {
			if (myCards.includes('duke')) return 'duke';
			return false;
		}
	}

	OnCounterActionRound({
		history,
		myCards,
		myCoins,
		otherPlayers,
		discardedCards,
		action,
		byWhom,
		toWhom,
		card,
	}) {
		if (toWhom === me) {
			switch (action) {
				case 'assassination': {
					if (!cardsStillInPlay(discardedCards, 'assassin')) {
						return true;
					}
					return false;
				}
				case 'stealing': {
					if ((!cardsStillInPlay(discardedCards), 'captain')) {
						return true;
					}
					return [true, false][Math.floor(Math.random() * 2)];
				}
				case 'taking-3': {
					if (!cardsStillInPlay(discardedCards, 'duke')) {
						return true;
					}
					return [true, false][Math.floor(Math.random() * 2)];
				}
				default:
					return [true, false][Math.floor(Math.random() * 2)];
			}
		}
		return false;
	}

	OnSwappingCards({
		history,
		myCards,
		myCoins,
		otherPlayers,
		discardedCards,
		newCards,
	}) {
		const cardPool = myCards.slice().concat(newCards);
		let newCardCandidate = [];
		let index = 0;
		while (
			newCardCandidate.length <= myCards.length &&
			index < CARDPREFERENCE.length
		) {
			if (cardPool.includes(CARDPREFERENCE[index])) {
				newCardCandidate.push(CARDPREFERENCE[index]);
			}
			index = index + 1;
		}
		return newCardCandidate;
	}

	OnCardLoss({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		const DISCARDPREFERENCE = CARDPREFERENCE.slice().reverse();
		for (let i = 0; i <= DISCARDPREFERENCE.length; i++) {
			if (myCards.includes(DISCARDPREFERENCE[i])) return DISCARDPREFERENCE[i];
		}
	}
}

module.exports = exports = BOT;
