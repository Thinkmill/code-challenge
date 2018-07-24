August 2018 challenge
=====================

This months challenge consists of you writing a bot to compete against other bots in the game of [COUP](http://gamegrumps.wikia.com/wiki/Coup).
We will have the three rounds of (1,000,000) games to find the winner (sum all scores). Between each round you have time to make adjustments to your bot.
Dates:
- First round: **on Wednesday the 25th July**
- Second round: **on Wednesday the 1st August**.
- Final round: **on Wednesday the 8th of August**.

## RULEZ

1. Node only
1. No dependencies
1. No changes to engine
1. Name folder appropriately (so you can target specific bots)
1. No data sharing between games
1. No access to other bots
1. No changing other bots
1. No Internet
1. No js prototype changing
1. Your code has to stay inside your bots folder
1. Do not output to `stdout`
1. At the beginning of each round you add PRs to the repo (we only merge on the day the round begins)

## Scoring

Each game is a zero-sum-game in terms of score. The score is determined by the number of players (can't be more than 6 per game) and winners
(there are instances where the game can stall in a stale-mate with multiple winners).
Each game will take a max of 6 bots that are randomly elected. Those who win get positive score, those who lose will get negative score.

- Score for losers: -1/(players-1)
- Score for winners: ∑losers/winners

## How to run the game?

The game comes with a simple "dumb" bot that just randomizes it's answers without checking much whether the actions are appropriate.
Each bot lives inside a folder and is named after that folder name.

```sh
.
├── bot1
│   └── index.js
├── bot2
│   └── index.js
├── bot3
│   └── index.js
│
├── README.md
├── constants.js
├── helper.js
├── index.js
└── test.js
```

To run the game `cd` into the challenge `201808` folder and run:

```sh
node index.js play
```

To run 1000 games:

```sh
node index.js loop
```

To run `n` number of games:

```sh
node index.js loop -r [n]
```

In the loop rounds all output is suppressed so that the games run smoothly on the day.
For development please use the `-d` flag to enable debug mode. It will stop the game loop when it
encounters an error and display the last game with error.

```sh
node index.js loop -r [number] -d
```

To run the test suit:

```sh
node test.js
```


## How do I build a bot?

- Create a folder in the root (next to the fake bot)
- Pick the name of the folder from the player list below
- Include an `index.js` file that exports below class
- Run as many test rounds as you want to
- Create PR on the day of each round

You get to require 4 functions from the engine at `constants.js` inside your bot:

- `ALLBOTS()` Returns an array of all players in the game `<Player>`
- `CARDS()` Returns an array of all 5 card types `<Card>`
- `DECK()` Returns an array of all cards in the deck (3 of each)
- `ACTIONS()` Returns an array of all actions `<Action>`

### `<Player>`

- `AbbasA`
- `BenC`
- `BorisB`
- `CharlesL`
- `JedW`
- `DomW`
- `JessT`
- `JohnM`
- `JossM`
- `KevinY`
- `LaurenA`
- `MalB`
- `MikeG`
- `MikeH`
- `NathS`
- `SanjiyaD`
- `TiciA`
- `TimL`
- `TomW`
- `TuanH`

### `<Card>`

- `duke`
- `assassin`
- `captain`
- `ambassador`
- `contessa`

### `<Action>`

- `taking-1`
- `foreign-aid`
- `couping`
- `taking-3`
- `assassination`
- `stealing`
- `swapping`

### `<CounterAction>`

- `foreign-aid` -> [`duke`, `false`],
- `assassination` -> [`contessa`, `false`],
- `stealing` -> [`captain`, `ambassador`, `false`],
- `taking-3` -> [`duke`, `false`],

### Class to export

The class you have to export from your bot needs to include the below methods:

- `OnTurn`
	- Called when it is your turn to decide what you may want to do
	- parameters: `{ history, myCards, myCoins, otherPlayers, discardedCards }`
	- returns: `{ action: <Action>, against: <Player> }`
- `OnChallengeActionRound`
	- Called when another bot made an action and everyone get's to decide whether they want to challenge that action
	- parameters: `{ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom }`
	- returns: `<Boolean>`
- `OnCounterAction`
	- Called when someone does something that can be countered with a card: `foreign-aid`, `stealing` and `assassination`
	- parameters: `{ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom }`
	- returns: `<CounterAction>`
- `OnCounterActionRound`
	- Called when a bot did a counter action and everyone get's to decided whether they want to challenge that counter action
	- parameters: `{ history, myCards, myCoins, otherPlayers, discardedCards, action, byWhom, toWhom, card, counterer }`
	- returns: `<Boolean>`
- `OnSwappingCards`
	- Called when you played your ambassador and now need to decide which cards you want to keep
	- parameters: `{ history, myCards, myCoins, otherPlayers, discardedCards, newCards }`
	- returns: `Array(<Card>)`
- `OnCardLoss`
	- Called when you lose a card to decide which one you want to lose
	- parameters: `{ history, myCards, myCoins, otherPlayers, discardedCards }`
	- returns: `<Card>`

### The parameters

Each function is passed one parameter object that can be deconstructed into the below items.

| parameter        | description                   |
|------------------|-------------------------------|
| `history`        | The history array. More below `Array(<History>)` |
| `myCards`        | An array of your cards `Array(<Card>)` |
| `myCoins`        | The number of coins you have |
| `otherPlayers`   | An array of objects of each player, format: `[{ name: <Player>, coins: <Integer>, cards: <Integer> }, { name: <Player>, coins: <Integer>, cards: <Integer> }]` |
| `discardedCards` | An array of all cards that have been discarded so far (from penalties, coups or assassinations) |
| `action`         | The action that was taken `<Action>` |
| `byWhom`         | Who did the action `<Player>` |
| `toWhom`         | To whom is the action directed `<Player>` |
| `card`           | A string of the counter action taken by the previous bot
| `newCards`       | An array of cards for the ambassador swap `Array(<Card>)` |
| `counterer`      | The player who countered an action |

### The history array

Each event is recorded in the history array. See below a list of all events and it's entires:

An action:
```
{
	type: 'action',
	action: <Action>,
	from: <Player>,
}
```

Lose a card:
```
{
	type: 'lost-card',
	player: <Player>,
	lost: <Card>,
}
```

Challenge outcome:
```
{
	type: 'challenge-round' || 'counter-round',
	challenger: <Player>,
	challengee: <Player>,
	player: <Player>,
	action: <Action>,
	lying: <Boolean>,
}
```

A Penalty:
```
{
	type: 'penalty',
	from: <Player>,
}
```

An unsuccessful challenge:
```
{
	type: 'unsuccessful-challenge',
	action: 'swap-1',
	from: <Player>,
}
```

A counter action:
```
{
	type: 'counter-action',
	action: <Action>,
	from: <Player>,
	to: <Player>,
	counter: <Action>,
}
```

## How does the engine work?

The challenge algorithm:

```
if( assassination, stealing, swapping )
	ChallengeRound via all bot.OnChallengeActionRound
		? false = continue
		: true = stop

if( foreign-aid, assassination, stealing )
	CounterAction via bot.OnCounterAction
		? false = continue
		: true = CounterChallengeRound via bot.OnCounterActionRound
			? false = continue
			: true = stop

else
	do-the-thing
```
