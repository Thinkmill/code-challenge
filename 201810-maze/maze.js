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
	new MAZE({
		level: 1,
		userPath,
	}).Start();
}

// if( process.argv.includes('loop') ) {
// 	const loop = new LOOP();
// 	const debug = process.argv.includes('-d');

// 	loop.Run( debug );
// }
