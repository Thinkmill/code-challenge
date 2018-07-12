'use strict';

const { Style } = require('./helper.js');
const {
	ALLPLAYER,
	CARDS,
	DECK,
	ACTIONS,
} = require('./constants.js');


class COUP {
	constructor() {
		// yes globals(sorta); sue me!
		this.HISTORY = [];
		this.DISCARDPILE = [];
		this.BOTS = {};
		this.PLAYER = {};
		this.DECK = [];
		this.TURN = 0;
		this.TIMEOUT = 100;
	}

	async Play() {
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

		this.GetBots( ALLPLAYER );
		this.MakePlayer( ALLPLAYER );
		this.HandOutCards();
		this.ElectStarter();

		// this is the game loop
		return await this.Turn();
	}

	GetBots( player ) {
		try {
			player.forEach( player => {
				this.BOTS[ player ] = require(`./${ player }/index.js`);

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

					throw( Style.red(`🚨  The bot ${ Style.yellow( player ) } is missing ${ missing.length > 1 ? 'methods' : 'a method' }: ${ Style.yellow( missing.join(', ') ) }!\n`) );
				}
			});
		}
		catch( error ) {
			console.error( error );
			process.exit( 1 );
		}
	}


	MakePlayer( player ) {
		player.forEach( player => {
			this.PLAYER[ player ] = {
				card1: void(0),
				card2: void(0),
				coins: 0,
			};
		});
	}


	ShuffleCards( CARDS ) {
		return CARDS
			.map( item => [ Math.random(), item ] )
			.sort( ( a, b ) => a[ 0 ] - b[ 0 ] )
			.map( item => item[ 1 ] );
	}


	HandOutCards() {
		this.DECK = this.ShuffleCards( DECK );

		Object
			.entries( this.PLAYER )
			.forEach( ([ key, value ]) => {
				this.PLAYER[ key ].card1 = this.DECK.pop();
				this.PLAYER[ key ].card2 = this.DECK.pop();
			});
	}


	ExchangeCard( card ) {
		this.DECK.push( card );
		this.DECK = this.ShuffleCards( this.DECK );

		return this.DECK.pop();
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
			.map( player => ({ name: player, coins: this.PLAYER[ player ].coins }) );
	}


	Wait( time ) {
		return new Promise( resolve => setTimeout( resolve, time ) );
	}


	GetAvatar( player ) {
		return `[${ Style.yellow( player ) } ` +
			// `${ this.PLAYER[ player ].card1 ? `${ Style.red( this.PLAYER[ player ].card1.substring( 0, 2 ) ) } ` : '' }` +
			// `${ this.PLAYER[ player ].card2 ? `${ Style.red( this.PLAYER[ player ].card2.substring( 0, 2 ) ) } ` : '' }` +
			`${ this.PLAYER[ player ].card1 ? Style.red('♥') : '' }` +
			`${ this.PLAYER[ player ].card2 ? Style.red('♥') : '' }` +
			` ${ Style.yellow(`💰 ${ this.PLAYER[ player ].coins }`) }]`;
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

		if( this.PLAYER[ player ].card1 ) {
			penalty = this.PLAYER[ player ].card1;
		}
		else if( this.PLAYER[ player ].card2 ) {
			penalty = this.PLAYER[ player ].card2;
		}

		console.log(`🚨  ${ this.GetAvatar( player ) } was penalised because ${ Style.yellow( reason ) }`);
		this.LosePlayerCard( player, penalty );
	}


	ResolveChallenge({ player, card, action, type, target }) {
		const challengeTypes = {
			'challenge-round': 'OnChallengeActionRound',
			'counter-round': 'OnCounterActionRound',
		};

		if( this.BOTS[ player ][ challengeTypes[ type ] ]({
			history: this.HISTORY,
			myCards: this.GetPlayerCards( player ),
			myCoins: this.PLAYER[ player ].coins,
			otherPlayers: this.GetPlayerObjects( this.WhoIsLeft(), player ),
			discardedCards: this.DISCARDPILE,
			action,
			byWhom: player,
			toWhom: target,
		}) ) {
			let lying = false;
			if( this.PLAYER[ target ].card1 !== card && this.PLAYER[ target ].card2 !== card ) {
				lying = true;
			}

			this.HISTORY.push({
				type,
				challenger: player,
				player: target,
				action: action,
				lying: lying,
			});

			console.log(`❓  ${ this.GetAvatar( target ) } was challenged by ${ this.GetAvatar( player ) }`);

			if( lying ) {
				this.HISTORY.push({
					type: 'penalty',
					player: target,
				});

				this.Penalty( target, 'of lying' );

				return true;
			}
			else {
				this.HISTORY.push({
					type: 'penalty',
					from: player,
				});

				this.Penalty( player, `of challenging ${ this.GetAvatar( target ) } unsuccessfully` );
				const newCard = this.ExchangeCard( card );

				if( this.PLAYER[ target ].card1 === card ) this.PLAYER[ target ].card1 = newCard;
				else if( this.PLAYER[ target ].card2 === card ) this.PLAYER[ target ].card2 = newCard;

				this.HISTORY.push({
					type: 'unsuccessful-challenge',
					action: 'swap-1',
					from: target,
				});
				console.log(`↬  ${ this.GetAvatar( target ) } put the ${ Style.yellow( card ) } back in the deck and drew a new card`);

				return 'done';
			}
		}

		return false;
	}


	ChallengeRound({ player, card, action, type }) {
		let _hasBeenChallenged = false;

		Object
			.keys( this.PLAYER )
			.filter( user => user !== player && ( this.PLAYER[ user ].card1 || this.PLAYER[ user ].card2 ) )
			.some( user => {
				_hasBeenChallenged = this.ResolveChallenge({ player: user, card, action, type, target: player });
				return _hasBeenChallenged === 'done' ? true : _hasBeenChallenged;
			});

		return _hasBeenChallenged;
	}


	CounterAction({ player, card, action, target }) {
		const actions = {
			'foreign-aid': ['duke', false],
			'assassination': ['contessa', false],
			'stealing': ['captain', 'ambassador', false],
		};

		const counterAction = this.BOTS[ player ].OnCounterAction({
			history: this.HISTORY,
			myCards: this.GetPlayerCards( player ),
			myCoins: this.PLAYER[ player ].coins,
			otherPlayers: this.GetPlayerObjects( this.WhoIsLeft(), player ),
			discardedCards: this.DISCARDPILE,
			action,
			byWhom: player,
		});

		if( !actions[ action ].includes( counterAction ) && counterAction !== false ) {
			this.Penalty( player, `did't give a valid counter action (${ counterAction }) for ${ action }` );
			return true;
		}

		if( counterAction ) {
			this.HISTORY.push({
				type: 'counter-action',
				action,
				from: player,
				to: target,
				counter: counterAction,
			});

			console.log(`❓  ${ this.GetAvatar( target ) } was counter actioned by ${ this.GetAvatar( player ) }`);

			const _hasBeenChallenged = this.ChallengeRound({ player, card: counterAction, action, type: 'counter-round' });
			return _hasBeenChallenged === 'done' ? true : !_hasBeenChallenged;
		}

		return false;
	}


	RunChallenges({ action, player, target }) {
		if( action === 'foreign-aid' || action === 'taking-3' || action === 'assassination' || action === 'stealing' || action === 'swapping' ) {
			const cards = {
				'taking-3': 'duke',
				'foreign-aid': 'duke',
				'assassination': 'assassin',
				'stealing': 'captain',
				'swapping': 'ambassador',
			};

			const _hasBeenChallenged = this.ChallengeRound({ player, card: cards[ action ], action, type: 'challenge-round' });
			if( _hasBeenChallenged && _hasBeenChallenged !== 'done' ) {
				return;
			}
		}

		if( action === 'assassination' || action === 'stealing' ) {
			const cards = {
				'assassination': 'contessa',
				'stealing': [ 'captain', 'ambassador' ],
			};

			const _hasBeenChallenged = this.CounterAction({ player: target, card: cards[ action ], action, target: player });
			if( _hasBeenChallenged && _hasBeenChallenged !== 'done' ) {
				return;
			}
		}

		this.RunActions({ player, action, target });
	}


	RunActions({ player, action, target }) {
		if( !this.PLAYER[ target ] ) {
			this.Penalty( player, `did't give a valid (${ target }) player` );
			return true;
		}

		if( !ACTIONS.includes( action ) ) {
			this.Penalty( player, `did't give a valid (${ action }) action` );
			return true;
		}

		if( this.PLAYER[ player ].coins > 10 ) {
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
					history: this.HISTORY,
					myCards: this.GetPlayerCards( target ),
					myCoins: this.PLAYER[ target ].coins,
					otherPlayers: this.GetPlayerObjects( this.WhoIsLeft(), target ),
					discardedCards: this.DISCARDPILE,
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
				this.PLAYER[ player ].coins -= 3;

				disgarded = this.BOTS[ target ].OnCardLoss({
					history: this.HISTORY,
					myCards: this.GetPlayerCards( target ),
					myCoins: this.PLAYER[ target ].coins,
					otherPlayers: this.GetPlayerObjects( this.WhoIsLeft(), target ),
					discardedCards: this.DISCARDPILE,
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
				let oldCards = 0;
				if( this.PLAYER[ player ].card1 ) oldCards ++;
				if( this.PLAYER[ player ].card2 ) oldCards ++;

				const card1 = this.DECK.pop();
				const card2 = this.DECK.pop();
				const allCards = new Set([ card1, card2, this.PLAYER[ player ].card1, this.PLAYER[ player ].card2 ]);

				const newCards = this.BOTS[ player ].OnSwappingCards({
					history: this.HISTORY,
					myCards: this.GetPlayerCards( player ),
					myCoins: this.PLAYER[ player ].coins,
					otherPlayers: this.GetPlayerObjects( this.WhoIsLeft(), player ),
					discardedCards: this.DISCARDPILE,
					newCards: [ card1, card2 ],
				}).slice( 0, oldCards );

				this.PLAYER[ player ].card1 = newCards[ 0 ];
				this.PLAYER[ player ].card2 = newCards[ 1 ];

				Array
					.from( new Set([ ...allCards ].filter( card => !new Set( newCards ).has( card ) ) ) )
					.forEach( card => this.DECK.push( card ) );
				break;
		}
	}


	async Turn() {
		const player = Object.keys( this.PLAYER )[ this.GetWhosNext() ];

		const { action, against } = this.BOTS[ player ].OnTurn({
			history: this.HISTORY,
			myCards: this.GetPlayerCards( player ),
			myCoins: this.PLAYER[ player ].coins,
			otherPlayers: this.GetPlayerObjects( this.WhoIsLeft(), player ),
			discardedCards: this.DISCARDPILE,
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
				break;
			case 'stealing':
				this.HISTORY.push({
					type: 'action',
					action: 'stealing',
					from: player,
					to: against,
				});
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
				return;
		}

		if( !skipAction ) this.RunChallenges({ player, action, target: against });

		if( this.WhoIsLeft().length > 1 ) {
			await this.Wait( this.TIMEOUT );
			return this.Turn();
		}
		else {
			const winner = this.WhoIsLeft()[ 0 ];
			console.log(`\nThe winner is ${ this.GetAvatar( winner ) }\n`);
			return winner;
		}
	}
}


if( process.argv.includes('play') ) {
	(async () => {
		const game = new COUP();
		await game.Play();
	})();
}

if( process.argv.includes('loop') ) {
	let game;
	const winners = {};

	(async () => {
		let output = '';
		console.log = text => { output += text };
		console.info(`Game round started`);
		let round = 1;
		for( const _ of Array(100) ) {
			process.stdout.write(`${ Style.yellow('.') }`);
			game = new COUP();
			game.TIMEOUT = 0;
			const winner = await game.Play();
			if( !winners[ winner ] ) winners[ winner ] = 0;
			winners[ winner ] ++;
			round ++;
		}
		console.info( winners );
		console.info();
	})();
}


module.exports = exports = {
	ALLPLAYER,
	CARDS,
	DECK,
	ACTIONS,
	COUP,
};
