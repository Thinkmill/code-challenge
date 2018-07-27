// Approx precedence of hands
const handPreferrence = [
	'assassin & duke', // 8477
	'assassin & captain', // 8449
	'captain & duke', // 8392
	'ambassador & duke', // 8302
	'captain & contessa', // 8176
	'contessa & duke', // 8170
	'assassin & contessa', // 8120
	'ambassador & captain', // 8055
	'ambassador & assassin', // 7756
	'ambassador & contessa', // 6350
	'duke & duke', // 2819
	'captain & captain', // 2781
	'ambassador & ambassador', // 2482
	'assassin & assassin', // 2373
	'contessa & contessa', // 1481
];

const cardPreferrence = [
	'duke', // 38979 ... 2819 + 2819 + 8170 + 8302 + 8392 + 8477
	'captain', // 38634 ... 2781 + 2781 + 8055 + 8176 + 8392 + 8449
	'assassin', // 37548 ... 2373 + 2373 + 7756 + 8120 + 8449 + 8477
	'ambassador', // 35427 ... 2482 + 2482 + 6350 + 7756 + 8055 + 8302
	'contessa', // 33778 ... 1481 + 1481 + 6350 + 8120 + 8170 + 8176
];

// Action requiirements
const actionCardRequirements = {
	'taking-1': null,
	'foreign-aid': null,
	couping: null,
	'taking-3': 'duke',
	assassination: 'assassin',
	stealing: 'captain',
	swapping: 'ambassador',
};

// TODO: Preceedence of operations?
let operations = [
	(args) => {
		if (args.myCoins >= 3 && args.myCards.includes('assassin')) {
			return { action: 'assassination', against: args.otherPlayers[0].name };
		}
	},
	(args) => {
		if (args.myCoins > 6) {
			return { action: 'couping', against: args.otherPlayers[0].name };
		}
	},
	// Late stage captain'ing?
	(args) => {
		if (
			args.otherPlayers.length === 1 &&
			args.myCards.includes('captain') &&
			args.otherPlayers[0].coins > 1
		) {
			return { action: 'stealing', against: args.otherPlayers[0].name };
		}
	},
	// Swap if we have two cards of the same type; so long as it's not too suspicious
	(args) => {
		if (args.myCards[0] === args.myCards[1]) return { action: 'swapping' };
	},
	(args) => {
		if (args.myCards.includes('duke')) {
			return { action: 'taking-3' };
		}
	},
	(args) => {
		if (args.myCards.includes('captain')) {
			const stealFrom = args.otherPlayers
				.filter((p) => p.coins > 2)
				.reduce((a, p) => (a ? a : p.name), '');
			if (stealFrom) return { action: 'stealing', against: stealFrom };
		}
	},
	(args) => {
		const nonEnemyDukes = []
			.concat(args.myCards, args.discardedCards)
			.filter((c) => c === 'duke');
		if (nonEnemyDukes === 3) return { action: 'foreign-aid' };
	},
	(args) => {
		if (args.myCards.includes('ambassador')) return { action: 'swapping' };
	},
	(args) => {
		return { action: 'taking-1' };
	},
];

class Sensible {
	constructor({ name }) {
		this.name = name;
		this.turnNumber = 0;
	}

	// { history, myCards, myCoins, otherPlayers, discardedCards }
	OnTurn(args) {
		this.turnNumber++;
		if (this.turnNumber === 1) {
			// console.log(`${this.name} (Sensible): I've been dealt: ${args.myCards.join(' & ')}`);
		}

		for (let op of operations) {
			const result = op(args);
			if (result) return result;
		}
	}

	// Counter the obvious stuff
	// { history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom }
	OnCounterAction(args) {
		if (args.action === 'foreign-aid' && args.myCards.includes('duke'))
			return 'duke';
		if (args.action === 'stealing' && args.myCards.includes('captain'))
			return 'captain';
		if (args.action === 'stealing' && args.myCards.includes('ambassador'))
			return 'ambassador';
		if (
			args.action === 'assassination' &&
			(args.myCards.includes('contessa') || args.myCards.length === 1)
		)
			return 'contessa';

		// If I'm one of 2 players left and being stolen from, fake a block
		if (args.action === 'stealing' && args.otherPlayers.length === 1) {
			return 'ambassador';
		}
	}

	// { history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom }
	OnChallengeActionRound(args) {
		// Is the action possible based on known cards?
		const reqCard = actionCardRequirements[args.action];
		const nonOpCards = [].concat(args.myCards, args.discardedCards);
		const couldHaveReqCard =
			!reqCard || nonOpCards.filter((c) => c === reqCard).length < 3;
		if (!couldHaveReqCard) return true;

		// If its not me being attacked or I have a counter action
		if (args.toWhom !== this.name) return false;
		if (this.OnCounterAction(args)) return false;

		// Possible chalenge for other reasons?
		return false;
	}

	// { history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom }
	// args.action is currently the original action, not the "block" action (eg. 'stealing' not block by 'captain')
	OnCounterActionRound(args) {
		const challengerCanNotHave = (reqCard) =>
			[].concat(args.myCards, args.discardedCards).filter((c) => c === reqCard)
				.length > 2;
		if (args.action === 'foreign-aid') return challengerCanNotHave('duke');
		if (args.action === 'stealing')
			return (
				challengerCanNotHave('captain') && challengerCanNotHave('ambassador')
			);
		if (args.action === 'assassination')
			return challengerCanNotHave('contessa');
		return false;
	}

	// { history, myCards, myCoins, otherPlayers, discardedCards, newCards }
	OnSwappingCards({ myCards, newCards }) {
		const allCombos = [
			myCards,
			newCards,
			[myCards[0], newCards[0]],
			[myCards[0], newCards[1]],
			[myCards[1], newCards[0]],
			[myCards[1], newCards[1]],
		];
		const validCombos = allCombos.filter(
			(p) => p.filter((c) => typeof c !== 'undefined').length === 2
		);
		const strCombos = validCombos.map((p) => p.sort().join(' & '));
		for (let pref of handPreferrence) {
			if (strCombos.includes(pref)) return pref.split(' & ');
		}
	}

	OnCardLoss({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		if (myCards.length === 1) return myCards[0];
		return cardPreferrence.indexOf(myCards[0]) >
			cardPreferrence.indexOf(myCards[1])
			? myCards[0]
			: myCards[1];
	}
}

module.exports = exports = Sensible;
