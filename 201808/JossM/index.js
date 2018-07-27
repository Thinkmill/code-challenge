'use strict';

const { ALLBOTS, CARDS, DECK, ACTIONS } = require('../constants.js');

function selectRandomFrom(list, padWith) {
	const idx = Math.floor(Math.random() * list.length);

	// pad out the array
	let arr = list;
	if (padWith) {
		const padding = new Array(padWith.count).fill(padWith.value);
		arr = [...padding, ...list];
	}

	return arr[idx];
}
function hasCard(card, myCards) {
	return myCards.indexOf(card) > -1;
}
function getCardCount(card, fromCards) {
	return fromCards.filter((c) => c === card).length;
}
function isCardAvailable(card, fromCards) {
	const count = getCardCount(card, fromCards);
	return count < 3;
}

class BOT {
	cacheGameState({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		// self
		this.hasAmbassador = hasCard('ambassador', myCards);
		this.hasAssassin = hasCard('assassin', myCards);
		this.hasCaptain = hasCard('captain', myCards);
		this.hasContessa = hasCard('contessa', myCards);
		this.hasDuke = hasCard('duke', myCards);

		// other
		this.playersByCoins = otherPlayers
			.sort((a, b) => a.coins - b.coins)
			.reverse();

		this.playersByCards = otherPlayers.sort((a, b) => a.cards - b.cards);
	}

	// ==============================
	// Game
	// ==============================

	OnTurn(props) {
		this.cacheGameState(props); // cache first

		// ==============================
		// setup turn
		// ==============================

		const { history, myCards, myCoins, otherPlayers, discardedCards } = props;

		// avoid attempting a coup/assassination without enough coins
		let safeActs = ACTIONS();
		if (myCoins < 7) safeActs = safeActs.filter((a) => a !== 'couping');
		if (myCoins < 3) safeActs = safeActs.filter((a) => a !== 'assassination');

		let action = selectRandomFrom(safeActs, { value: 'taking-1', count: 3 }); // pad with income to limit challenges
		let against = selectRandomFrom(otherPlayers).name;

		// ==============================
		// definitive actions
		// ==============================

		// coup as soon as possible when one other player
		if (otherPlayers.length === 1 && myCoins >= 7) {
			action = 'couping';
			against = otherPlayers[0].name;

			return { action, against };
		}

		// ==============================
		// random actions
		// ==============================

		// steal coins, favour those who have more
		if (this.hasCaptain) {
			action = 'stealing';
			against = this.playersByCoins[0].name;
		}

		// tax when possible
		if (this.hasDuke) {
			action = 'taking-3';
		}

		// assassinate when possible, favour those with fewer cards
		if (this.hasAssassin && myCoins >= 3) {
			action = 'assassination';
			against = this.playersByCards[0].name;
		}

		// must coup after 10 coins, favour those with fewer cards
		if (myCoins >= 10) {
			action = 'couping';
			against = this.playersByCards[0].name;
		}

		return { action, against };
	}

	OnChallengeActionRound({
		action,
		byWhom,
		discardedCards,
		history,
		myCards,
		myCoins,
		otherPlayers,
		toWhom,
	}) {
		const knownCards = [...myCards, ...discardedCards];
		const assassinAvailable = isCardAvailable('assassin', knownCards);
		const captainAvailable = isCardAvailable('captain', knownCards);
		const ambassadorAvailable = isCardAvailable('ambassador', knownCards);

		if (action === 'assassination' && !assassinAvailable) {
			return true;
		}
		if (action === 'stealing' && !captainAvailable) {
			return true;
		}
		if (action === 'swapping' && !ambassadorAvailable) {
			return true;
		}

		return selectRandomFrom([true], { value: false, count: 3 });
	}

	OnCounterAction({
		action,
		byWhom,
		discardedCards,
		history,
		myCards,
		myCoins,
		otherPlayers,
	}) {
		if (action === 'assassination') {
			return this.hasContessa
				? 'contessa'
				: selectRandomFrom(['contessa'], { value: false, count: 3 });
		}
		if (action === 'foreign-aid') {
			return this.hasDuke
				? 'duke'
				: selectRandomFrom(['duke'], { value: false, count: 5 });
		}

		if (action === 'stealing') {
			if (this.hasAmbassador) {
				return 'ambassador';
			}
			if (this.hasCaptain) {
				return 'captain';
			}

			return selectRandomFrom(['ambassador', 'captain'], {
				value: false,
				count: 3,
			});
		}
	}

	OnCounterActionRound({
		action,
		byWhom,
		card,
		discardedCards,
		history,
		myCards,
		myCoins,
		otherPlayers,
		toWhom,
	}) {
		const knownCards = [...myCards, ...discardedCards];
		const ambassadorAvailable = isCardAvailable('ambassador', knownCards);
		const captainAvailable = isCardAvailable('captain', knownCards);
		const contessaAvailable = isCardAvailable('contessa', knownCards);
		const dukeAvailable = isCardAvailable('duke', knownCards);

		if (action === 'foreign-aid' && !dukeAvailable) {
			return true;
		}
		if (action === 'assassination' && !contessaAvailable) {
			return true;
		}
		if (action === 'stealing' && !captainAvailable && !ambassadorAvailable) {
			return true;
		}

		return selectRandomFrom([true], { value: false, count: 3 });
	}

	OnSwappingCards({
		discardedCards,
		history,
		myCards,
		myCoins,
		newCards,
		otherPlayers,
	}) {
		const canHaveAssassin = hasCard('assassin', newCards);
		const canHaveContessa = hasCard('contessa', newCards);

		// try to gain assassin when possible
		if (!this.hasAssassin && canHaveAssassin) {
			let otherCard = myCards.filter((c) => c !== 'contessa')[0]; // avoid discarding contessa
			otherCard = otherCard || myCards[0];
			return [otherCard, 'assassin'];
		}

		// try to gain contessa when possible
		if (!this.hasContessa && canHaveContessa) {
			let otherCard = myCards.filter((c) => c !== 'assassin')[0]; // avoid discarding assassin
			otherCard = otherCard || myCards[0];
			return [otherCard, 'contessa'];
		}

		// let the universe decide whether to swap or hold...
		return Math.random() > 0.5 ? newCards : myCards;
	}

	OnCardLoss({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		if (myCards.length === 1) {
			return myCards[0];
		}

		// avoid discarding the contessa
		if (this.hasContessa) {
			let withoutContessa = myCards.filter((c) => c !== 'contessa');
			return withoutContessa.length ? withoutContessa[0] : myCards[0];
		}

		// avoid discarding the assassin
		if (this.hasAssassin) {
			let withoutAssassin = myCards.filter((c) => c !== 'assassin');
			return withoutAssassin.length ? withoutAssassin[0] : myCards[0];
		}

		// throwout whatever
		return myCards[0];
	}
}

module.exports = exports = BOT;
