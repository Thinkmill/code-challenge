'use strict';

const { Style } = require('../helper.js');
const { COUP } = require('../index.js');
const assert = require('assert');

const TEST = {
	'testing': async () => {
		assert(1 + 1 === 2, 'I must be true');
	},
};

const PASS = Style.green('PASS');
const FAIL = Style.red('FAIL');

Object
	.entries( TEST )
	.forEach( async ([ name, test ]) => {
		try {
			await test()
			console.info(`${PASS} ${name}`);
		} catch (err) {
			console.error(`${FAIL} ${name}`);
			console.error(err);
		}
	});


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
