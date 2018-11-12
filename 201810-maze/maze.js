#!/usr/bin/env node

const { Style } = require('./../201808-coup/helper.js');
const { MAZE } = require('./index.js');
const Path = require('path');
const Fs = require('fs');

const userPath = Path.normalize( process.argv[ 3 ] );

if( !Fs.existsSync( userPath ) ) {
	console.error(`\n\n${ Style.red('The user ') }${ Style.yellow( userPath ) }${Style.red(' was not found.')}\n\n`);
	process.exit( 1 );
}


if( process.argv.includes('play') ) {
	let level = 1;
	let levelIndex = process.argv.indexOf('-l');
	if( levelIndex === -1 ) {
		levelIndex = process.argv.indexOf('--level');
	}

	if( levelIndex !== -1 && process.argv[( levelIndex + 1 )] ) {
		level = process.argv[( levelIndex + 1 )];
	}

	let speed;
	let speedIndex = process.argv.indexOf('-s');
	if( speedIndex === -1 ) {
		speedIndex = process.argv.indexOf('--speed');
	}

	if( speedIndex !== -1 && process.argv[( speedIndex + 1 )] ) {
		speed = process.argv[( speedIndex + 1 )];
	}

	new MAZE({
		level,
		userPath,
    stepTime: speed,
	}).Start();
}

// if( process.argv.includes('loop') ) {
// 	const loop = new LOOP();
// 	const debug = process.argv.includes('-d');

// 	loop.Run( debug );
// }
