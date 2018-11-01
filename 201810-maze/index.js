'use strict';

const { Style } = require('./../201808-coup/helper.js');
const Writable = require('stream').Writable;
const LEVELS = require('./levels.json');
const Readline = require('readline');
const CliSize = require('cli-size');
const Path = require('path');
const Fs = require('fs');


class MAZE {
	constructor({ level = 1, userPath }) {
		this.muted = true;

		if( !LEVELS[ level ] ) {
			console.error(`${ Style.red(`Level ${ level } does not exist! We only got `) }${ Style.yellow( Object.keys( LEVELS ).join(', ') ) }`);
			process.exit( 1 );
		}
		this.level = level;
		this.position = LEVELS[ this.level ].start;
		this.end = LEVELS[ this.level ].end;
		this.map = LEVELS[ this.level ].map;
		this.width = LEVELS[ this.level ].width;
		this.height = LEVELS[ this.level ].height;
		this.maxSteps = this.width * this.height * 4;
		this.history = [ this.position ];
		this.step = 0;
		this.stepTime = 500;

		this.block = Style.white('▓');
		this.shadow = Style.gray('░');
		this.shadowBlock = Style.white('░');
		this.hero = Style.magenta('Φ');
		this.goal = Style.green('x');

		try {
			const BOT = require(`./${ userPath }`);
			this.BOT = new BOT({
				size: { width: this.width, height: this.height },
				start: this.position,
				end: this.end,
			});
		}
		catch( error ) {
			console.error( Style.red( error ) );
		}

		const CustomStdout = new Writable({
			write: ( chunk, encoding, callback ) => {
				if( !this.muted ) {
					process.stdout.write( chunk, encoding );
				}

				callback();
			}
		});

		this.RL = Readline.createInterface({
			input: process.stdin,
			output: CustomStdout,
			terminal: true,
			historySize: 0,
		});

		Readline.emitKeypressEvents( process.stdin );
		process.stdin.setEncoding('utf8');

		if(process.stdin.isTTY) {
			process.stdin.setRawMode( true );
		}

		process.on('SIGWINCH', () => { // redraw on terminal resize
			this.Frame();
			this.Board();
		});

		process.stdin.on('keypress', (chunk, key) => { // redraw frame and board on terminal resize
			this.RL.clearLine();

			if( key.name === 'right' ) {
				clearTimeout( this.timeout );
				this.Play();
			}
			else if( key.name === 'left' ) {
				clearTimeout( this.timeout );
				this.step -= 2;
				if( this.step < 0 ) this.step = 0;
				this.Play();
			}
			else if( key.name === 'q' ) {
				process.exit( 0 );
			}
			else {
				return;
			}
		});
	}

	Start() {
		this.Frame();
		this.Board();
		this.Record();
	}

	Record() {
		const newPos = this.GetCoord( this.BOT.Move({ MAP: this.GetMap() }) );
		this.position = this.GetPos( newPos[ 0 ], newPos[ 1 ] ) ? newPos : this.position;
		this.history.push( this.position );

		if( this.position[0] === this.end[0] && this.position[1] === this.end[1] ) {
			this.Message(`Press ${ Style.yellow('q') } to end`);
			this.Play();
		}
		else {
			if( this.history.length < this.maxSteps ) {
				process.nextTick(() => this.Record());
			}
			else {
				this.Play();
			}
		}
	}

	Play() {
		this.Board();

		const nextStep = this.history[ this.step ];
		if( nextStep ) {
			this.position = nextStep;
			this.step ++;
		}

		this.Board();
		this.Score( this.step );

		if( this.position[0] === this.end[0] && this.position[1] === this.end[1] ) {
			this.Banner('  you won!  ');
		}
		else {
			if( this.step < this.maxSteps ) {
				this.timeout = setTimeout( () => this.Play( this.step ), this.stepTime );
			}
			else {
				this.Banner('  you lost!  ');
			}
		}
	}

	GetMap( position = this.position ) {
		return [
			[
				this.GetPos( position[ 0 ] - 2, position[ 1 ] - 2 ),
				this.GetPos( position[ 0 ] - 2, position[ 1 ] - 1 ),
				this.GetPos( position[ 0 ] - 2, position[ 1 ] - 0 ),
				this.GetPos( position[ 0 ] - 2, position[ 1 ] + 1 ),
				this.GetPos( position[ 0 ] - 2, position[ 1 ] + 2 ),
			],
			[
				this.GetPos( position[ 0 ] - 1, position[ 1 ] - 2 ),
				this.GetPos( position[ 0 ] - 1, position[ 1 ] - 1 ),
				this.GetPos( position[ 0 ] - 1, position[ 1 ] - 0 ),
				this.GetPos( position[ 0 ] - 1, position[ 1 ] + 1 ),
				this.GetPos( position[ 0 ] - 1, position[ 1 ] + 2 ),
			],
			[
				this.GetPos( position[ 0 ] - 0, position[ 1 ] - 2 ),
				this.GetPos( position[ 0 ] - 0, position[ 1 ] - 1 ),
				this.GetPos( position[ 0 ] - 0, position[ 1 ] - 0 ),
				this.GetPos( position[ 0 ] - 0, position[ 1 ] + 1 ),
				this.GetPos( position[ 0 ] - 0, position[ 1 ] + 2 ),
			],
			[
				this.GetPos( position[ 0 ] + 1, position[ 1 ] - 2 ),
				this.GetPos( position[ 0 ] + 1, position[ 1 ] - 1 ),
				this.GetPos( position[ 0 ] + 1, position[ 1 ] - 0 ),
				this.GetPos( position[ 0 ] + 1, position[ 1 ] + 1 ),
				this.GetPos( position[ 0 ] + 1, position[ 1 ] + 2 ),
			],
			[
				this.GetPos( position[ 0 ] + 2, position[ 1 ] - 2 ),
				this.GetPos( position[ 0 ] + 2, position[ 1 ] - 1 ),
				this.GetPos( position[ 0 ] + 2, position[ 1 ] - 0 ),
				this.GetPos( position[ 0 ] + 2, position[ 1 ] + 1 ),
				this.GetPos( position[ 0 ] + 2, position[ 1 ] + 2 ),
			],
		];
	}

	GetPos( x, y ) {
		if( !this.map[ x ] ) return false;
		return !!this.map[ x ][ y ];
	}

	GetCoord( movement, position = this.position ) {
		if( movement === 'up' ) return [ position[ 0 ] - 1, position[ 1 ] ];
		else if( movement === 'right' ) return [ position[ 0 ], position[ 1 ] + 1 ];
		else if( movement === 'down' ) return [ position[ 0 ] + 1, position[ 1 ] ];
		else if( movement === 'left' ) return [ position[ 0 ], position[ 1 ] - 1 ];
		else return position;
	}

	CheckSize( width = this.frameWidth, height = this.frameHeight + 4 ) {
		let error = false;

		if( CliSize().columns < width ) {
			error = `\n  Your console window is not wide enough for this game\n` +
				`  Please resize your window to at least ${ width } x ${ height }\n` +
				`  (It is ${ CliSize().columns } x ${ CliSize().rows })\n`;
		}

		if( CliSize().rows < height ) {
			error = `\n  Your console window is not tall enough for this game\n` +
				`  Please resize your window to at least ${ width } x ${ height }\n` +
				`  (It is ${ CliSize().columns } x ${ CliSize().rows })\n`;
		}

		return error;
	}

	GetSpaceLeft( width = this.width ) {
		return Math.floor( ( CliSize().columns - width ) / 2 );
	}

	GetSpaceTop( height = this.height ) {
		return Math.ceil( ( CliSize().rows - height ) / 2 );
	}

	Frame() {
		const logoLeft = ''.padStart( this.GetSpaceLeft( 43 ), ' ' );
		const logo = [
			`${ logoLeft }${ Style.green('_|      _|    _|_|    _|_|_|_|_|  _|_|_|_|') }`,
			`${ logoLeft }${ Style.green('_|_|  _|_|  _|    _|        _|    _|') }`,
			`${ logoLeft }${ Style.green('_|  _|  _|  _|_|_|_|      _|      _|_|_|') }`,
			`${ logoLeft }${ Style.red('_|      _|  _|    _|    _|        _|') }`,
			`${ logoLeft }${ Style.red('_|      _|  _|    _|  _|_|_|_|_|  _|_|_|_|') } ${ Style.gray(`level${ this.level }`) }\n`,
		];
		this.frameWidth = this.width + 2;
		this.frameHeight = this.height + 4 + logo.length;

		this.muted = false;
		const error = this.CheckSize();
		if( error ) {
			this.RL.write(`\n\n${ Style.red( error ) }`);
		}
		else {
			Readline.cursorTo( this.RL, 0, 0 );
			Readline.clearScreenDown( this.RL );

			const spaceLeft = ''.padStart( this.GetSpaceLeft( this.frameWidth ), ' ' );
			const spaceTop = '\n'.repeat( this.GetSpaceTop( this.frameHeight ) );

			this.RL.write( spaceTop );
			this.RL.write( logo.join('\n') );

			this.RL.write(`${ spaceLeft }${ Style.gray(`┌${ '─'.repeat( this.width ) }┐`) }\n`);
			this.RL.write(`${ spaceLeft }${ Style.gray(`│${ ' '.repeat( this.width ) }│`) }\n`.repeat( this.height ));
			this.RL.write(`${ spaceLeft }${ Style.gray(`└${ '─'.repeat( this.width ) }┘`) }\n\n`);

			this.RL.write( spaceTop );
			this.Message(` Press ${ Style.yellow('q') } to end`);
		}

		this.muted = true;
	}

	Board() {
		this.muted = false;
		let left = this.GetSpaceLeft( this.frameWidth ) + 1;
		let top = this.GetSpaceTop( this.frameHeight - 11 );
		let output = '';

		for( let h = 0; h < this.height; h++ ) {
			output += Style.gray( '│'.padStart( left, ' ' ) );

			for( let w = 0; w < this.width; w++ ) {
				if( h === this.position[ 0 ] && w === this.position[ 1 ] ) {
					output += this.hero;
				}
				else if( h === this.end[ 0 ] && w === this.end[ 1 ] ) {
					output += this.goal;
				}
				else {
					let block = this.shadowBlock;
					let space = this.shadow;

					if(
						h >= this.position[ 0 ] - 2 &&
						h <= this.position[ 0 ] + 2 &&
						w >= this.position[ 1 ] - 2 &&
						w <= this.position[ 1 ] + 2
					) {
						block = this.block;
						space = ' ';
					}

					output += this.map[ h ][ w ] ? space : block;
				}
			}
			output += '\n';
		}

		Readline.cursorTo( this.RL, 0, top );
		this.RL.write( output );

		Readline.cursorTo( this.RL, 0, ( CliSize().rows - 1 ) );
		this.muted = true;
	}

	Banner( msg ) {
		this.muted = false;
		const left = Math.floor(( CliSize().columns / 2 ) - ( msg.length / 2 ));
		const top = Math.floor( CliSize().rows / 2 );
		Readline.cursorTo( this.RL, left, (top - 1) );
		this.RL.write( ''.padStart( msg.length, ' ' ) );
		Readline.cursorTo( this.RL, left, top );
		this.RL.write( msg );
		Readline.cursorTo( this.RL, left, (top + 1) );
		this.RL.write( ''.padStart( msg.length, ' ' ) );
		Readline.cursorTo( this.RL, 0, ( CliSize().rows - 1 ) );
		this.muted = true;
	}

	Message( msg ) {
		this.muted = false;
		Readline.cursorTo( this.RL, 0, ( CliSize().rows - 1 ) );
		this.RL.write( msg );
		this.muted = true;
	}

	Score( step ) {
		const total = this.history.length;
		const totalLength = total.toString().length;
		this.muted = false;
		Readline.cursorTo( this.RL, 0, 1 );
		this.RL.write(`Total steps: ${ total } | Current: ${ step } | Outcome: ${
			this.history.length === this.maxSteps
				? Style.red( 'loss'.padEnd( totalLength + 4 ) )
				: Style.green( 'win'.padEnd( totalLength + 3 ) )
		}`);
		Readline.cursorTo( this.RL, 0, ( CliSize().rows - 1 ) );
		this.muted = true;
	}

	_randInt( n ) {
		return Math.floor( n * Math.random() )
	}

	_solveable( map, s, e ) {
		if (!map[s[0]][s[1]]) return false;
		const n=map.length;
		const ns=map.reduce((acc, row, i) => ({...acc, ...row.reduce((o, c, j) => ({...o, [i*n + j]: c}), {})}) ,{});
		const v=Object.keys(ns).reduce((o, k) => ({...o, [k]: false}), {});
		let cn=s[1]*n+s[0]
		const cs=[cn];
		v[cn]=true;
		while (cn!==e[1]*n+e[0] && cn !== undefined) {
			const x=cn%n;
			const y=(cn-cn%n)/n;
			const nn=[[x,y+1],[x+1,y],[x,y-1],[x-1,y]].filter(p=>p.every(z=>z>=0&&z<n)).map(([xx,yy])=>yy*n+xx).find(q=>!v[q]&&ns[q]);
			if (nn===undefined) {
				cs.pop();
			} else {
				cs.push(nn);
				v[nn]=true;
			}
			cn=cs.slice(-1)[0];
		}
		return cn===e[1]*n+e[0];
	}

	generateMap( n, difficulty, start, end ) {
		let attempts = 0;
		while (attempts < 1000) {
			const map = Array(n).fill().map(_ => Array(n).fill(true));

			let blocks = n * n * difficulty;

			while (blocks > 0) {
				map[this._randInt(n)][this._randInt(n)] = false;
				blocks--;
			}

			if (this._solveable(map, start, end)) return map;
			attempts ++;
		}
	}
}


module.exports = exports = {
	MAZE,
};
