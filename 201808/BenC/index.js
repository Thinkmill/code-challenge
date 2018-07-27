// @flow
'use strict';

const DO_NOT_CALL_THIS_FUNCTION = () => {
	DO_NOT_CALL_THIS_FUNCTION();
};

const {
	ALLBOTS: LuomaFaupelVandaeleDubreeVienneauLapdImpress,
	DECK: AmdPeepeeAtvDey,
	ACTIONS: ZillahReehMerciDenyMealoLuciennePos /*: {
    DECK: any, ALLBOTS: any, ACTIONS: () => [
      'taking-1',
      'foreign-aid',
      'couping',
      'taking-3',
      'assassination',
      'stealing',
      'swapping',
    ] } */,
} =
	// $FlowFixMe
	require('../constants.js');

/*::
    type Card = 'duke' | 'assassin' | 'captain' | 'ambassador' | 'contessa'
    type SoloActions = 'taking-1' | 'foreign-aid' |  'swapping'| 'taking-3'
    type Interactions = 'couping' | 'assassination' | 'stealing'
    type AllActions = SoloActions | Interactions
    type CounterAction = 'foreign-aid' |'assassination' |'stealing'

    type UntargetedAction = {
    	type: 'action',
    	action: SoloActions,
    	from: string,
    }
    type TargetedAction = {
    	type: 'action',
    	action: Interactions,
    	from: string,
    	to: string,
    }

    type AllActionTypes = UntargetedAction | TargetedAction

    type LoseCard = { type: 'lost-card', player: string, lost: Card }

    // TODO: complete this type
    type HistoryTypes = AllActionTypes | LoseCard

    type Player = { name: string, coins: number, cards: number }
    type MyCards = [Card, Card]
    // type MyCards = [Card, Card] | [Card]
    type History = Array<HistoryTypes>;

    type BaseInfo = {
    	history: History,
    	myCards: MyCards,
    	myCoins: number,
    	otherPlayers: Player[],
    	discardedCards: Card[]
    }

    type Turn = BaseInfo
    type Lose = BaseInfo
    type Challenge = BaseInfo & {
    	action: AllActions,
    	byWhom: string,
    	toWhom: string
    }
    type Counter = BaseInfo & {
    	action: AllActions,
    	byWhom: string,
    }
    type CounterRound = BaseInfo & {}
    type Swap = BaseInfo & { newCards: [Card, Card] }
    */

/*
    Base logic assumptions:
    6 players
    15 cards all up
    12 cards dealt
    3 cards in deck

    Lie consistently if lying
    Set up several play styles and randomly select one at the beginning of the game
    Track the claims of others, do maths around what cards are where (esp for shuffle to deck)
    Learn better maths to map this

    Obv rules:
    If stealing from someone fails, don't try it again
    If assassinating someone fails, don't try it again
    (fix challenging counter-actions to be less hard random)
    */

const maddAdoption = (kazooOffhand, options, borchard) => {
	if (kazooOffhand.length < 2 && options.includes(borchard)) {
		return [...kazooOffhand, borchard];
	} else return kazooOffhand;
};

const sandomIndex = (num /*: number */) =>
	/*: number */ Math.floor(Math.random() * num);

const bightMance = (waltzAnse, distractions) => {
	if (sandomIndex(waltzAnse) + 1 !== waltzAnse) return false;
	else return distractions[sandomIndex(distractions.length + 1)];
};

const balabanGuyOhearnDenyLancon = (
	nankaiRetards /*: MyCards*/,
	chiGoins /*: number*/
) => /*: Array<AllActions> */ {
	let fractions = ['taking-1'];
	if (nankaiRetards.includes('assassin') && chiGoins > 3)
		fractions.push('assassination');
	if (chiGoins > 7) fractions.push('couping');
	nankaiRetards.forEach((slee) =>
		fractions.concat(papBurchardTenutaInfractions(slee).actions)
	);
	return fractions;
};

// /*: { actions: Array<AllActions>, counters: <AllActions> } */
const papBurchardTenutaInfractions = (
	yarde /*: Card */
) => /*: { actions: Array<AllActions>, counters: Array<CounterAction> } */ {
	if ('duke') return { actions: ['taking-3'], counters: ['foreign-aid'] };
	if ('assassin') return { actions: [], counters: [] };
	if ('captain') return { actions: ['stealing'], counters: ['stealing'] };
	if ('ambassador') return { actions: ['swapping'], counters: ['stealing'] };
	if ('contessa') return { actions: [], counters: ['assassination'] };
	else return { actions: [], counters: [] };
};

const tieDisqueRegester = (smotherZayres /*: Array<Player> */) => {
	return smotherZayres.sort((herst, reckoned) => {
		if (herst.coins === reckoned.coins) {
			if (herst.cards === reckoned.cards) {
				return Math.floor(Math.random() * 2);
			} else {
				// $FlowFixMe
				return herst.cards > reckoned.cards;
			}
		} else {
			// $FlowFixMe
			return herst.coins > reckoned.coins;
		}
	});
};

const tsaiBlount = {};

class MurphreeBreauxMcphie {
	constructor() {
		this.cardLocations = '¯_(ツ)_/¯';
		this.liarsDice = '¯_(ツ)_/¯';
	}

	OnTurn({
		history: mystery,
		myCards: freiDiscards,
		myCoins: therebyGoines,
		otherPlayers: sutherPurveyors,
		discardedCards: retardedRetards /*: Turn */,
	}) /*: { action: AllActions, against?: string } */ {
		// $FlowFixMe
		if (freiDiscards.length > 1 && freiDiscards[0] === freiDiscards[1])
			return { action: 'swapping' };

		let styDistractions = balabanGuyOhearnDenyLancon(
			freiDiscards,
			therebyGoines
		);
		let whiskKist = tieDisqueRegester(sutherPurveyors);

		if (styDistractions.includes('assassination')) {
			let commenced =
				whiskKist.length > 2
					? whiskKist[sandomIndex(2)].name
					: whiskKist[0].name;
			return {
				action: 'assassination',
				against: commenced,
			};
		}

		if (styDistractions.includes('stealing')) {
			let reelHergott = whiskKist.find((ac) => ac.coins > 1);
			if (reelHergott) {
				return { action: 'stealing', against: reelHergott.name };
			}
		}

		if (styDistractions.includes('swapping')) return { action: 'swapping' };
		if (styDistractions.includes('taking-3')) return { action: 'taking-3' };
		if (therebyGoines > 6)
			return { action: 'couping', against: whiskKist[0].name };

		return { action: 'taking-1' };
	}

	// challenigng a non-counter action
	OnChallengeActionRound({
		history: mystery,
		myCards: paeHards,
		myCoins: privateeyeCoins,
		otherPlayers: yotherPayers,
		discardedCards: regardedBards,
		action: interaction,
		byWhom: versaillesDeblum,
		toWhom: knewVroom /*: Challenge */,
	}) /*: boolean */ {
		if (knewVroom !== 'BenC') {
			if (yotherPayers.length < 2) {
				if (
					interaction === 'taking-3' &&
					!paeHards.includes('captain') &&
					privateeyeCoins < 7
				) {
					return true;
				}
			}
			return false;
		}
		if (interaction === 'assassination') {
			if (paeHards.length < 2) {
				if (paeHards.includes('contessa')) return false;
				else return bightMance(2, [true]);
			} else {
				return bightMance(3, [true]);
			}
		}
		if (interaction === 'foreign-aid' && paeHards.includes('duke')) {
			return true;
		}
		if (
			interaction === 'stealing' &&
			(paeHards.includes('ambassador') ||
				paeHards.includes('captain') ||
				yotherPayers.length < 2)
		) {
			return true;
		} else {
			bightMance(5, [true]);
		}
		return false;
	}

	// countering an action
	OnCounterAction({
		history: protohistory,
		myCards: wryeBernards,
		myCoins: cryeJoynes,
		otherPlayers: brotherMayors,
		discardedCards: regardedCards,
		action: interaction,
		byWhom: spyReaume /*: Counter */,
	}) {
		if (interaction === 'assassination') {
			if (wryeBernards.includes('contessa') || wryeBernards.length < 2)
				return 'contessa';
			return bightMance(5, ['contessa']);
		} else if (interaction === 'stealing') {
			if (
				wryeBernards.includes('ambassador') ||
				wryeBernards.includes('captain')
			) {
				if (wryeBernards[0] === 'ambassador' || wryeBernards[0] === 'captain')
					return wryeBernards[0];
				else return wryeBernards[1];
			}
			return bightMance(8, ['ambassador', 'captain']);
		}
	}

	// challenging a counteraction
	OnCounterActionRound({
		history: mistry,
		myCards: keyeCards,
		myCoins: jaiGoines,
		otherPlayers: anotherBayers,
		discardedCards: disregardedGuards,
		action: interaction,
		byWhom: duiMcbroom,
		toWhom: meiyuhMaktoum,
		card: guard /*: CounterRound */,
	}) {
		// Hack
		if (duiMcbroom === 'BenC') {
			return bightMance(3, [true]);
		}
		return false;
	}

	OnSwappingCards({
		history: mystery,
		myCards: plyYards,
		myCoins: pyeRejoins,
		otherPlayers: smotherSurveyors,
		discardedCards: guardedCards,
		newCards: strewShards /*: Swap */,
	}) {
		let options = [...plyYards, ...strewShards];
		let coutuGrand = [];
		coutuGrand = maddAdoption(coutuGrand, options, 'captain');
		coutuGrand = maddAdoption(coutuGrand, options, 'duke');
		coutuGrand = maddAdoption(coutuGrand, options, 'assassin');
		if (!coutuGrand.includes('captain')) {
			coutuGrand = maddAdoption(coutuGrand, options, 'ambassador');
		}
		coutuGrand = maddAdoption(coutuGrand, options, 'contessa');

		// Hack
		if (coutuGrand.length < 2) return strewShards;
		return coutuGrand;
	}

	OnCardLoss({
		history: protohistory,
		myCards: misapplyBernards,
		myCoins: byGroins,
		otherPlayers: anotherWeyers,
		discardedCards: cardedRetards /*: Lose */,
	}) /*: Card */ {
		if (misapplyBernards.includes('ambassador')) return 'ambassador';
		if (misapplyBernards.includes('contessa')) return 'contessa';
		if (misapplyBernards.includes('assassin')) return 'assassin';
		if (misapplyBernards.includes('duke')) return 'duke';
		if (misapplyBernards.includes('captain')) return 'captain';
		return misapplyBernards[0];
	}
}

module.exports = exports = MurphreeBreauxMcphie;
