'use strict';

const { ALLBOTS, CARDS, DECK, ACTIONS } = require('../constants.js');

const me = 'Madds';

const getCardFor = (action) =>
	({
		assassination: 'assassin',
		stealing: 'captain',
		swapping: 'ambassador',
		'taking-3': 'duke',
	}[action]);

const turns = (history) => {
	return history.filter((h) => h.type === 'action');
};

const isFirstTurn = (history, otherPlayers) => {
	const numTurns = turns(history).length;
	// General case of no-one dying first round
	return numTurns <= otherPlayers.length + 1;
};

const otherPlayerSwapped = (turn) => {
	if (turn.type === 'action' && turn.action === 'swapping' && turn.from !== me)
		return true;
	if (
		turn.action === 'swap-1' &&
		(turn.from !== me && turn.card !== 'ambassador')
	)
		return true;
};

const swapsSinceAmbass = (history) => {
	const historyRev = [...history].reverse();
	const myAmbassIndex = historyRev.findIndex(
		(t) => t.action === 'swapping' && t.from === me
	);
	const recent = historyRev.slice(0, myAmbassIndex);
	const swaps = recent.filter(otherPlayerSwapped);
	if (swaps.length > 0) return true;
};

//////////////////////////////////////////////////////////////////////////////////////////////

class RoughBot {
	constructor() {
		this.deckCards = [];
	}

	richest(otherPlayers) {
		return [...otherPlayers].sort((a, b) => b.coins - a.coins)[0];
	}

	takeOut(otherPlayers) {
		const richMofos = otherPlayers.filter((p) => p.coins >= 3);
		if (richMofos.length > 0) {
			const baller = this.richest(richMofos);
			return baller.name;
		}

		const twoCarders = otherPlayers.filter((p) => p.cards === 2);
		if (twoCarders.length > 0) {
			return twoCarders[0].name;
		}

		return otherPlayers[0].name;
	}

	hasThreeCardsKnown(myCards, discardedCards, card) {
		const knownCards = [...myCards, ...discardedCards, ...this.deckCards];
		const numKnown = knownCards.filter((c) => c === card).length;
		if (numKnown === 3) return true;
	}

	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		// console.log('MY CARDS:', myCards);

		const coup = { action: 'couping', against: this.takeOut(otherPlayers) };
		const swap = { action: 'swapping', against: null };
		const takeThree = { action: 'taking-3', against: null };
		const steal = {
			action: 'stealing',
			against: this.richest(otherPlayers).name,
		};

		if (myCoins >= 7) return coup;

		if (history.length > 0 && isFirstTurn(history, otherPlayers)) {
			if (myCards.includes('ambassador')) return swap;
			if (!myCards.includes('duke')) return swap;
		}

		if (myCards.includes('assassin') && myCoins >= 3) {
			// Has target blocked assassination before (roughly)
			const hasBlockedAssass = (player) =>
				history.some((t) => t.counter === 'contessa' && t.counterer === player);
			const targets = otherPlayers.filter((p) => !hasBlockedAssass(p.name));
			if (targets.length > 0) {
				return { action: 'assassination', against: this.takeOut(targets) };
			}
		}

		if (this.deckCards.length === 0 && myCards.includes('ambassador')) {
			return swap;
		}

		if (myCards.includes('captain')) {
			return steal;
		}

		return takeThree;
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
		if (swapsSinceAmbass(history)) {
			this.deckCards = [];
		}

		const card = getCardFor(action);
		if (this.hasThreeCardsKnown(myCards, discardedCards, card)) {
			return true;
		}

		// Last ditch effort
		if (
			action === 'assassination' &&
			toWhom === me &&
			myCards.length === 1 &&
			!myCards.includes('contessa')
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
		if (action === 'assassination' && myCards.includes('contessa')) {
			return 'contessa';
		}
		if (action === 'stealing' && myCards.includes('captain')) {
			return 'captain';
		}
		if (action === 'stealing' && myCards.includes('ambassador')) {
			return 'ambassador';
		}
		if (action === 'foreign-aid' && myCards.includes('duke')) {
			return 'duke';
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
		counterer,
	}) {
		if (this.hasThreeCardsKnown(myCards, discardedCards, card)) {
			return true;
		}
	}

	OnSwappingCards({
		history,
		myCards,
		myCoins,
		otherPlayers,
		discardedCards,
		newCards,
	}) {
		const available = [...myCards, ...newCards];
		const keeping = [];

		const index = (card) => available.indexOf(card);

		if (otherPlayers.length < 3 && index('captain') > -1) {
			keeping.push(...available.splice(index('captain'), 1));
		}

		if (index('duke') > -1) {
			keeping.push(...available.splice(index('duke'), 1));
		}

		if (keeping.length < 2 && index('assassin') > -1) {
			keeping.push(...available.splice(index('assassin'), 1));
		}

		if (keeping.length === 2) {
			this.deckCards = [...available];
			return keeping;
		}

		if (keeping.length === 1) {
			keeping.push(...available.splice(0, 1));
			this.deckCards = [...available];
			return keeping;
		}

		this.deckCards = [...newCards];
		return myCards;
	}

	OnCardLoss({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		if (myCards.includes('contessa')) return 'contessa';
		if (myCards.includes('ambassador')) return 'ambassador';
		if (myCards.includes('captain')) return 'captain';
		if (myCards.includes('assassin')) return 'assassin';
		return myCards[0];
	}
}

module.exports = exports = RoughBot;
