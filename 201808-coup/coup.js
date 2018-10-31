#!/usr/bin/env node

const { COUP, LOOP } = require('./index.js');

if (process.argv.includes('play') || !process.argv.includes('loop')) {
	new COUP().Play();
}

if (process.argv.includes('loop')) {
	const loop = new LOOP();
	const debug = process.argv.includes('-d');

	loop.Run(debug);
}
