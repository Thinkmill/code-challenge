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
		OnCardLoss: ({ myCards }) => myCards[ 0 ],
	},
	bot2: {
		OnTurn: () => ({}),
		OnChallengeActionRound: () => false,
		OnCounterAction: () => false,
		OnCounterActionRound: () => false,
		OnSwappingCards: () => {},
		OnCardLoss: ({ myCards }) => myCards[ 0 ],
	},
	bot3: {
		OnTurn: () => ({}),
		OnChallengeActionRound: () => false,
		OnCounterAction: () => false,
		OnCounterActionRound: () => false,
		OnSwappingCards: () => {},
		OnCardLoss: ({ myCards }) => myCards[ 0 ],
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
	//   _____     _     _  _   ___   _  _    ___         _
	// |_   _|   /_\   | |/ / |_ _| | \| |  / __|  ___  / |
	//   | |    / _ \  | ' <   | |  | .` | | (_ | |___| | |
	//   |_|   /_/ \_\ |_|\_\ |___| |_|\_|  \___|       |_|
	// bot1 will take one coin
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
		console.info(`${ status }  ${ Style.yellow('taking-1') } action`);
	},
	//    __    ___    _   _   ___   ___   _  _    ___
	//  / __|  / _ \  | | | | | _ \ |_ _| | \| |  / __|
	// | (__  | (_) | | |_| | |  _/  | |  | .` | | (_ |
	//  \___|  \___/   \___/  |_|   |___| |_|\_|  \___|
	// bot1 will coup bot2
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
			game.PLAYER.bot1.card1 === 'duke' &&
			game.PLAYER.bot1.coins === 1 &&
			game.PLAYER.bot2.card1 === void(0)
		) status = Style.green('PASS');
		console.info(`${ status }  ${ Style.yellow('couping') } action`);
	},
	//  _____     _     _  _   ___   _  _    ___         ___
	// |_   _|   /_\   | |/ / |_ _| | \| |  / __|  ___  |__ /
	//   | |    / _ \  | ' <   | |  | .` | | (_ | |___|  |_ \
	//   |_|   /_/ \_\ |_|\_\ |___| |_|\_|  \___|       |___/
	// bot1 will take three coins with duke
	'taking-31': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.coins = 0;
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
			game.PLAYER.bot1.coins === 3 &&
			game.PLAYER.bot1.card1 === 'duke' &&
			game.PLAYER.bot2.card1 === 'duke'
		) status = Style.green('PASS');
		console.info(`${ status }  ${ Style.yellow('taking-3') } without challenge`);
	},
	// bot1 will take three coins with duke, bot2 calls bot1, bot1 did not have the duke
	'taking-32': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.coins = 0;
		player.bot1.card1 = 'captain';
		player.bot2.card1 = 'duke';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'taking-3', against: 'bot2' });
		bots.bot2.OnChallengeActionRound = () => true;

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
			game.PLAYER.bot1.coins === 0 &&
			game.PLAYER.bot1.card1 === void(0) &&
			game.PLAYER.bot2.card1 === 'duke'
		) status = Style.green('PASS');
		console.info(`${ status }  ${ Style.yellow('taking-3') } with successful challenge`);
	},
	// bot1 will take three coins with duke, bot2 calls bot1, bot1 did have the duke
	'taking-33': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.coins = 0;
		player.bot1.card1 = 'duke';
		player.bot2.card1 = 'duke';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'taking-3', against: 'bot2' });
		bots.bot2.OnChallengeActionRound = () => true;

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
			game.PLAYER.bot1.card1 === 'duke' &&
			game.PLAYER.bot2.card1 === void(0)
		) status = Style.green('PASS');
		console.info(`${ status }  ${ Style.yellow('taking-3') } with unsuccessful challenge`);
	},
	//    _     ___   ___     _     ___   ___   ___   _  _     _     _____   ___    ___    _  _
	//   /_\   / __| / __|   /_\   / __| / __| |_ _| | \| |   /_\   |_   _| |_ _|  / _ \  | \| |
	//  / _ \  \__ \ \__ \  / _ \  \__ \ \__ \  | |  | .` |  / _ \    | |    | |  | (_) | | .` |
	// /_/ \_\ |___/ |___/ /_/ \_\ |___/ |___/ |___| |_|\_| /_/ \_\   |_|   |___|  \___/  |_|\_|
	// bot1 will assassinate bot2 with assassin
	'assassination1': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'duke';
		player.bot1.coins = 4;
		player.bot2.card1 = 'duke';
		player.bot2.card2 = 'captain';
		player.bot2.coins = 5;

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
			game.PLAYER.bot1.card1 === 'duke' &&
			game.PLAYER.bot1.coins === 1 &&
			game.PLAYER.bot2.card1 === 'duke' &&
			game.PLAYER.bot2.card2 === void(0) &&
			game.PLAYER.bot2.coins === 5
		) status = Style.green('PASS');
		console.info(`${ status }  ${ Style.yellow('assassination') } without challenge or counter action`);
	},
	// bot1 will assassinate bot2 with assassin, bot2 calls bot1, bot1 did not have the assassin
	'assassination2': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'duke';
		player.bot1.coins = 4;
		player.bot2.card1 = 'duke';
		player.bot2.card2 = 'captain';
		player.bot2.coins = 5;

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'assassination', against: 'bot2' });
		bots.bot2.OnChallengeActionRound = () => true;

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
			game.PLAYER.bot1.card1 === void(0) &&
			game.PLAYER.bot1.coins === 1 &&
			game.PLAYER.bot2.card1 === 'duke' &&
			game.PLAYER.bot2.card2 === 'captain' &&
			game.PLAYER.bot2.coins === 5
		) status = Style.green('PASS');
		console.info(`${ status }  ${ Style.yellow('assassination') } with successful challenge`);
	},
	// bot1 will assassinate bot2 with assassin, bot2 calls bot1, bot1 did have the assassin
	'assassination3': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'assassin';
		player.bot1.coins = 4;
		player.bot2.card1 = 'duke';
		player.bot2.card2 = 'captain';
		player.bot2.coins = 5;

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'assassination', against: 'bot2' });
		bots.bot2.OnChallengeActionRound = () => true;
		bots.bot2.OnCardLoss = () => 'captain';

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
			game.PLAYER.bot1.card1 !== void(0) &&
			game.PLAYER.bot1.coins === 1 &&
			game.PLAYER.bot2.card1 === void(0) &&
			game.PLAYER.bot2.card2 === void(0) &&
			game.PLAYER.bot2.coins === 5
		) status = Style.green('PASS');
		console.info(`${ status }  ${ Style.yellow('assassination') } with unsuccessful challenge`);
	},
	// bot1 will assassinate bot2 with assassin, bot2 says it has the contessa, bot1 is fine with that
	'assassination4': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'assassin';
		player.bot1.coins = 4;
		player.bot2.card1 = 'duke';
		player.bot2.card2 = 'captain';
		player.bot2.coins = 5;

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'assassination', against: 'bot2' });
		bots.bot2.OnCounterAction = () => 'contessa';

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
			game.PLAYER.bot1.card1 === 'assassin' &&
			game.PLAYER.bot1.coins === 1 &&
			game.PLAYER.bot2.card1 === 'duke' &&
			game.PLAYER.bot2.card2 === 'captain' &&
			game.PLAYER.bot2.coins === 5
		) status = Style.green('PASS');
		console.info(`${ status }  ${ Style.yellow('assassination') } with counter action but no counter challenge`);
	},
	// bot1 will assassinate bot2 with assassin, bot2 says it has the contessa, bot1 is challenging bot2, bot2 did not have the contessa
	'assassination5': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'assassin';
		player.bot1.coins = 4;
		player.bot2.card1 = 'duke';
		player.bot2.card2 = 'captain';
		player.bot2.coins = 5;

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'assassination', against: 'bot2' });
		bots.bot2.OnCounterAction = () => 'contessa';
		bots.bot1.OnCounterActionRound = () => true;

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
			game.PLAYER.bot1.card1 === 'assassin' &&
			game.PLAYER.bot1.coins === 1 &&
			game.PLAYER.bot2.card1 === void(0) &&
			game.PLAYER.bot2.card2 === void(0) &&
			game.PLAYER.bot2.coins === 5
		) status = Style.green('PASS');
		console.info(`${ status }  ${ Style.yellow('assassination') } with counter action and successful counter challenge`);
	},
	// bot1 will assassinate bot2 with assassin, bot2 says it has the contessa, bot1 is challenging bot2, bot2 did have the contessa
	'assassination6': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'assassin';
		player.bot1.coins = 4;
		player.bot2.card1 = 'duke';
		player.bot2.card2 = 'contessa';
		player.bot2.coins = 5;

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'assassination', against: 'bot2' });
		bots.bot2.OnCounterAction = () => 'contessa';
		bots.bot1.OnCounterActionRound = () => true;

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
			game.PLAYER.bot1.card1 === void(0) &&
			game.PLAYER.bot1.coins === 1 &&
			game.PLAYER.bot2.card1 === 'duke' &&
			game.PLAYER.bot2.card2 !== void(0) &&
			game.PLAYER.bot2.coins === 5
		) status = Style.green('PASS');
		console.info(`${ status }  ${ Style.yellow('assassination') } with counter action and unsuccessful counter challenge`);
	},
	//  ___   _____   ___     _     _      ___   _  _    ___
	// / __| |_   _| | __|   /_\   | |    |_ _| | \| |  / __|
	// \__ \   | |   | _|   / _ \  | |__   | |  | .` | | (_ |
	// |___/   |_|   |___| /_/ \_\ |____| |___| |_|\_|  \___|
	// bot1 will steal from bot2 with captain
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
			game.PLAYER.bot1.card1 === 'duke' &&
			game.PLAYER.bot2.coins === 3 &&
			game.PLAYER.bot2.card1 === 'duke'
		) status = Style.green('PASS');
		console.info(`${ status }  ${ Style.yellow('stealing') } without challenge or counter action`);
	},
	// bot1 will steal from bot2 with captain, bot2 calls bot1, bot1 did not have the captain
	'stealing2': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.coins = 1;
		player.bot1.card1 = 'duke';
		player.bot2.coins = 5;
		player.bot2.card1 = 'duke';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'stealing', against: 'bot2' });
		bots.bot2.OnChallengeActionRound = () => true;

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
			game.PLAYER.bot1.card1 === void(0) &&
			game.PLAYER.bot2.coins === 5 &&
			game.PLAYER.bot2.card1 === 'duke'
		) status = Style.green('PASS');
		console.info(`${ status }  ${ Style.yellow('stealing') } with successful challenge`);
	},
	// bot1 will steal from bot2 with captain, bot2 calls bot1, bot1 did have the captain
	'stealing3': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.coins = 1;
		player.bot1.card1 = 'captain';
		player.bot2.coins = 5;
		player.bot2.card1 = 'duke';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'stealing', against: 'bot2' });
		bots.bot2.OnChallengeActionRound = () => true;

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = ['duke', 'assassin'];
		game.TURN = 2;
		game.WhoIsLeft = () => ['bot1'];

		await game.Turn();

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.coins === 3 &&
			game.PLAYER.bot1.card1 !== void(0) &&
			game.PLAYER.bot2.coins === 3 &&
			game.PLAYER.bot2.card1 === void(0)
		) status = Style.green('PASS');
		console.info(`${ status }  ${ Style.yellow('stealing') } with unsuccessful challenge`);
	},
	// bot1 will steal from bot2 with captain, bot2 says it has the captain|ambassador, bot1 is fine with that
	'stealing4': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.coins = 1;
		player.bot1.card1 = 'captain';
		player.bot2.coins = 5;
		player.bot2.card1 = 'duke';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'stealing', against: 'bot2' });
		bots.bot2.OnCounterAction = () => 'captain';

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = ['duke', 'assassin'];
		game.TURN = 2;
		game.WhoIsLeft = () => ['bot1'];

		await game.Turn();

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.coins === 1 &&
			game.PLAYER.bot1.card1 === 'captain' &&
			game.PLAYER.bot2.coins === 5 &&
			game.PLAYER.bot2.card1 === 'duke'
		) status = Style.green('PASS');
		console.info(`${ status }  ${ Style.yellow('stealing') } with counter action but no counter challenge`);
	},
	// bot1 will steal from bot2 with captain, bot2 says it has the captain|ambassador, bot1 is challenging bot2, bot2 did not have the captain|ambassador
	'stealing5': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.coins = 1;
		player.bot1.card1 = 'captain';
		player.bot2.coins = 5;
		player.bot2.card1 = 'duke';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'stealing', against: 'bot2' });
		bots.bot2.OnCounterAction = () => 'captain';
		bots.bot1.OnCounterActionRound = () => true;

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = ['duke', 'assassin'];
		game.TURN = 2;
		game.WhoIsLeft = () => ['bot1'];

		await game.Turn();

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.coins === 3 &&
			game.PLAYER.bot1.card1 === 'captain' &&
			game.PLAYER.bot2.coins === 3 &&
			game.PLAYER.bot2.card1 === void(0)
		) status = Style.green('PASS');
		console.info(`${ status }  ${ Style.yellow('stealing') } with counter action and successful counter challenge`);
	},
	// bot1 will steal from bot2 with captain, bot2 says it has the captain|ambassador, bot1 is challenging bot2, bot2 did have the captain|ambassador
	'stealing6': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.coins = 1;
		player.bot1.card1 = 'captain';
		player.bot2.coins = 5;
		player.bot2.card1 = 'captain';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'stealing', against: 'bot2' });
		bots.bot2.OnCounterAction = () => 'captain';
		bots.bot1.OnCounterActionRound = () => true;

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = ['duke', 'assassin'];
		game.TURN = 2;
		game.WhoIsLeft = () => ['bot1'];

		await game.Turn();

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.coins === 1 &&
			game.PLAYER.bot1.card1 === void(0) &&
			game.PLAYER.bot2.coins === 5 &&
			game.PLAYER.bot2.card1 !== void(0)
		) status = Style.green('PASS');
		console.info(`${ status }  ${ Style.yellow('stealing') } with counter action and unsuccessful counter challenge`);
	},
	//  ___  __      __    _     ___   ___   ___   _  _    ___
	// / __| \ \    / /   /_\   | _ \ | _ \ |_ _| | \| |  / __|
	// \__ \  \ \/\/ /   / _ \  |  _/ |  _/  | |  | .` | | (_ |
	// |___/   \_/\_/   /_/ \_\ |_|   |_|   |___| |_|\_|  \___|
	// bot1 will swap cards with ambassador
	'swapping1': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'assassin';
		player.bot1.card2 = 'contessa';
		player.bot2.card1 = 'ambassador';

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
			game.PLAYER.bot1.card2 === 'duke' &&
			game.PLAYER.bot2.card1 === 'ambassador'
		) status = Style.green('PASS');
		console.info(`${ status }  ${ Style.yellow('swapping') } without challenge`);
	},
	// bot1 will swap cards with ambassador, bot2 calls bot1, bot1 did not have the ambassador
	'swapping2': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'assassin';
		player.bot1.card2 = 'contessa';
		player.bot2.card1 = 'ambassador';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'swapping', against: 'bot2' });
		bots.bot1.OnSwappingCards = ({ newCards }) => newCards;
		bots.bot2.OnChallengeActionRound = () => true;

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
			game.PLAYER.bot1.card1 === void(0) &&
			game.PLAYER.bot1.card2 === 'contessa' &&
			game.PLAYER.bot2.card1 === 'ambassador'
		) status = Style.green('PASS');
		console.info(`${ status }  ${ Style.yellow('swapping') } with successful challenge`);
	},
	// bot1 will swap cards with ambassador, bot2 calls bot1, bot1 did have the ambassador
	'swapping3': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'ambassador';
		player.bot1.card2 = 'contessa';
		player.bot2.card1 = 'ambassador';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'swapping', against: 'bot2' });
		bots.bot1.OnSwappingCards = ({ newCards }) => newCards;
		bots.bot2.OnChallengeActionRound = () => true;

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
			game.PLAYER.bot1.card1 !== void(0) &&
			game.PLAYER.bot1.card2 !== void(0) &&
			game.PLAYER.bot2.card1 === void(0)
		) status = Style.green('PASS');
		console.info(`${ status }  ${ Style.yellow('swapping') } with unsuccessful challenge`);
	},
	//  ___    ___    ___   ___   ___    ___   _  _           _     ___   ___
	// | __|  / _ \  | _ \ | __| |_ _|  / __| | \| |  ___    /_\   |_ _| |   \
	// | _|  | (_) | |   / | _|   | |  | (_ | | .` | |___|  / _ \   | |  | |) |
	// |_|    \___/  |_|_\ |___| |___|  \___| |_|\_|       /_/ \_\ |___| |___/
	// bot1 will take bot2 foreign aid
	'foreign-aid1': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'duke';
		player.bot2.card1 = 'duke';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'foreign-aid', against: 'bo2' });

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
			game.PLAYER.bot1.card1 === 'duke' &&
			game.PLAYER.bot2.card1 === 'duke'
		) status = Style.green('PASS');
		console.info(`${ Style.red( status ) }  ${ Style.yellow('foreign-aid') } without counter action`);
	},
	// bot1 will take bot2 foreign aid, bot2 says it has the duke, bot1 is fine with that
	'foreign-aid2': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.coins = 0;
		player.bot1.card1 = 'duke';
		player.bot2.card1 = 'duke';
		player.bot3.card1 = 'captain';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'foreign-aid', against: 'bo2' });
		bots.bot3.OnCounterAction = () => 'duke';

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
			game.PLAYER.bot1.coins === 0 &&
			game.PLAYER.bot1.card1 === 'duke' &&
			game.PLAYER.bot2.card1 === 'duke' &&
			game.PLAYER.bot3.card1 === 'captain'
		) status = Style.green('PASS');
		console.info(`${ Style.red( status ) }  ${ Style.yellow('foreign-aid') } with counter action and no counter challenge`);
	},
	// bot1 will take bot2 foreign aid, bot2 says it has the duke, bot1 calls bot2, bot2 did not have the duke
	'foreign-aid3': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.coins = 0;
		player.bot1.card1 = 'duke';
		player.bot2.card1 = 'duke';
		player.bot3.card1 = 'captain';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'foreign-aid', against: 'bo2' });
		bots.bot3.OnCounterAction = () => 'duke';
		bots.bot1.OnCounterActionRound = () => true;

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
			game.PLAYER.bot1.card1 === 'duke' &&
			game.PLAYER.bot2.card1 === 'duke' &&
			game.PLAYER.bot3.card1 === void(0)
		) status = Style.green('PASS');
		console.info(`${ Style.red( status ) }  ${ Style.yellow('foreign-aid') } with counter action and successful counter challenge`);
	},
	// bot1 will take bot2 foreign aid, bot2 says it has the duke, bot1 calls bot2, bot2 did have the duke
	'foreign-aid4': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.coins = 0;
		player.bot1.card1 = 'duke';
		player.bot2.card1 = 'duke';
		player.bot3.card1 = 'duke';

		const bots = MakeBots();
		bots.bot1.OnTurn = () => ({ action: 'foreign-aid', against: 'bo2' });
		bots.bot3.OnCounterAction = () => 'duke';
		bots.bot1.OnCounterActionRound = () => true;

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
			game.PLAYER.bot1.coins === 0 &&
			game.PLAYER.bot1.card1 === void(0) &&
			game.PLAYER.bot2.card1 === 'duke' &&
			game.PLAYER.bot3.card1 !== void(0)
		) status = Style.green('PASS');
		console.info(`${ Style.red( status ) }  ${ Style.yellow('foreign-aid') } with counter action and unsuccessful counter challenge`);
	},

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
	'SwapCards1': () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'duke';
		player.bot1.card2 = 'contessa';

		game.PLAYER = player;
		game.DECK = ['duke'];

		game.SwapCards({ chosenCards: ['assassin', 'captain'], player: 'bot1', newCards: ['captain', 'assassin'] });

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.card1 === 'assassin' &&
			game.PLAYER.bot1.card2 === 'captain' &&
			game.DECK[ 0 ] === 'duke' &&
			game.DECK[ 1 ] === 'duke' &&
			game.DECK[ 2 ] === 'contessa'
		) status = Style.green('PASS');
		console.info(`${ status }  SwapCards merges cards correctly`);
	},
	'SwapCards2': () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = void(0);
		player.bot1.card2 = 'contessa';

		game.PLAYER = player;
		game.DECK = ['ambassador'];

		game.SwapCards({ chosenCards: ['ambassador', 'captain'], player: 'bot1', newCards: ['captain', 'duke'] });

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.card1 === 'captain' &&
			game.PLAYER.bot1.card2 === void(0) &&
			game.DECK[ 0 ] === 'ambassador' &&
			game.DECK[ 1 ] === 'contessa' &&
			game.DECK[ 2 ] === 'duke'
		) status = Style.green('PASS');
		console.info(`${ status }  SwapCards merges cards correctly even with one card`);
	},
	'SwapCards3': () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'contessa';
		player.bot1.card2 = void(0);

		game.PLAYER = player;
		game.DECK = [];

		game.SwapCards({ chosenCards: ['ambassador', 'ambassador'], player: 'bot1', newCards: ['captain', 'duke'] });

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.card1 === void(0) &&
			game.PLAYER.bot1.card2 === void(0) &&
			game.DECK[ 0 ] === 'contessa' &&
			game.DECK[ 1 ] === 'captain' &&
			game.DECK[ 2 ] === 'duke'
		) status = Style.green('PASS');
		console.info(`${ status }  SwapCards merges cards correctly even when given cards are invalid`);
	},
	'checkParameters1': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'assassin';
		player.bot1.card2 = 'captain';
		player.bot1.coins = 1;
		player.bot2.card1 = 'captain';
		player.bot2.coins = 3;
		player.bot3.card1 = 'duke';

		const bots = MakeBots();
		let output;
		bots.bot1.OnTurn = ( param ) => {
			output = param;
			return { action: 'foreign-aid' };
		};

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = ['contessa'];
		game.TURN = 2;
		game.WhoIsLeft = () => ['bot1'];

		await game.Turn();

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.card1 === 'assassin' &&
			game.PLAYER.bot1.card2 === 'captain' &&
			game.PLAYER.bot1.coins === 3 &&
			game.PLAYER.bot2.card1 === 'captain' &&
			game.PLAYER.bot2.coins === 3 &&
			game.PLAYER.bot3.card1 === 'duke' &&
			game.DECK.length === 1 &&
			output.history.length === 0 &&
			output.myCards[ 0 ] === 'assassin' &&
			output.myCards[ 1 ] === 'captain' &&
			output.myCoins === 1
		) status = Style.green('PASS');
		console.info(`${ status }  we get the right parameters passed in for OnTurn`);
	},
	'checkParameters2': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'assassin';
		player.bot1.card2 = 'captain';
		player.bot1.coins = 1;
		player.bot2.card1 = 'captain';
		player.bot2.coins = 3;
		player.bot3.card1 = 'duke';

		const bots = MakeBots();
		let output;
		bots.bot1.OnTurn = () => ({ action: 'foreign-aid' });
		bots.bot2.OnCounterAction = ( param ) => {
			output = param;
			return false;
		};

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = ['contessa'];
		game.TURN = 2;
		game.WhoIsLeft = () => ['bot1'];

		await game.Turn();

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.card1 === 'assassin' &&
			game.PLAYER.bot1.card2 === 'captain' &&
			game.PLAYER.bot1.coins === 3 &&
			game.PLAYER.bot2.card1 === 'captain' &&
			game.PLAYER.bot2.coins === 3 &&
			game.PLAYER.bot3.card1 === 'duke' &&
			game.DECK.length === 1 &&
			output.action === 'foreign-aid' &&
			output.byWhom === 'bot1'
		) status = Style.green('PASS');
		console.info(`${ status }  we get the right parameters passed in for OnCounterAction`);
	},
	'checkParameters3': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'assassin';
		player.bot1.card2 = 'captain';
		player.bot1.coins = 1;
		player.bot2.card1 = 'captain';
		player.bot2.coins = 3;
		player.bot3.card1 = 'duke';

		const bots = MakeBots();
		let output;
		bots.bot1.OnTurn = () => ({ action: 'foreign-aid' });
		bots.bot2.OnCounterAction = () => 'duke';
		bots.bot3.OnCounterActionRound = ( param ) => {
			output = param;
			return false;
		};

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = ['contessa'];
		game.TURN = 2;
		game.WhoIsLeft = () => ['bot1'];

		await game.Turn();

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.card1 === 'assassin' &&
			game.PLAYER.bot1.card2 === 'captain' &&
			game.PLAYER.bot1.coins === 1 &&
			game.PLAYER.bot2.card1 === 'captain' &&
			game.PLAYER.bot2.coins === 3 &&
			game.PLAYER.bot3.card1 === 'duke' &&
			game.DECK.length === 1 &&
			output.action === 'foreign-aid' &&
			output.byWhom === 'bot1' &&
			output.counterer === 'bot2' &&
			output.card === 'duke'
		) status = Style.green('PASS');
		console.info(`${ status }  we get the right parameters passed in for OnCounterActionRound for duking`);
	},
	'checkParameters4': async () => {
		const game = new COUP;

		const player = MakePlayer();
		player.bot1.card1 = 'assassin';
		player.bot1.card2 = 'captain';
		player.bot1.coins = 4;
		player.bot2.card1 = 'captain';
		player.bot2.coins = 3;
		player.bot3.card1 = 'duke';

		const bots = MakeBots();
		let output;
		bots.bot1.OnTurn = () => ({ action: 'assassination', against: 'bot2' });
		bots.bot2.OnCounterAction = () => 'contessa';
		bots.bot3.OnCounterActionRound = ( param ) => {
			output = param;
			return false;
		};

		game.HISTORY = [];
		game.DISCARDPILE = [];
		game.BOTS = bots;
		game.PLAYER = player;
		game.DECK = ['contessa'];
		game.TURN = 2;
		game.WhoIsLeft = () => ['bot1'];

		await game.Turn();

		let status = Style.red('FAIL');
		if(
			game.PLAYER.bot1.card1 === 'assassin' &&
			game.PLAYER.bot1.card2 === 'captain' &&
			game.PLAYER.bot1.coins === 1 &&
			game.PLAYER.bot2.card1 === 'captain' &&
			game.PLAYER.bot2.coins === 3 &&
			game.PLAYER.bot3.card1 === 'duke' &&
			game.DECK.length === 1 &&
			output.action === 'assassination' &&
			output.byWhom === 'bot1' &&
			output.toWhom === 'bot2' &&
			output.counterer === 'bot2' &&
			output.card === 'contessa'
		) status = Style.green('PASS');
		console.info(`${ status }  we get the right parameters passed in for OnCounterActionRound for assassination`);
	},
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
