'use strict';

const Style = {
	parse: ( text, start, end = '39m' ) => {
		if( text !== undefined ) {
			return `\u001B[${ start }${ text }\u001b[${ end }`;
		}
		else {
			return ``;
		}
	},
	black: text => Style.parse( text, '30m' ),
	red: text => Style.parse( text, '31m' ),
	green: text => Style.parse( text, '32m' ),
	yellow: text => Style.parse( text, '33m' ),
	blue: text => Style.parse( text, '34m' ),
	magenta: text => Style.parse( text, '35m' ),
	cyan: text => Style.parse( text, '36m' ),
	white: text => Style.parse( text, '37m' ),
	gray: text => Style.parse( text, '90m' ),
	bold: text => Style.parse( text, '1m', '22m' ),
};


module.exports = exports = {
	Style,
};
