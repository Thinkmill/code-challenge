'use strict';

const Style = {
	parse: ( text, start, end = `39m` ) => {
		if( text !== undefined ) {
			const replace = new RegExp( `\\u001b\\[${ end }`, 'g' ); // find any resets so we can nest styles
			return `\u001B[${ start }${ text.toString().replace( replace, `\u001B[${ start }` ) }\u001b[${ end }`;
		}
		else {
			return ``;
		}
	},
	strip: ( text ) => {
		const pattern = [
			'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)',
			'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'
		].join('|');
		const ansi = new RegExp(pattern, 'g');

		if( typeof text === 'string' ) {
			return text.replace( ansi, '' );
		}
		else {
			return text;
		}
	},
	black: text => Style.parse( text, `30m` ),
	red: text => Style.parse( text, `31m` ),
	green: text => Style.parse( text, `32m` ),
	yellow: text => Style.parse( text, `33m` ),
	blue: text => Style.parse( text, `34m` ),
	magenta: text => Style.parse( text, `35m` ),
	cyan: text => Style.parse( text, `36m` ),
	white: text => Style.parse( text, `37m` ),
	gray: text => Style.parse( text, `90m` ),
	bold: text => Style.parse( text, `1m`, `22m` ),
};


module.exports = exports = {
	Style,
};
