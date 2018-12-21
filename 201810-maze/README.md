October 2018 challenge
======================

This months challenge consists of you writing a bot to solve a maze.
We will have three levels, level > 1 will be announced soon.

![Maze](https://raw.githubusercontent.com/Thinkmill/code-challenge/master/201810-maze/maze.gif)

Level 1: **DUE 31st Oct**
Level 2: **DUE 14th Nov**
Level 3: **DUE 23rd Jan**

## RULEZ

1. Node only
1. No dependencies
1. No changes to engine
1. Put your bot into a folder and name folder appropriately
1. No data sharing between games
1. No Internet
1. No js prototype changing
1. Your code has to stay inside your bots folder
1. Do not output to `stdout`
1. At the beginning of each round, add your bot to a new folder then open a PR to this repo (we only merge on the day the round begins)

## Levels

- **LEVEL 1**
	Solve the maze by going to the green cross.
	You have 3000 steps to solve the first level.
	Due 31st Oct
- **LEVEL 2**
	Solve both levels with the same bot.
	You have 3000 steps to solve the first level.
	You have 6000 steps to solve the first level.
	Due 14th Nov
- **LEVEL 3**
	Solve all three levels with the same bot.
	You have 3000 steps to solve the first level.
	You have 6000 steps to solve the first level.
	You have 9120 steps to solve the last level.
	Due 23rd Jan

## How to run the game?

The game comes with a small "example" bot that just randomizes it's movements.

To run the game for a bot `cd` into the challenge `201810-maze` folder.
To play the game run:

```sh
yarn play example/index.js --level 1
```

_(💡  Tip: `--level` & `--speed` are optional. See [CLI Options](#cli-options) below.)_

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

So in the example above to run the game for bot2 you must run:

```sh
yarn play bot2/index.js
```

Once the game runs you can use the key `q` to quit the game any time.
You can also use the arrow functions `←` and `→` to step through each step your bot has taken.
Go back in history and analyses where your bot went wrong etc.

### CLI Options

```
--level|-l  Set the level to run (Default: 1)
--speed|-s  Set the time in milliseconds between each step (Default: 500)
```

## How do I build a bot?

- Create a folder in the root (next to the example bot)
- Include a javascript file that exports below class

### Class to export

The example bot is structured like this:

```js
class BOT {
	constructor({ size, start, end }) {}

	Move({ MAP }) {
		const actions = ['up', 'right', 'down', 'left'];
		return actions[ Math.floor( Math.random() * actions.length ) ];
	}
}

module.exports = exports = BOT;
```

The class you have to export from your bot needs to include the below method:

- `Move`
	- Called when it is your turn to decide where to go
	- parameters: `{ MAP }`
	- return: `'up' | 'right' | 'down' | 'left'`
- `constructor` of your class
	- parameters: `size`, `start`, `end`

### The parameters

`MAP` is an array of arrays and tells you in a grid of 5x5 around you where blocks are.

`false` = blocks
`true` = no blocks

An example would be:

```js
MAP = [
	[ true, false, true, true, true ],
	[ true, true, true, true, false ],
	[ true, true, false, true, true ],
	[ false, true, true, false, true ],
	[ true, true, true, false, true ],
];
```
This would visualize as:

```sh
░ ▓ ░ ░ ░
░ ░ ░ ░ ▓
░ ░ ▓ ░ ░
▓ ░ ░ ▓ ░
░ ░ ░ ▓ ░
```

Your constructor of your BOT will also get three parameters:

- `size` = `{ width: <Number>, height: <Number> }` - The size of your board
- `start` = `[ <Number>, <Number> ]` - The position you're starting at _(The first number is the row, the second the column)_
- `end` = `[ <Number>, <Number> ]` - The position you want to go to _(The first number is the row, the second the column)_

## How does the engine work?

The engine will run the entire game and populate a history array with all the steps your bot has taken.
Only then will it start playing it back to you.
This gives you the power to go through the history at your own pace and even go back in time.
That's the reason why the outcome of the game is displayed on the top right away.
