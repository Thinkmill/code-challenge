'use strict';

const { Style } = require('./helper.js');
const Fs = require('fs');
let {
	ALLBOTS,
	CARDS,
	DECK,
	ACTIONS,
} = require('./constants.js');

// making clones so the bots don't break them
ALLBOTS = ALLBOTS();
CARDS = CARDS();
DECK = DECK();
ACTIONS = ACTIONS();


class COUP {
	constructor() {
		// yes globals(sorta); sue me!
		this.HISTORY = [];
		this.DISCARDPILE = [];
		this.BOTS = {};
		this.PLAYER = {};
		this.DECK = DECK.slice( 0 );
		this.TURN = 0;
		this.ROUNDS = 0;
		this.ALLPLAYER = [];
	}

	Play( allPlayer ) {
		console.log(
			`\n\n` +
			`   ██████${Style.yellow('╗')}  ██████${Style.yellow('╗')}  ██${Style.yellow('╗')}   ██${Style.yellow('╗')} ██████${Style.yellow('╗')}\n` +
			`  ██${Style.yellow('╔════╝')} ██${Style.yellow('╔═══')}██${Style.yellow('╗')} ██${Style.yellow('║')}   ██${Style.yellow('║')} ██${Style.yellow('╔══')}██${Style.yellow('╗')}\n` +
			`  ██${Style.yellow('║')}      ██${Style.yellow('║')}   ██${Style.yellow('║')} ██${Style.yellow('║')}   ██${Style.yellow('║')} ██████${Style.yellow('╔╝')}\n` +
			`  ██${Style.yellow('║')}      ██${Style.yellow('║')}   ██${Style.yellow('║')} ██${Style.yellow('║')}   ██${Style.yellow('║')} ██${Style.yellow('╔═══╝')}\n` +
			`  ${Style.yellow('╚')}██████${Style.yellow('╗')} ${Style.yellow('╚')}██████${Style.yellow('╔╝')} ${Style.yellow('╚')}██████${Style.yellow('╔╝')} ██${Style.yellow('║')}\n` +
			`   ${Style.yellow('╚═════╝  ╚═════╝   ╚═════╝  ╚═╝')} v0.0.1\n` +
			`\n`
		);

		this.ALLPLAYER = allPlayer;

		this.GetBots();
		this.MakePlayers();
		this.HandOutCards();
		this.ElectStarter();

		// this is the game loop
		return this.Turn();
	}

	GetBots( player ) {
		try {
			this.ALLPLAYER.forEach( player => {
				const bot = require(`./${ player }/index.js`);
				this.BOTS[ player ] = new bot();

				if(
					!this.BOTS[ player ].OnTurn ||
					!this.BOTS[ player ].OnChallengeActionRound ||
					!this.BOTS[ player ].OnCounterAction ||
					!this.BOTS[ player ].OnCounterActionRound ||
					!this.BOTS[ player ].OnSwappingCards ||
					!this.BOTS[ player ].OnCardLoss
				) {
					const missing = ['OnTurn', 'OnChallengeActionRound', 'OnCounterAction', 'OnCounterActionRound', 'OnSwappingCards', 'OnCardLoss']
						.filter( method => !Object.keys( this.BOTS[ player ] ).includes( method ) );

					throw(`🚨  ${ Style.red('The bot ') }${ Style.yellow( player ) }${ Style.red(` is missing ${ missing.length > 1 ? 'methods' : 'a method' }: `) }${ Style.yellow( missing.join(', ') ) }!\n`);
				}
			});
		}
		catch( error ) {
			console.error( error );
			process.exit( 1 );
		}
	}


	MakePlayers( players ) {
		players = this.ShufflePlayer( this.ALLPLAYER );

		players.forEach( player => {
			this.PLAYER[ player ] = {
				card1: void(0),
				card2: void(0),
				coins: 0,
			};
		});
	}


	ShuffleCards() {
		this.DECK = this.DECK
			.filter( item => item !== undefined )
			.map( item => [ Math.random(), item ] )
			.sort( ( a, b ) => a[ 0 ] - b[ 0 ] )
			.map( item => item[ 1 ] );
	}


	ShufflePlayer( player ) {
		return player
			.filter( item => item !== undefined )
			.map( item => [ Math.random(), item ] )
			.sort( ( a, b ) => a[ 0 ] - b[ 0 ] )
			.map( item => item[ 1 ] );
	}


	HandOutCards() {
		this.ShuffleCards();

		Object
			.entries( this.PLAYER )
			.forEach( ([ key, value ]) => {
				this.PLAYER[ key ].card1 = this.DECK.pop();
				this.PLAYER[ key ].card2 = this.DECK.pop();
			});
	}


	GetCardFromDeck() {
		const newCard = this.DECK.pop();

		if( !newCard && this.DECK.length > 0 ) {
			return this.GetCardFromDeck();
		}
		else {
			return newCard;
		}
	}


	ExchangeCard( card ) {
		this.DECK.push( card );
		this.ShuffleCards();

		return this.GetCardFromDeck();
	}


	SwapCards({ chosenCards = [], newCards, player }) {
		let oldCards = [];
		if( this.PLAYER[ player ].card1 ) oldCards.push( this.PLAYER[ player ].card1 );
		if( this.PLAYER[ player ].card2 ) oldCards.push( this.PLAYER[ player ].card2 );

		let allCards = oldCards.slice( 0 );
		if( newCards[ 0 ] ) allCards.push( newCards[ 0 ] );
		if( newCards[ 1 ] ) allCards.push( newCards[ 1 ] );

		chosenCards = chosenCards
			.filter( card => allCards.includes( card ) )
			.slice( 0, oldCards.length );

		this.PLAYER[ player ].card1 = chosenCards[ 0 ];
		this.PLAYER[ player ].card2 = chosenCards[ 1 ];

		allCards
			.filter( card => {
				if( card && card === chosenCards[ 0 ] ) {
					chosenCards[ 0 ] = void(0);
					return false;
				}
				if( card && card === chosenCards[ 1 ] ) {
					chosenCards[ 1 ] = void(0);
					return false;
				}
				return true;
			})
			.map( card => this.DECK.push( card ) );
	}


	StillAlive( player ) {
		let cards = 0;
		if( this.PLAYER[ player ].card1 ) cards ++;
		if( this.PLAYER[ player ].card2 ) cards ++;

		return cards > 0;
	}


	ElectStarter() {
		this.TURN = Math.floor( Math.random() * Object.keys( this.PLAYER ).length );
	}


	GetWhosNext() {
		this.TURN++;

		if( this.TURN > Object.keys( this.PLAYER ).length - 1 ) {
			this.TURN = 0;
		}

		if( this.PLAYER[ Object.keys( this.PLAYER )[ this.TURN ] ].card1 || this.PLAYER[ Object.keys( this.PLAYER )[ this.TURN ] ].card2 ) {
			return this.TURN;
		}
		else {
			return this.GetWhosNext();
		}
	}


	WhoIsLeft() {
		return Object
			.keys( this.PLAYER )
			.filter( player => this.PLAYER[ player ].card1 || this.PLAYER[ player ].card2 );
	}


	GetPlayerObjects( players, filter = '' ) {
		return players
			.filter( user => user !== filter )
			.map( player => {
				let cards = 0;
				if( this.PLAYER[ player ].card1 ) cards ++;
				if( this.PLAYER[ player ].card2 ) cards ++;

				return {
					name: player,
					coins: this.PLAYER[ player ].coins,
					cards,
				};
			});
	}

	GetGameState( player ) {
		return {
			history: this.HISTORY.slice( 0 ),
			myCards: this.GetPlayerCards( player ),
			myCoins: this.PLAYER[ player ].coins,
			otherPlayers: this.GetPlayerObjects( this.WhoIsLeft(), player ),
			discardedCards: this.DISCARDPILE.slice( 0 ),
		}
	}

	Wait( time ) {
		return new Promise( resolve => setTimeout( resolve, time ) );
	}


	GetAvatar( player ) {
		if( !player ) {
			return player;
		}
		else if( !this.ALLPLAYER.includes( player ) ) {
			return `[${ Style.yellow(`${ player }`)} -not found-]`;
		}
		else {
			return Style.yellow(`[${ player } `) +
				// `${ this.PLAYER[ player ].card1 ? `${ Style.red( this.PLAYER[ player ].card1.substring( 0, 2 ) ) } ` : '' }` +
				// `${ this.PLAYER[ player ].card2 ? `${ Style.red( this.PLAYER[ player ].card2.substring( 0, 2 ) ) } ` : '' }` +
				`${ this.PLAYER[ player ].card1 ? Style.red('♥') : '' }` +
				`${ this.PLAYER[ player ].card2 ? Style.red('♥') : '' }` +
				` ${ Style.yellow(`💰 ${ this.PLAYER[ player ].coins }]`) }`;
		}
	}


	GetPlayerCards( player ) {
		const myCards = [];
		if( this.PLAYER[ player ].card1 ) myCards.push( this.PLAYER[ player ].card1 );
		if( this.PLAYER[ player ].card2 ) myCards.push( this.PLAYER[ player ].card2 );
		return myCards;
	}


	LosePlayerCard( player, card ) {
		let lost = '';

		if( this.PLAYER[ player ].card1 === card ) {
			lost = this.PLAYER[ player ].card1;
			this.PLAYER[ player ].card1 = void( 0 );
		}
		else if( this.PLAYER[ player ].card2 === card ) {
			lost = this.PLAYER[ player ].card2;
			this.PLAYER[ player ].card2 = void( 0 );
		}

		this.HISTORY.push({
			type: 'lost-card',
			player,
			lost,
		});

		this.DISCARDPILE.push( lost );

		let lives = 0;
		if( this.PLAYER[ player ].card1 ) lives ++;
		if( this.PLAYER[ player ].card2 ) lives ++;

		console.log(`${ lives > 0 ? '💔' : '☠️' }  ${ this.GetAvatar( player ) } has lost the ${ Style.yellow( lost ) }`);
	}


	Penalty( player, reason ) {
		let penalty = '';

		const lostCard = this.BOTS[ player ].OnCardLoss({
			...this.GetGameState(player),
		});

		const _validCard = [ this.PLAYER[ player ].card1, this.PLAYER[ player ].card2 ].includes( lostCard ) && lostCard;

		if( _validCard && this.PLAYER[ player ].card1 === lostCard || !_validCard && this.PLAYER[ player ].card1 ) {
			penalty = this.PLAYER[ player ].card1;
		}
		else if( _validCard && this.PLAYER[ player ].card2 === lostCard || !_validCard && this.PLAYER[ player ].card2 ) {
			penalty = this.PLAYER[ player ].card2;
		}

		console.log(`🚨  ${ this.GetAvatar( player ) } was penalised because ${ Style.yellow( reason ) }`);
		this.LosePlayerCard( player, penalty );
	}


	ResolveChallenge({ challenger, byWhom, card, action, type, target, counterer }) {
		const challengeTypes = {
			'challenge-round': 'OnChallengeActionRound',
			'counter-round': 'OnCounterActionRound',
		};

		const challengee = target;

		if( this.BOTS[ challenger ][ challengeTypes[ type ] ]({
			...this.GetGameState(challenger),
			action,
			byWhom: byWhom ? byWhom : challenger,
			toWhom: target,
			counterer,
			card,
		}) ) {
			const lying = this.PLAYER[ challengee ].card1 !== card && this.PLAYER[ challengee ].card2 !== card;

			this.HISTORY.push({
				type,
				challenger: challenger,
				player: challengee,
				action: action,
				lying: lying,
			});

			console.log(`❓  ${ this.GetAvatar( challengee ) } was challenged by ${ this.GetAvatar( challenger ) }`);

			if( lying ) {
				this.HISTORY.push({
					type: 'penalty',
					player: challengee,
				});

				this.Penalty( challengee, 'of lying' );

				return true;
			}
			else {
				this.HISTORY.push({
					type: 'penalty',
					from: challenger,
				});

				this.Penalty( challenger, `of challenging ${ this.GetAvatar( challengee ) } unsuccessfully` );
				const newCard = this.ExchangeCard( card );

				if( this.PLAYER[ challengee ].card1 === card ) this.PLAYER[ challengee ].card1 = newCard;
				else if( this.PLAYER[ challengee ].card2 === card ) this.PLAYER[ challengee ].card2 = newCard;

				this.HISTORY.push({
					type: 'unsuccessful-challenge',
					action: 'swap-1',
					from: challengee,
				});
				console.log(`↬  ${ this.GetAvatar( challengee ) } put the ${ Style.yellow( card ) } back in the deck and drew a new card`);

				return 'done';
			}
		}

		return false;
	}


	ChallengeRound({ player, target, card, action, type, counterer }) {
		let _hasBeenChallenged = false;

		Object
			.keys( this.PLAYER )
			.filter( challenger => challenger !== player && ( this.PLAYER[ challenger ].card1 || this.PLAYER[ challenger ].card2 ) )
			.some( challenger => {
				_hasBeenChallenged = this.ResolveChallenge({ challenger, byWhom: target, card, action, type, target: player, counterer });
				return _hasBeenChallenged === 'done' ? true : _hasBeenChallenged;
			});

		return _hasBeenChallenged;
	}


	CounterAction({ player, action, target }) {
		const actions = {
			'foreign-aid': ['duke', false],
			'assassination': ['contessa', false],
			'stealing': ['captain', 'ambassador', false],
		};
		const counter = {}
		if( player ) {
			counter.counterAction = this.BOTS[ player ].OnCounterAction({
				...this.GetGameState(player),
				action,
				byWhom: target,
			});
			counter.counterer = player;
		}
		else {
			Object
				.keys( this.PLAYER )
				.filter( user => user !== target && ( this.PLAYER[ user ].card1 || this.PLAYER[ user ].card2 ) )
				.some( user => {
					const _hasBeenChallenged = this.BOTS[ user ].OnCounterAction({
						...this.GetGameState(user),
						action,
						byWhom: target,
					});

					if( _hasBeenChallenged ) {
						counter.counterAction = _hasBeenChallenged;
						counter.counterer = user;
						return true;
					}
				});
		}

		if( counter.counterAction ) {
			if( !actions[ action ].includes( counter.counterAction ) ) {
				this.Penalty( counter.counterer, `did't give a valid counter action ${ Style.yellow( counter.counterAction ) } for ${ Style.yellow( action ) }` );
				return true;
			}

			this.HISTORY.push({
				type: 'counter-action',
				action,
				from: counter.counterer,
				to: target,
				counter: counter.counterAction,
			});

			console.log(`❓  ${ this.GetAvatar( target ) } was counter actioned by ${ this.GetAvatar( counter.counterer ) } with ${ Style.yellow( counter.counterAction ) }`);
			//                                               FIXME: this looks like a bug
			const _hasBeenChallenged = this.ChallengeRound({ player: counter.counterer, target, card: counter.counterAction, action, type: 'counter-round', counterer: counter.counterer });
			return _hasBeenChallenged === 'done' ? true : !_hasBeenChallenged;
		}

		return false;
	}


	RunChallenges({ action, player, target }) {
		if( action === 'taking-3' || action === 'assassination' || action === 'stealing' || action === 'swapping' ) {
			const card = {
				'taking-3': 'duke',
				'assassination': 'assassin',
				'stealing': 'captain',
				'swapping': 'ambassador',
			}[action];

			const _hasBeenChallenged = this.ChallengeRound({ player, card, action, type: 'challenge-round', target });
			if( _hasBeenChallenged && _hasBeenChallenged !== 'done' ) {
				return;
			}
		}

		if( action === 'foreign-aid' || action === 'assassination' || action === 'stealing' ) {
			let targetPlayer = target;
			if( action === 'foreign-aid' ) targetPlayer = void(0);

			const _hasBeenChallenged = this.CounterAction({ player: targetPlayer, action, target: player });
			if( _hasBeenChallenged && _hasBeenChallenged !== 'done' ) {
				return;
			}
		}

		this.RunActions({ player, action, target });
	}


	RunActions({ player, action, target }) {
		if( !this.PLAYER[ target ] && !['taking-1', 'taking-3', 'swapping', 'foreign-aid'].includes( action ) ) {
			this.Penalty( player, `did't give a valid (${ target }) player` );
			return true;
		}

		if( !ACTIONS.includes( action ) ) {
			this.Penalty( player, `did't give a valid (${ action }) action` );
			return true;
		}

		if( this.PLAYER[ player ].coins > 10 && action !== 'couping' ) {
			this.Penalty( player, `had too much coins and needed to coup` );
			return;
		}

		let disgarded;

		switch( action ) {
			case 'taking-1':
				this.PLAYER[ player ].coins ++;
				break;

			case 'foreign-aid':
				this.PLAYER[ player ].coins += 2;
				break;

			case 'couping':
				this.PLAYER[ player ].coins -= 7;
				disgarded = this.BOTS[ target ].OnCardLoss({
					...this.GetGameState(target),
				});

				if( this.PLAYER[ target ].card1 === disgarded && disgarded ) {
					this.LosePlayerCard( target, disgarded );
				}
				else if( this.PLAYER[ target ].card2 === disgarded && disgarded ) {
					this.LosePlayerCard( target, disgarded );
				}
				else {
					this.Penalty( target, `did't give up a valid card` );
				}
				break;

			case 'taking-3':
				this.PLAYER[ player ].coins += 3;
				break;

			case 'assassination':
				disgarded = this.BOTS[ target ].OnCardLoss({
					...this.GetGameState(target),
				});

				if( this.PLAYER[ target ].card1 === disgarded && disgarded ) {
					this.LosePlayerCard( target, disgarded );
				}
				else if( this.PLAYER[ target ].card2 === disgarded && disgarded ) {
					this.LosePlayerCard( target, disgarded );
				}
				else {
					this.Penalty( target, `did't give up a valid card` );
				}
				break;

			case 'stealing':
				if( this.PLAYER[ target ].coins < 2 ) {
					this.PLAYER[ player ].coins += this.PLAYER[ target ].coins;
					this.PLAYER[ target ].coins = 0;
				}
				else {
					this.PLAYER[ player ].coins += 2;
					this.PLAYER[ target ].coins -= 2;
				}
				break;

			case 'swapping':
				const newCards = [ this.GetCardFromDeck(), this.GetCardFromDeck() ];

				const chosenCards = this.BOTS[ player ].OnSwappingCards({
					...this.GetGameState(player),
					newCards: newCards.slice( 0 ),
				});

				this.SwapCards({ chosenCards, player, newCards });
				break;
		}
	}


	Turn() {
		const player = Object.keys( this.PLAYER )[ this.GetWhosNext() ];

		const { action, against } = this.BOTS[ player ].OnTurn({
			...this.GetGameState(player),
		});

		const playerAvatar = this.GetAvatar( player );
		const targetAvatar = this.GetAvatar( against );

		let skipAction = false;

		switch( action ) {
			case 'taking-1':
				this.HISTORY.push({
					type: 'action',
					action: 'taking-1',
					from: player,
				});
				console.log(`🃏  ${ playerAvatar } takes ${ Style.yellow('a coin') }`);
				break;
			case 'foreign-aid':
				this.HISTORY.push({
					type: 'action',
					action: 'foreign-aid',
					from: player,
				});
				console.log(`🃏  ${ playerAvatar } takes 2 coins ${ Style.yellow('foreign aid') }`);
				break;
			case 'couping':
				this.HISTORY.push({
					type: 'action',
					action: 'couping',
					from: player,
					to: against,
				});
				console.log(`🃏  ${ playerAvatar } coups ${ targetAvatar }`);

				if( this.PLAYER[ player ].coins < 7 ) {
					this.Penalty( player, `did't having enough coins for a coup` );
					skipAction = true;
				}

				if( !this.StillAlive( against ) ) {
					this.Penalty( player, `tried to coup a dead player` );
					skipAction = true;
				}
				break;
			case 'taking-3':
				this.HISTORY.push({
					type: 'action',
					action: 'taking-3',
					from: player,
				});
				console.log(`🃏  ${ playerAvatar } takes 3 coins with the ${ Style.yellow('duke') }`);
				break;
			case 'assassination':
				this.HISTORY.push({
					type: 'action',
					action: 'assassination',
					from: player,
					to: against,
				});
				console.log(`🃏  ${ playerAvatar } assassinates ${ targetAvatar }`);

				if( this.PLAYER[ player ].coins < 3 ) {
					this.Penalty( player, `did't have enough coins for an assassination` );
					skipAction = true;
				}
				else if( !this.StillAlive( against ) ) {
					this.Penalty( player, `tried to assassinat a dead player` );
					skipAction = true;
				}
				else {
					this.PLAYER[ player ].coins -= 3;
				}
				break;
			case 'stealing':
				this.HISTORY.push({
					type: 'action',
					action: 'stealing',
					from: player,
					to: against,
				});

				if( !this.StillAlive( against ) ) {
					this.Penalty( player, `tried to steal from a dead player` );
					skipAction = true;
				}

				console.log(`🃏  ${ playerAvatar } steals from ${ targetAvatar }`);
				break;
			case 'swapping':
				this.HISTORY.push({
					type: 'action',
					action: 'swapping',
					from: player,
				});
				console.log(`🃏  ${ playerAvatar } swaps two cards with the ${ Style.yellow('ambassador') }`);
				break;
			default:
				this.HISTORY.push({
					type: 'penalty',
					from: player,
				});
				this.Penalty( player, `of issuing an invalid action: "${ Style.yellow( action ) }", allowed: ${ Style.yellow( ACTIONS.join(', ') ) }` );
				skipAction = true;
		}

		if( !skipAction ) this.RunChallenges({ player, action, target: against });

		if( this.WhoIsLeft().length > 1 && this.ROUNDS < 1000 ) {
			this.ROUNDS ++;
			return this.Turn();
		}
		else if( this.ROUNDS >= 1000 ) {
			console.log('The game was stopped because of an infinite loop');
			return this.WhoIsLeft();
		}
		else {
			const winner = this.WhoIsLeft()[ 0 ];
			console.log(`\nThe winner is ${ this.GetAvatar( winner ) }\n`);
			return [ winner ];
		}
	}
}


class LOOP {
	constructor() {
		this.WINNERS = {};
		this.SCORE = {};
		this.LOG = '';
		this.ERRORLOG = '';
		this.ROUND = 0;
		this.ROUNDS = this.GetRounds();

		ALLBOTS.forEach( player => {
			this.WINNERS[ player ] = 0;
			this.SCORE[ player ] = 0;
		});
	}

	GetScore( winners, allPlayer ) {
		const winnerCount = winners.length;
		const loserCount = allPlayer.length - winnerCount;
		const loserScore = -1 / ( allPlayer.length - 1 );
		const winnerScore = ( loserScore * loserCount ) / winnerCount * -1;

		allPlayer.forEach( player => {
			if( winners.includes( player ) ) {
				this.SCORE[ player ] += winnerScore;
			}
			else {
				this.SCORE[ player ] += loserScore;
			}
		});

		winners.forEach( player => {
			this.WINNERS[ player ] ++;
		});
	}

	DisplayScore( clear = false ) {
		if( clear ) process.stdout.write(`\u001b[${ Object.keys( this.SCORE ).length + 1 }A\u001b[2K`);

		const done = String( Math.floor( this.ROUND/this.ROUNDS * 100 ) + 1 );
		process.stdout.write(`\u001b[2K${ done.padEnd(3) }% done\n`)
		Object
			.keys( this.SCORE )
			.sort( ( a, b ) => this.SCORE[b] - this.SCORE[a] )
			.forEach( player => {
				const percentage = ( this.ROUND > 0 ) ? `${ ( ( this.WINNERS[ player ] * 100 ) / this.ROUND ).toFixed( 3 ) }%` : '-';
				process.stdout.write(
					`\u001b[2K${ Style.gray( percentage.padEnd(7) ) } ` +
					`${ Style.red( String( this.SCORE[ player ].toFixed( 2 ) ).padEnd( Math.round( Math.log10( this.ROUNDS ) + 6 ) ) ) } ` +
					`${ Style.yellow( player ) } got ${ Style.red( this.WINNERS[ player ] ) } wins\n`
				);
			});
	}

	GetRounds() {
		const rIdx = process.argv.indexOf('-r');
		if( rIdx > 0 && process.argv.length > rIdx && Number.parseInt( process.argv[rIdx + 1] ) > 0 ) {
			return Number.parseInt( process.argv[rIdx + 1] );
		}
		return 1000;
	}

	Play() {
		this.DisplayScore( true );

		let game = new COUP();
		const winners = game.Play( GetPlayer( ALLBOTS ) );

		if( !winners || this.ERRORLOG !== '' ) {
			console.info( this.LOG );
			console.info( this.ERRORLOG );
			console.info( JSON.stringify( game.HISTORY, null, 2 ) );
			this.ROUND = this.ROUNDS;
		}

		this.GetScore( winners, game.ALLPLAYER );

		game = null;

		this.ROUND ++;
		this.LOG = '';

		if( this.ROUND < this.ROUNDS ) {
			// We run on next tick so the GC can get to work.
			// Otherwise it will work up a large memory footprint
			// when running over 100,000 games
			// (cause loops won't let the GC run efficiently)
			process.nextTick( () => this.Play() );
		}
		else {
			console.info();
		}
	}

	Run() {
		console.log = text => { this.LOG += `${ text }\n` };
		console.error = text => { this.ERRORLOG += `${ text }\n` };
		console.info(`\nGame round started`);
		console.info('\n🎉   WINNERS  🎉\n');

		this.DisplayScore( false );

		this.Play();
	}
};

const GetPlayer = ( allPlayer ) => {
	return allPlayer
		.filter( item => item !== undefined )
		.map( item => [ Math.random(), item ] )
		.sort( ( a, b ) => a[ 0 ] - b[ 0 ] )
		.map( item => item[ 1 ] )
		.slice( 0, 6 );
}


if( process.argv.includes('play') ) {
	new COUP().Play( GetPlayer( ALLBOTS ) );
}

if( process.argv.includes('loop') ) {
	new LOOP().Run();
}


module.exports = exports = {
	COUP,
};
