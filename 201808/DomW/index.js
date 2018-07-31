'use strict';

const { ALLBOTS, CARDS, DECK, ACTIONS } = require('../constants.js');

class BOT {
	constructor() {
		this.GO = 0;
		this.cardOrder = () => [
			'duke',
			'captain',
			'contessa',
			'ambassador',
			'assassin',
		];
		this.actionOrder = () => [
			'assassination',
			'swapping',
			'taking-3',
			'stealing',
			'foreign-aid',
			'taking-1',
		];
		this.targetOrder = () => [
			'JohnM',
			'TimL',
			'TuanH',
			'MikeH',
			'AbbasA',
			'TomW',
			'JossM',
			'NathS',
			'BenC',
			'SanjiyaD',
			'MikeG',
			'BorisB',
			'CharlesL',
			'JedW',
			'JessT',
			'KevinY',
			'LaurenA',
			'MalB',
			'TiciA',
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

	SelectTarget({ history, doAction, otherPlayers, thisAction, condition }) {
		const order = this.targetOrder();
		let found = false;
		let action;
		let against;

		otherPlayers
			.sort(
				(a, b) =>
					b.cards - a.cards ||
					b.coins - a.coins ||
					order.indexOf(a.name) - order.indexOf(b.name)
			)
			.some((player) => {
				if (
					!this.HasBeenBlockedBefore(history, doAction, player.name) &&
					condition(player)
				) {
					action = doAction;
					against = player.name;
					found = true;
					return true;
				}
			});

		if (!found) {
			thisAction = thisAction.filter((action) => action !== doAction);
			action = thisAction[Math.floor(Math.random() * thisAction.length)];
			against =
				otherPlayers[Math.floor(Math.random() * otherPlayers.length)].name;
		}

		return {
			action,
			thisAction,
			against,
		};
	}

	GetTarget(players) {
		const order = this.targetOrder();
		return players
			.sort(
				(a, b) =>
					b.cards - a.cards ||
					b.coins - a.coins ||
					order.indexOf(a.name) - order.indexOf(b.name)
			)
			.slice(0, 1)[0].name;
	}

	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		this.GO++;
		let thisAction = ['foreign-aid', 'taking-1'];
		let thisAgainst = [];
		let allActions = ACTIONS();
		const order = this.actionOrder();
		const cardActions = this.cardActions();

		myCards.forEach((action) => {
			thisAction.push(cardActions[action]);
		});

		if (myCards[0] === myCards[1]) {
			thisAction.push('swapping');
		}

		if (this.HasBeenBlockedBefore(history, 'foreign-aid')) {
			thisAction = thisAction.filter((action) => action !== 'foreign-aid');
		}

		if (thisAction.includes('taking-1') && thisAction.includes('foreign-aid')) {
			thisAction = thisAction.filter((action) => action !== 'taking-1');
		}

		if (thisAction.includes('assassination') && myCoins < 3) {
			thisAction = thisAction.filter((action) => action !== 'assassination');
		}

		if (
			thisAction.length < 2 &&
			!this.HasBeenBlockedBefore(history, 'taking-3')
		) {
			thisAction.push('taking-3');
		}

		let action = thisAction
			.sort((a, b) => order.indexOf(a) - order.indexOf(b))
			.slice(0, 1)[0];
		let against = this.GetTarget(otherPlayers);

		if (action === 'stealing') {
			const targetObject = this.SelectTarget({
				history,
				doAction: 'stealing',
				otherPlayers,
				thisAction,
				condition: (player) => player.coins > 2,
			});
			action = targetObject.action;
			thisAction = targetObject.thisAction;
			against = targetObject.against;
		}

		if (action === 'assassination') {
			const targetObject = this.SelectTarget({
				history,
				doAction: 'assassination',
				otherPlayers,
				thisAction,
				condition: () => true,
			});
			action = targetObject.action;
			thisAction = targetObject.thisAction;
			against = targetObject.against;
		}

		if (
			otherPlayers.length < 2 &&
			myCoins < otherPlayers[0].coins &&
			!this.HasBeenBlockedBefore(
				history,
				'foreign-aid',
				otherPlayers[0].name
			) &&
			!myCards.includes('duke')
		) {
			action = 'foreign-aid';
		}

		if (
			myCards.length === 1 &&
			otherPlayers.length === 1 &&
			otherPlayers[0].cards === 2 &&
			myCoins < otherPlayers[0].coins &&
			myCoins >= 3
		) {
			action = 'assassination';
			against = otherPlayers[0].name;
		}

		if (
			myCards.includes('captain') &&
			otherPlayers.length === 1 &&
			otherPlayers[0].coins >= 1 &&
			!this.HasBeenBlockedBefore(history, 'stealing', otherPlayers[0].name)
		) {
			action = 'stealing';
			against = otherPlayers[0].name;
		}

		if (otherPlayers.length === 1 && myCoins >= 3 && this.GO > 30) {
			action = 'assassination';
			against = otherPlayers[0].name;
		}

		if (
			myCoins === 6 &&
			action !== 'assassination' &&
			!otherPlayers[0].coins >= 7
		) {
			action = 'taking-1';
		}

		if (myCards[0] === myCards[1]) {
			if (!this.HasBeenBlockedBefore(history, 'swapping')) {
				action = 'swapping';
			} else {
				action = [action, 'swapping'][Math.floor(Math.random() * 2)];
			}
		}

		if (myCoins >= 7) {
			action = 'couping';
			against = this.GetTarget(otherPlayers);
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

		if (this.GO <= 3 && action === 'swapping' && ['JohnM'].includes(byWhom)) {
			return [true, true, false][Math.floor(Math.random() * 3)];
		}

		if (
			action === 'assassination' &&
			['TuanH', 'JohnM'].includes(byWhom) &&
			!myCards.includes('contessa') &&
			toWhom === 'DomW'
		) {
			return [true, true, false][Math.floor(Math.random() * 3)];
		}

		if (
			action === 'assassination' &&
			toWhom === 'DomW' &&
			myCards.length === 1 &&
			!myCards.includes('contessa')
		) {
			return true;
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
		if (action === 'assassination' && myCards.includes('contessa')) {
			return 'contessa';
		} else if (
			action === 'assassination' &&
			!this.HasBeenChallegendBefore(history) &&
			otherPlayers.length !== 1 &&
			myCards.length === 2
		) {
			return 'contessa';
		} else if (action === 'assassination' && myCards.length === 1) {
			return 'contessa';
		} else if (action === 'stealing') {
			if (otherPlayers.length === 1) {
				return ['ambassador', 'captain', false][Math.floor(Math.random() * 3)];
			}
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

		if (action === 'assassination' && ['TimL', 'JohnM'].includes(byWhom)) {
			return [true, false][Math.floor(Math.random() * 2)];
		}

		if (
			action === 'stealing' &&
			['JohnM'].includes(byWhom) &&
			otherPlayers.length === 1
		) {
			return [true, true, false][Math.floor(Math.random() * 3)];
		}

		if (discardPile[card] === 3) {
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
		let allCards = new Set([...myCards, ...newCards]);
		allCards = [...allCards];

		return allCards
			.sort((a, b) => order.indexOf(a) - order.indexOf(b))
			.slice(0, myCards.length);
	}

	OnCardLoss({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		const order = this.cardOrder().reverse();
		let newCards = myCards.sort((a, b) => order.indexOf(a) - order.indexOf(b));

		return newCards.slice(0, 1)[0];
	}
}

module.exports = exports = BOT;
