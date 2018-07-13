'use strict';

const { Style } = require('./helper.js');
const { COUP } = require('./index.js');

// defaults
const MakeBots = () => ({
	bot1: {
		OnTurn: () => ({}),
		OnChallengeActionRound: () => false,
		OnCounterAction: () => false,
		OnCounterActionRound: () => false,
		OnSwappingCards: () => {},
		OnCardLoss: () => {},
	},
	bot2: {
		OnTurn: () => ({}),
		OnChallengeActionRound: () => false,
		OnCounterAction: () => false,
		OnCounterActionRound: () => false,
		OnSwappingCards: () => {},
		OnCardLoss: () => {},
	},
	bot3: {
		OnTurn: () => ({}),
		OnChallengeActionRound: () => false,
		OnCounterAction: () => false,
		OnCounterActionRound: () => false,
		OnSwappingCards: () => {},
		OnCardLoss: () => {},
	},
});
const MakePlayer = () => ({
	bot1: {
		card1: void(0),
		card2: void(0),
		coins: 0
	},
	bot2: {
		card1: void(0),
		card2: void(0),
		coins: 0
	},
	bot3: {
		card1: void(0),
		card2: void(0),
		coins: 0
	},
});

console.log = () => {};

const TEST = {
	'taking-1': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'duke';
		player.bot2.card1 = 'duke';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'taking-1', against: 'bot1' });

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = [];
		game.TURN = 2;
		game.WhoIsLeft = () => ['bot1'];

		await game.Turn();

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.coins === 1 &&
			game.PLAYER.bot1.card1 === 'duke' &&
			game.PLAYER.bot2.card1 === 'duke'
		) status = Style.green('PASS');
		console.info(`${ status }  "taking-1" action`);
	},
	'foreign-aid': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'duke';
		player.bot2.card1 = 'duke';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'foreign-aid', against: 'bot2' });

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = [];
		game.TURN = 2;
		game.WhoIsLeft = () => ['bot1'];

		await game.Turn();

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.coins === 2
		) status = Style.green('PASS');
		console.info(`${ Style.red( status ) }  "foreign-aid" action`);
	},
	'couping': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'duke';
		player.bot1.coins = 8;
		player.bot2.card1 = 'duke';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'couping', against: 'bot2' });

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = [];
		game.TURN = 2;

		await game.Turn();

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.coins === 1 &&
			!game.PLAYER.bot2.card1
		) status = Style.green('PASS');
		console.info(`${ status }  "couping" action`);
	},
	'taking-3': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'duke';
		player.bot2.card1 = 'duke';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'taking-3', against: 'bot2' });

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = [];
		game.TURN = 2;
		game.WhoIsLeft = () => ['bot1'];

		await game.Turn();

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.coins === 3
		) status = Style.green('PASS');
		console.info(`${ status }  "taking-3" action`);
	},
	'assassination1': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.coins = 4;
		player.bot1.card1 = 'duke';
		player.bot2.card1 = 'duke';
		player.bot2.card2 = 'captain';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'assassination', against: 'bot2' });
		bots.bot2.OnCardLoss = () => 'captain';

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = [];
		game.TURN = 2;
		game.WhoIsLeft = () => ['bot1'];

		await game.Turn();

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot2.card1 === 'duke' &&
			game.PLAYER.bot2.card2 === void(0) &&
			game.PLAYER.bot1.coins === 1
		) status = Style.green('PASS');
		console.info(`${ status }  "assassination" action`);
	},
	'assassination2': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.coins = 3;
		player.bot1.card1 = 'duke';
		player.bot2.card1 = 'duke';
		player.bot2.card2 = 'captain';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'assassination', against: 'bot2' });
		bots.bot2.OnCounterAction = () => 'contessa';

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = [];
		game.TURN = 2;
		game.WhoIsLeft = () => ['bot1'];

		await game.Turn();

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.card1 === 'duke' &&
			game.PLAYER.bot1.coins === 0 &&
			game.PLAYER.bot2.card1 === 'duke' &&
			game.PLAYER.bot2.card2 === 'captain'
		) status = Style.green('PASS');
		console.info(`${ status }  "assassination" action with successful counter action`);
	},
	'stealing1': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.coins = 1;
		player.bot1.card1 = 'duke';
		player.bot2.coins = 5;
		player.bot2.card1 = 'duke';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'stealing', against: 'bot2' });

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = [];
		game.TURN = 2;
		game.WhoIsLeft = () => ['bot1'];

		await game.Turn();

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.coins === 3 &&
			game.PLAYER.bot2.coins === 3
		) status = Style.green('PASS');
		console.info(`${ status }  "stealing" action`);
	},
	'stealing2': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.coins = 1;
		player.bot1.card1 = 'duke';
		player.bot2.coins = 1;
		player.bot2.card1 = 'duke';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'stealing', against: 'bot2' });

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = [];
		game.TURN = 2;
		game.WhoIsLeft = () => ['bot1'];

		await game.Turn();

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.coins === 2 &&
			game.PLAYER.bot2.coins === 0
		) status = Style.green('PASS');
		console.info(`${ status }  "stealing" action from poor bots`);
	},
	'stealing3': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.coins = 1;
		player.bot1.card1 = 'duke';
		player.bot2.coins = 0;
		player.bot2.card1 = 'duke';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'stealing', against: 'bot2' });

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = [];
		game.TURN = 2;
		game.WhoIsLeft = () => ['bot1'];

		await game.Turn();

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.coins === 1 &&
			game.PLAYER.bot2.coins === 0
		) status = Style.green('PASS');
		console.info(`${ status }  "stealing" action from broke bots`);
	},
	'swapping1': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'assassin';
		player.bot1.card2 = 'contessa';
		player.bot2.card1 = 'duke';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'swapping', against: 'bot2' });
		bots.bot1.OnSwappingCards = ({ newCards }) => newCards;

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = ['duke', 'captain'];
		game.TURN = 2;
		game.WhoIsLeft = () => ['bot1'];

		await game.Turn();

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.card1 === 'captain' &&
			game.PLAYER.bot1.card2 === 'duke'
		) status = Style.green('PASS');
		console.info(`${ status }  "swapping" action`);
	},
	'swapping2': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'assassin';
		player.bot1.card2 = void(0);
		player.bot2.card1 = 'duke';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'swapping', against: 'bot2' });
		bots.bot1.OnSwappingCards = ({ newCards }) => newCards;

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = ['duke', 'captain'];
		game.TURN = 2;
		game.WhoIsLeft = () => ['bot1'];

		await game.Turn();

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.card1 === 'captain' &&
			game.PLAYER.bot1.card2 === void(0)
		) status = Style.green('PASS');
		console.info(`${ status }  "swapping" action with only one card`);
	},
	'no-challenge': () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.coins = 0;
		player.bot1.card1 = 'contessa';
		player.bot2.coins = 4;
		player.bot2.card1 = 'contessa';

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = MakeBots();
		game.PLAYER = player;
		game.DECK = [];
		game.TURN = 0;

		const result = game.RunChallenges({ player: 'bot1', action: 'stealing', target: 'bot2' });

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.coins === 2 &&
			game.PLAYER.bot2.coins === 2
		) status = Style.green('PASS');
		console.info(`${ status }  RunChallenges without challenges`);
	},
	'unsuccessfull-challenge': () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'assassin';
		player.bot1.card2 = 'ambassador';
		player.bot2.card1 = 'duke';
		player.bot2.coins = 3;
		player.bot3.card1 = 'duke';

		const bots = MakeBots();
		bots.bot2.OnChallengeActionRound = () => true;

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = [];
		game.TURN = 0;

		game.RunChallenges({ action: 'stealing', player: 'bot1', target: 'bot2' });

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.card1 === void(0) &&
			game.PLAYER.bot1.card2 === 'ambassador' &&
			game.PLAYER.bot1.coins === 0 &&
			game.PLAYER.bot2.card1 === 'duke' &&
			game.PLAYER.bot2.coins === 3
		) status = Style.green('PASS');
		console.info(`${ status }  an unsuccessfull challenge yields punishment`);
	},
	'successfull-challenge': () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'assassin';
		player.bot1.card2 = 'captain';
		player.bot2.card1 = 'duke';
		player.bot2.coins = 3;
		player.bot3.card1 = 'duke';

		const bots = MakeBots();
		let runs = 0;
		bots.bot2.OnChallengeActionRound = () => {
			runs ++;
			return true;
		};
		bots.bot2.OnChallengeActionRound = () => {
			runs ++;
			return true;
		};

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = ['contessa', 'assassin', 'contessa', 'duke'];
		game.TURN = 0;

		game.RunChallenges({ action: 'stealing', player: 'bot1', target: 'bot2' });

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.card1 === 'assassin' &&
			game.PLAYER.bot1.card2 !== void(0) &&
			game.PLAYER.bot1.coins === 2 &&
			game.PLAYER.bot2.card1 === void(0) &&
			game.PLAYER.bot2.coins === 1 &&
			game.PLAYER.bot3.card1 === 'duke' &&
			game.DECK.length === 4 &&
			runs === 1
		) status = Style.green('PASS');
		console.error(`${ status }  a successful challenge yields punishment`);
	},
	'successfull-counter-action': () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'assassin';
		player.bot1.card2 = 'captain';
		player.bot2.card1 = 'captain';
		player.bot2.coins = 3;
		player.bot3.card1 = 'duke';

		const bots = MakeBots();
		bots.bot2.OnCounterAction = () => 'captain';

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = ['contessa'];
		game.TURN = 0;

		game.RunChallenges({ action: 'stealing', player: 'bot1', target: 'bot2' });

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.card1 === 'assassin' &&
			game.PLAYER.bot1.card2 === 'captain' &&
			game.PLAYER.bot1.coins === 0 &&
			game.PLAYER.bot2.card1 === 'captain' &&
			game.PLAYER.bot2.coins === 3 &&
			game.PLAYER.bot3.card1 === 'duke' &&
			game.DECK.length === 1
		) status = Style.green('PASS');
		console.info(`${ status }  a successful counter action yields punishment`);
	},
	// RunChallenges
	// OnChallengeActionRound
	// OnCounterAction
	// OnCounterActionRound
	'challenge-only-once': () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'assassin';
		player.bot1.card2 = 'captain';
		player.bot1.coins = 1;
		player.bot2.card1 = 'captain';
		player.bot2.coins = 3;
		player.bot3.card1 = 'duke';

		const bots = MakeBots();
		let runs = 0;
		bots.bot2.OnCounterAction = () => 'captain';
		bots.bot1.OnCardLoss = () => 'assassin';
		bots.bot1.OnCounterActionRound = () => {
			runs ++;
			return true;
		};
		bots.bot2.OnCounterActionRound = () => {
			runs ++;
			return true;
		};
		bots.bot3.OnCounterActionRound = () => {
			runs ++;
			return true;
		};

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = ['contessa'];
		game.TURN = 0;

		game.RunChallenges({ action: 'stealing', player: 'bot1', target: 'bot2' });

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.card1 === void(0) &&
			game.PLAYER.bot1.card2 === 'captain' &&
			game.PLAYER.bot1.coins === 1 &&
			game.PLAYER.bot2.card1 !== void(0) &&
			game.PLAYER.bot2.coins === 3 &&
			game.PLAYER.bot3.card1 === 'duke' &&
			game.DECK.length === 1 &&
			runs === 1
		) status = Style.green('PASS');
		console.info(`${ status }  an unsuccessful counter action round yields punishment`);
	},
	'ChallengeRound1': () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'assassin';
		player.bot2.card1 = 'captain';

		const bots = MakeBots();
		bots.bot2.OnChallengeActionRound = () => false;

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = [];
		game.TURN = 0;

		const result = game.ChallengeRound({ player: 'bot1', card: 'captain', action: 'stealing', target: 'bot2', type: 'challenge-round' });

		let status = Style.red('FAIL');
		if(
			result === false
		) status = Style.green('PASS');
		console.info(`${ status }  ChallengeRound returns false if no challenges`);
	},
	'ChallengeRound2': () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'assassin';
		player.bot2.card1 = 'captain';

		const bots = MakeBots();
		bots.bot2.OnChallengeActionRound = () => true;

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = [];
		game.TURN = 0;

		const result = game.ChallengeRound({ player: 'bot1', card: 'captain', action: 'stealing', target: 'bot2', type: 'challenge-round' });

		let status = Style.red('FAIL');
		if(
			result === true
		) status = Style.green('PASS');
		console.info(`${ status }  ChallengeRound returns true if challenged`);
	},
	'ChallengeRound3': () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'assassin';
		player.bot2.card1 = 'captain';

		const bots = MakeBots();
		let runs = 0;
		bots.bot2.OnChallengeActionRound = () => {
			runs ++;
			return true;
		};
		bots.bot3.OnChallengeActionRound = () => {
			runs ++;
			return true;
		};

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = [];
		game.TURN = 0;

		const result = game.ChallengeRound({ player: 'bot1', card: 'captain', action: 'stealing', target: 'bot2', type: 'challenge-round' });

		let status = Style.red('FAIL');
		if(
			result === true &&
			runs === 1
		) status = Style.green('PASS');
		console.info(`${ status }  ChallengeRound stops after first challenge`);
	},
	// 'TODO': () => {
	// 	const game = new COUP;

	// 	const bots = MakeBots();
	// 	let OnChallengeActionRound;
	// 	bots.bot2.OnChallengeActionRound = param => {
	// 		OnChallengeActionRound = param;
	// 		return false;
	// 	};
	// 	let OnCounterAction;
	// 	bots.bot2.OnCounterAction = param => {
	// 		OnCounterAction = param;
	// 		return false;
	// 	};

	// 	const player = MakePlayer();
	// 	player.bot1.card1 = 'duke';
	// 	player.bot2.card1 = 'duke';

	// 	game.HISTORY = [];
	// 	game.DISCARDPILE = [];
	// 	game.BOTS = bots;
	// 	game.PLAYER = player;
	// 	game.DECK = [];
	// 	game.TURN = 0;

	// 	game.RunChallenges({ player: 'bot1', action: 'stealing', target: 'bot2' });

	// 	let status = Style.red('FAIL');
	// 	if(
	// 		true === true
	// 	) status = Style.green('PASS');
	// 	console.info(`${ status }  TODO`);
	// },
};


console.info(`
 ████████╗ ███████╗ ███████╗ ████████╗ ██╗ ███╗   ██╗  ██████╗
 ╚══██╔══╝ ██╔════╝ ██╔════╝ ╚══██╔══╝ ██║ ████╗  ██║ ██╔════╝
    ██║    █████╗   ███████╗    ██║    ██║ ██╔██╗ ██║ ██║  ███╗
    ██║    ██╔══╝   ╚════██║    ██║    ██║ ██║╚██╗██║ ██║   ██║
    ██║    ███████╗ ███████║    ██║    ██║ ██║ ╚████║ ╚██████╔╝
    ╚═╝    ╚══════╝ ╚══════╝    ╚═╝    ╚═╝ ╚═╝  ╚═══╝  ╚═════╝
`);

Object
	.entries( TEST )
	.forEach( async ([ name, test ]) => await test() );


const ExitHandler = ( exiting, error ) => {
	if( error && error !== 1 ) {
		console.error( error );
	}

	console.info();
	process.exit( 0 ); //now exit with a smile :)
};

process.on( 'exit', ExitHandler );
process.on( 'SIGINT', ExitHandler );
process.on( 'uncaughtException', ExitHandler );
