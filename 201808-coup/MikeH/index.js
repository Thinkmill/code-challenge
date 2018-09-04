'use strict';
const MY_NAME = 'MikeH';

const CARDS_IN_DECK = 5 * 3;
const { ALLBOTS, CARDS } = require('../constants.js');

const ACTIONS = [
	{
		key: 'taking-1',
		income: 1,
		cost: 0,
		priority: 6,
		requiredCard: false,
		blockableBy: [],
	},
	{
		key: 'foreign-aid',
		income: 2,
		cost: 0,
		priority: 5,
		requiredCard: false,
		blockableBy: ['duke'],
	},
	{
		key: 'couping',
		income: 0,
		cost: 7,
		priority: 2,
		requiredCard: false,
		blockableBy: [],
	},
	{
		key: 'taking-3',
		income: 3,
		cost: 0,
		priority: 3,
		requiredCard: 'duke',
		blockableBy: [],
	},
	{
		key: 'assassination',
		income: 0,
		cost: 3,
		priority: 1,
		requiredCard: 'assassin',
		blockableBy: ['contessa'],
	},
	{
		key: 'swapping',
		income: 0,
		cost: 0,
		priority: 7,
		requiredCard: 'ambassador',
		blockableBy: [],
	},
	{
		key: 'stealing',
		income: 0,
		cost: 2,
		priority: 4,
		requiredCard: 'captain',
		blockableBy: ['captain', 'ambassador'],
	},
];

class BOT {
	constructor() {
		this.gameState = null;
	}

	initialiseState(allPlayers) {
		const playerCount = allPlayers.length;
		this.gameState = {
			lastEvent: 0,
			players: allPlayers.reduce((acc, player) => {
				acc[player.name] = {
					hasLied: false, // by looking at challange events
					hasAttackedMe: false, // by looking at actions and challanges
					claimsToHave: [], // by looking at actions and counters
				};
				return acc;
			}, {}),
		};
	}

	updateState({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		if (!this.gameState) this.initialiseState(otherPlayers);

		const eventsToProcess = history.slice(this.gameState.lastEvent);
		eventsToProcess.forEach((e) => {
			this.processEvent(e);
		});
	}

	processEvent(event) {
		this.gameState.lastEvent++;
		// penalty events don't tell me anything
		if (event.type === 'penalty') return;

		if (event.type === 'action') {
			const action = ACTIONS.find((a) => a.key === event.action);
			const playerName = event.from;
			const targetName = event.to;
			const player = this.gameState.players[playerName];
			if (!player) return;
			if (targetName === MY_NAME) player.hasAttackedMe = true;
			if (action.requiredCard) player.claimsToHave.push(action.requiredCard);
			return;
		}

		if (event.type === 'lost-card') {
			const playerName = event.player;
			const lostCard = event.lost;
			const player = this.gameState.players[playerName];
			if (!player) return;
			player.claimsToHave = player.claimsToHave.filter((c) => c !== lostCard);
		}

		if (event.type === 'counter-action') {
			// The challenger claims to have a counter action card...
			const action = ACTIONS.find((a) => a.key === event.action);
			const counterer = this.gameState.players[event.counterer];
			if (!counterer) return;
			counterer.claimsToHave = counterer.claimsToHave.concat(event.counter);
		}

		if (event.type === 'challenge-round') {
			// Challange
			const player = this.gameState.players[event.challengee];
			if (!player) return;
			if (event.lying) player.hasLied = true;
			// remove the required card from player's claimsToHave
			const action = ACTIONS.find((a) => a.key === event.action);
			const cardToRemove = action.requiredCard;
			player.claimsToHave = player.claimsToHave.filter(
				(c) => c !== cardToRemove
			);
		}

		if (event.type === 'counter-round') {
			// Counter Challange
			const player = this.gameState.players[event.challengee];
			if (!player) return;
			if (event.lying) player.hasLied = true;
			// remove the required card from player's claimsToHave
			const action = ACTIONS.find((a) => a.key === event.action);
			const cardToRemove = action.requiredCard;
			player.claimsToHave = player.claimsToHave.filter(
				(c) => c !== cardToRemove
			);
		}
	}

	chanceOfCard(
		targetCard,
		playerNames,
		{ discardedCards, myCards, otherPlayers }
	) {
		// The ones we know about
		const discardedTC = discardedCards.filter((c) => c === targetCard).length;
		const myTC = myCards.filter((c) => c === targetCard).length;
		const availableTC = 3 - discardedTC - myTC;
		if (availableTC === 0) return 0;
		// The ones we're not sure about
		const claimingTC = otherPlayers.filter(
			(p) =>
				playerNames.includes(p.name) &&
				this.gameState.players[p.name].claimsToHave.includes(targetCard)
		).length;

		const remainingCards = CARDS_IN_DECK - discardedCards.length;
		// what is the total number of cards the other players hold
		const sumCards = otherPlayers.reduce((acc, p) => {
			if (playerNames.includes(p.name)) return acc + p.cards;
			return acc;
		}, 0);
		const chance = (availableTC / remainingCards) * sumCards + 0.1 * claimingTC;
		return chance;
	}

	OnTurn({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		this.updateState({
			history,
			myCards,
			myCoins,
			otherPlayers,
			discardedCards,
		});

		// Determine possible actions (without lying)
		const possibleActions = ACTIONS.filter((a) => {
			// Do I have enough coins?
			if (a.cost > myCoins) return false;

			// Do I have the required cards
			if (a.requiredCard) {
				return myCards.includes(a.requiredCard);
			}
			return true;
		}, []);

		// Determine best action to take.
		const priorityActions = possibleActions.sort(
			(a, b) => a.priority - b.priority
		);

		let against;
		let action;

		// Always coop if we can
		if (myCoins > 6) {
			action = 'couping';
			// Prioritise player with less cards or more coins
			// Also, anyone who has attacked me
			const targetPlayer = otherPlayers.reduce((acc, p) => {
				const player = {
					...p,
					...this.gameState.players[p.name],
				};
				if (!acc) return player;
				// Lets be vindictive
				if (player.hasAttackedMe && !acc.hasAttackedMe) return player;
				if (player.cards < acc.cards) return player;
				if (player.coins > acc.coins) return player;
				return acc;
			}, null);
			against = targetPlayer.name;
		} else {
			const playerWithMostCardsAndCoins = (acc, player) => {
				if (!acc) return player;
				if (player.coins > acc.coins) return player;
				if (player.cards > acc.cards) return player;
				return acc;
			};

			const actionObj = priorityActions.find((a) => {
				let targetPlayer;
				let worthyTargets;

				switch (a.key) {
					case 'stealing':
						// target player who does not have a captain/ambassador
						worthyTargets = otherPlayers.filter((p) => {
							const player = {
								...p,
								...this.gameState.players[p.name],
							};

							return (
								player.coins > 1 &&
								!player.claimsToHave.includes('ambassador') &&
								!player.claimsToHave.includes('captain')
							);
						});

						targetPlayer = worthyTargets.reduce(
							playerWithMostCardsAndCoins,
							null
						);

						// There is no-one to target. Do something else.
						if (!targetPlayer) return false;

						// We choose this steal!
						against = targetPlayer.name;
						return true;
					case 'assassination':
						// target player who does not have a contessa
						worthyTargets = otherPlayers.filter((p) => {
							const player = {
								...p,
								...this.gameState.players[p.name],
							};
							return !player.claimsToHave.includes('contessa');
						});

						targetPlayer = worthyTargets.reduce(
							playerWithMostCardsAndCoins,
							null
						);

						// There is no-one to target. Do something else.
						if (!targetPlayer) return false;

						// We choose to assassinate!!!
						against = targetPlayer.name;
						return true;
					case 'foreign-aid':
						// we should avoid this if there is a high chance that someone
						// in the game has a duke.
						const chanceOfDuke = this.chanceOfCard(
							'duke',
							otherPlayers.map((p) => p.name),
							{ discardedCards, myCards, otherPlayers }
						);

						if (chanceOfDuke > 0.5) return false;
						return true;
					default:
						// Choose a target for any case not implemented.
						// One with the most coins or fewest cards
						targetPlayer = otherPlayers.reduce(
							playerWithMostCardsAndCoins,
							null
						);
						against = targetPlayer.name;
						return true; // We choose this action!!!
				}
			});
			action = actionObj.key;
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
		this.updateState({
			history,
			myCards,
			myCoins,
			otherPlayers,
			discardedCards,
		});
		if (action === 'assassination' && toWhom === MY_NAME) {
			const hasContessa = myCards.includes('contessa');
			const onLastCard = myCards.length === 1;
			// don't challange if I have a contessa
			// do challange if I'm on my last card
			// TODO: we should lie sometimes
			if (!hasContessa && onLastCard) return true;
		}

		if (action === 'stealing' && toWhom === MY_NAME) {
			// if I have no coins, let it slide
			if (myCoins === 0) return false;
			// if I have the ambassador or captain, let it slide, I'll block in OnCounterAction
			if (myCards.includes('ambassador') || myCards.includes('captain'))
				return false;
			// otherwise ... toss a coin.
			const chanceOfCap = this.chanceOfCard('captain', [byWhom], {
				myCards,
				otherPlayers,
				discardedCards,
			});
			if (chanceOfCap < 0.2) return true;
		}

		if (action === 'taking-3') {
			const chanceOfDuke = this.chanceOfCard('duke', [byWhom], {
				myCards,
				otherPlayers,
				discardedCards,
			});
			if (chanceOfDuke === 0) return true;
		}

		if (action === 'swapping') {
			const chanceOfAmbassador = this.chanceOfCard('ambassador', [byWhom], {
				myCards,
				otherPlayers,
				discardedCards,
			});
			if (chanceOfAmbassador === 0) return true;
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
		this.updateState({
			history,
			myCards,
			myCoins,
			otherPlayers,
			discardedCards,
		});
		if (action === 'assassination') {
			const hasContessa = myCards.includes('contessa');
			return hasContessa ? 'contessa' : false;
		}

		if (action === 'stealing') {
			const counterCard = myCards.find(
				(c) => c === 'ambassador' || c === 'captain'
			);
			return counterCard ? counterCard : false;
		}

		if (action === 'foreign-aid') {
			// Do I have a duke
			const counterCard = myCards.find((c) => c === 'duke');
			return counterCard ? counterCard : false;
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
		this.updateState({
			history,
			myCards,
			myCoins,
			otherPlayers,
			discardedCards,
		});
		if (byWhom === MY_NAME) return false;

		// Do we think they have the card?
		const chanceOfCard = this.chanceOfCard(card, [byWhom], {
			discardedCards,
			myCards,
			otherPlayers,
		});
		if (chanceOfCard === 0) return true;

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
		this.updateState({
			history,
			myCards,
			myCoins,
			otherPlayers,
			discardedCards,
		});
		return newCards;
	}

	OnCardLoss({ history, myCards, myCoins, otherPlayers, discardedCards }) {
		this.updateState({
			history,
			myCards,
			myCoins,
			otherPlayers,
			discardedCards,
		});

		if (myCards.length == 1) {
			return myCards[0];
		}

		const cardPriority = [
			'contessa',
			'duke',
			'assassin',
			'captain',
			'ambassador',
		];
		const c0 = cardPriority.indexOf(myCards[0]);
		const c1 = cardPriority.indexOf(myCards[1]);

		return c0 > c1 ? myCards[0] : myCards[1];
	}
}

module.exports = exports = BOT;
