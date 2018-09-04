'use strict';

const { ALLBOTS, CARDS, DECK, ACTIONS } = require('../constants.js');

const ME = 'TuanH';

const CARD_ORDER = ['duke', 'captain', 'ambassador', 'contessa', 'assassin'];

const PLAYER_ORDER = [
	'TimL',
	'JohnM',
	'DomW',
	'MikeH',
	'AbbasA',
	'TomW',
	'JossM',
	'BenC',
	'NathS',
	'TiciA',
	'SanjiyaD',
	'BorisB',
	'CharlesL',
	'JedW',
	'JessT',
	'KevinY',
	'LaurenA',
	'MalB',
	'MikeG',
];

const count = (card, cards) => cards.filter((c) => c === card).length;

const cardFor = (action) =>
	({
		'taking-3': 'duke',
		assassination: 'assassin',
		stealing: 'captain',
		swapping: 'ambassador',
	}[action]);

const blockersFor = (action) =>
	({
		assassination: ['contessa'],
		stealing: ['captain', 'ambassador'],
		'foreign-aid': ['duke'],
	}[action] || []);

const findAgainstPlayers = (players) =>
	players
		.map((player) => [player.coins * player.cards, player])
		.sort((a, b) => b[0] - a[0])
		.map((item) => item[1]);

const getPlayer = (name, players) =>
	players.find((player) => player.name === name);

class BOT {
	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		const knownCards = myCards.concat(discardedCards);
		const againstPlayer = findAgainstPlayers(otherPlayers)[0];

		let action = 'taking-1';

		if (myCoins > 6) {
			action = 'couping';
		} else if (myCards.includes(cardFor('assassination')) && myCoins >= 3) {
			action = 'assassination';
		} else if (myCards.includes(cardFor('taking-3'))) {
			action = 'taking-3';
		} else if (myCards[0] === myCards[1]) {
			action = 'swapping';
		} else if (myCards.includes(cardFor('swapping'))) {
			action = 'swapping';
		} else if (
			myCards.includes(cardFor('stealing')) &&
			againstPlayer.coins >= 2
		) {
			action = 'stealing';
		} else if (
			blockersFor('foreign-aid').every((card) => count(card, knownCards) === 3)
		) {
			action = 'foreign-aid';
		} else {
			action = 'taking-1';
		}

		return {
			action,
			against: againstPlayer.name,
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
		const knownCards = myCards.concat(discardedCards);
		const shouldCallOut =
			knownCards.filter((card) => card === cardFor(action)).length === 3;
		return shouldCallOut;

		if (action === 'assassination' && toWhom === ME && myCards.length === 1) {
			return true;
		}

		if (
			action === 'stealing' &&
			toWhom === ME &&
			blockersFor('stealing').find((card) => myCards.includes(card))
		) {
			return true;
		}
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
		const haveBlockers = blockersFor(action).find((card) =>
			myCards.includes(card)
		);
		if (haveBlockers) {
			return haveBlockers;
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
		const knownCards = myCards.concat(discardedCards);
		const shouldCallOut = knownCards.filter((c) => c === card).length === 3;
		return shouldCallOut;

		if (action === 'assassination' && myCards.length === 1) {
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
		const allCards = [...myCards, ...newCards];
		const considerationCards = allCards.filter((card) => card !== 'ambassador');
		const reorderCard = CARD_ORDER.filter((card) =>
			considerationCards.includes(card)
		);
		return reorderCard.slice(0, myCards.length);
	}

	OnCardLoss({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		if (myCards.length === 1) {
			return myCards[0];
		}

		if (CARD_ORDER.indexOf(myCards[0]) < CARD_ORDER.indexOf(myCards[1])) {
			return myCards[0];
		} else {
			return myCards[1];
		}
	}
}

module.exports = exports = BOT;
