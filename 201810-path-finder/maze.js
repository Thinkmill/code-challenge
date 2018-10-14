#!/usr/bin/env node

const { MAZE } = require('./index.js');

if( process.argv.includes('play') || !process.argv.includes('loop') ) {
	new MAZE({ level: 1 }).Play();
}

// if( process.argv.includes('loop') ) {
// 	const loop = new LOOP();
// 	const debug = process.argv.includes('-d');

// 	loop.Run(debug);
// }
