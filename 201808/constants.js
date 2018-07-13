'use strict';

const Path = require('path');
const Fs = require('fs');


const GetPlayer = ( path = '.' ) => {
	const allPlayer = Fs
		.readdirSync( path )
		.map( name => Path.join( path, name ) )
		.filter( item => Fs.lstatSync( item ).isDirectory() )
		.filter( folder => !folder.startsWith('.') );

	if( allPlayer.length < 2 ) {
		console.error(`\n🛑  We need at least two player to play this game!\n`);
		process.exit(1);
	}
	else if( allPlayer.length > 6 ) {
		console.error(`\n🛑  Only 6 can play this game at the same time!\n`);
		process.exit(1);
	}
	else {
		return allPlayer;
	}
}

const ALLPLAYER = GetPlayer();

const CARDS = [ 'duke', 'assassin', 'captain', 'ambassador', 'contessa' ];

const GetStack = ( cards = CARDS ) => {
	let STACK = [];
	cards.forEach( card => STACK = [ ...STACK, ...new Array(3).fill( card ) ] );
	return STACK;
}

const DECK = GetStack();

const ACTIONS = [
	'taking-1',
	'foreign-aid',
	'couping',
	'taking-3',
	'assassination',
	'stealing',
	'swapping',
];


module.exports = exports = {
	ALLPLAYER,
	CARDS,
	DECK,
	ACTIONS,
};
