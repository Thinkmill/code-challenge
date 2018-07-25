'use strict';

const ME = 'TimL';

const count = (card, cards) => cards.filter(c => c === card).length;

const cardFor = action => ({
	'taking-3': 'duke',
	'assassination': 'assassin',
	'stealing': 'captain',
	'swapping': 'ambassador',
	}[action]);

const blockersFor = action => ({
	'assassination': ['contessa'],
	'stealing': ['captain', 'ambassador'],
	'foreign-aid': ['duke']
	}[action] || []);

const reformatHistory = (history) => {
	const newHistory = [];
	let currentTurn = [];
	history.forEach(record => {
		if (record.type === 'action' && currentTurn.length > 0) {
			newHistory.push(currentTurn);
			currentTurn = []
		}
		currentTurn.push(record);
	});
	return newHistory
};

const hasPlayerBlocked = (history, action, from) => {
	return history.some(turn =>
		 (turn.find(record => record.type === 'action' && record.action === action) &&
 			turn.find(record => record.type === 'counter-action' && record.counterer !== ME && (from === undefined || record.counterer === from)))
	);
}

const safeish = (history, visibleCards, action, against) => {
	return blockersFor(action).every(c => count(c, visibleCards) === 3) || !hasPlayerBlocked(history, action, against);
}

const sortCards = (cards) => {
	const order = {
		'duke': 0,
		'captain': 1,
		'contessa': 2,
		'ambassador': 3,
		'assassin': 4,
	}
	const inverseOrder = Object.entries(order).reduce((o, [k, v]) => ({...o, [v]: k}), {});
	return cards.map(c => order[c]).sort().map(x => inverseOrder[x]);
}

const findTargets = players => players.map(p => [p.coins * p.cards, p]).sort((a, b) => b[0] - a[0]).map(x=>x[1]);

class BOT {
	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		const targets = findTargets(otherPlayers);
		let target = targets[0];
		const visibleCards = [...myCards, ...discardedCards];
		history = reformatHistory(history);

		let action;
		if (myCards.includes(cardFor('assassination')) && myCoins >= 3 && safeish(history, visibleCards, 'assassination', target.name)) {
			action = 'assassination';
		} else if( myCoins >= 7 ) {
			action = 'couping';
		} else if (myCards.includes(cardFor('taking-3'))) {
			action = 'taking-3';
		} else if (myCards.includes(cardFor('swapping'))) {
			action = 'swapping';
		} else if (myCards.includes(cardFor('stealing')) && safeish(history, visibleCards, 'stealing', target.name) && target.coins >= 2) {
			action = 'stealing';
		} else if (safeish(history, visibleCards, 'foreign-aid')) {
			action = 'foreign-aid';
		} else {
			action = 'taking-1';
		}

		return {
			action,
			against: target.name,
		};
	}

	OnChallengeActionRound({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom}) {
		// If they're obviously bullshitting, call them
		return count(cardFor(action), [...myCards, ...discardedCards]) === 3;
	}

	OnCounterAction({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom }) {
		// If we can counter this, then do counter this.
		const match = blockersFor(action).find(c => myCards.includes(c));
		if (match) {
			return match;
		}

		// If we're gonna be dead, fight it!
		if (action === 'assassination' && myCards.length === 1) {
			return 'contessa';
		}
		return false;
	}

	OnCounterActionRound({ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom, card }) {
		// If they're obviously bullshitting, call them
		return count(card, [...myCards, ...discardedCards]) === 3;
	}

	OnSwappingCards({ history, myCards, myCoins, otherPlayers, discardedCards, newCards }) {
		// Pick the best two non-identical cards
		const sorted = sortCards([...myCards, ...newCards]);
		const first = sorted[0];
		return myCards.length === 1 ? [first] : [first, sorted.find(c => c !== first) || first];
	}

	OnCardLoss({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		return sortCards([...myCards]).slice(-1)[0];
	}
}


module.exports = exports = BOT;
