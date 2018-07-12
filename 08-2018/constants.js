'use strict';

const Path = require('path');
const Fs = require('fs');


const GetPlayer = ( path = '.' ) => {
	return Fs
		.readdirSync( path )
		.map( name => Path.join( path, name ) )
		.filter( item => Fs.lstatSync( item ).isDirectory() )
		.filter( folder => !folder.startsWith('.') );
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
