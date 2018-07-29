'use strict';

const { ALLBOTS, CARDS, DECK, ACTIONS } = require('../constants.js');

class BOT {
	constructor() {
		this.GO = 0;
		this.cardOrder = () => [
			'duke',
			'captain',
			'contessa',
			'assassin',
			'ambassador',
		];
		this.actionCards = () => ({
			'foreign-aid': 'duke',
			assassination: 'assassin',
			stealing: 'captain',
			swapping: 'ambassador',
			'taking-1': 'contessa',
		});
		this.cardActions = () => ({
			duke: 'taking-3',
			assassin: 'assassination',
			captain: 'stealing',
			ambassador: 'swapping',
			contessa: 'taking-1',
		});
	}

	CountDiscardPile(discardedCards, myCards) {
		const discardPile = {};
		[...discardedCards, ...myCards].forEach((card) => {
			if (!discardPile[card]) discardPile[card] = 1;
			else discardPile[card]++;
		});

		return discardPile;
	}

	HasBeenChallegendBefore(history) {
		const sinceLastAction = [];
		let save = false;

		history.reverse().some((entry) => {
			sinceLastAction.push(entry);

			if (entry.type === 'action') {
				return true;
			}
		});

		sinceLastAction.reverse().some((action) => {
			if (action.type === 'challenge-round' && action.lying === false) {
				save = true;
				return true;
			}
		});

		return save;
	}

	HasBeenBlockedBefore(history, action, against) {
		let result = false;

		history.some((item) => {
			if (item.type === 'counter-round' || item.type === 'challenge-round') {
				if (against) {
					if (item.action === action && item.challengee === against) {
						result = true;
						return true;
					}
				} else {
					if (item.action === action) {
						result = true;
						return true;
					}
				}
			}
		});

		return result;
	}

	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		this.GO++;
		let thisAction = ['foreign-aid', 'taking-1'];
		let thisAgainst = [];
		let allActions = ACTIONS();
		const cardActions = this.cardActions();

		myCards.forEach((action) => {
			thisAction.push(cardActions[action]);
		});

		if (myCards[0] === myCards[1]) {
			thisAction.push('swapping');
			thisAction.push('swapping');
		}

		if (thisAction.includes('taking-1') && thisAction.includes('foreign-aid')) {
			thisAction = thisAction.filter((action) => action !== 'taking-1');
		}

		if (this.HasBeenBlockedBefore(history, 'foreign-aid')) {
			thisAction = thisAction.filter((action) => action !== 'foreign-aid');
		}

		if (thisAction.includes('assassination') && myCoins < 3) {
			thisAction = thisAction.filter((action) => action !== 'assassination');
		}

		if (thisAction.length < 2) {
			thisAction.push('taking-3');
		}

		let action = thisAction[Math.floor(Math.random() * thisAction.length)];
		let against =
			otherPlayers[Math.floor(Math.random() * otherPlayers.length)].name;

		if (thisAction.includes('stealing')) {
			otherPlayers.some((player) => {
				if (player.coins >= 2) {
					against = player.name;
					action = 'stealing';
					return true;
				}
			});
		}

		if (myCoins >= 7) {
			action = 'couping';
		}

		return {
			action,
			against,
		};
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
		const discardPile = this.CountDiscardPile(discardedCards, myCards);
		const actionCards = this.actionCards();

		if (discardPile[actionCards[action]] === 3) {
			return true;
		}

		// if (byWhom === 'TimL' || byWhom === 'JohnM') {
		// 	// can't trust those guys!
		// 	return [true, true, false][Math.floor(Math.random() * 3)];
		// }

		if (
			this.GO === 1 &&
			action === 'swapping' &&
			['TimL', 'MikeH', 'JossM', 'NathS'].includes(byWhom)
		) {
			return [true, true, false][Math.floor(Math.random() * 3)];
		}

		// if (action === 'assassination' && discardPile[actionCards[action]] === 2) {
		// 	return [true, false][Math.floor(Math.random() * 2)];
		// }

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
		if (this.HasBeenChallegendBefore(history)) {
			if (action === 'assassination' && myCards.includes('contessa')) {
				return 'contessa';
			} else if (action === 'stealing') {
				if (myCards.includes('ambassador')) {
					return 'ambassador';
				} else if (myCards.includes('captain')) {
					return 'captain';
				} else {
					return false;
				}
			} else if (action === 'foreign-aid') {
				if (myCards.includes('duke')) {
					return 'duke';
				}
			}

			return false;
		} else {
			if (action === 'assassination') {
				return 'contessa';
			} else if (action === 'stealing') {
				if (myCards.includes('ambassador')) {
					return 'ambassador';
				} else if (myCards.includes('captain')) {
					return 'captain';
				} else {
					return false;
				}
			} else if (action === 'foreign-aid') {
				if (myCards.includes('duke')) {
					return 'duke';
				}
			}

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
		const discardPile = this.CountDiscardPile(discardedCards, myCards);
		const actionCards = this.actionCards();

		if (
			action === 'assassination' &&
			['TimL', 'JohnM', 'MikeH', 'JossM', 'NathS', 'BenC'].includes(byWhom)
		) {
			return true;
		}

		if (discardPile[actionCards[action]] === 3) {
			return true;
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
		const order = this.cardOrder();
		const allCards = [...myCards, ...newCards];

		return allCards
			.sort((a, b) => order.indexOf(a) - order.indexOf(b))
			.slice(0, myCards.length);
	}

	OnCardLoss({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		const order = this.cardOrder().reverse();

		let newCards = myCards.sort((a, b) => order.indexOf(a) - order.indexOf(b));
		newCards = new Set(newCards);

		return [...newCards].slice(0, 1)[0];
	}
}

module.exports = exports = BOT;
