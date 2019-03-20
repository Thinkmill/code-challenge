// @flow
// DefaultExport:: "export default"
// VariableDeclarator:: "let"
// Identifier:: /[a-zA-Z]+/
// Number:: /[0-9]+/
// VariableAssignmentOperator:: "="
// BinaryOperator:: "+" | "-" | "*"
// LineBreak:: "\n"

let possibleTokens = {
	DefaultExport: {
		pattern: /^export default$/
	},
	VariableDeclarator: {
		pattern: /^let$/
	},
	Identifier: {
		pattern: /^[a-zA-Z]+$/,
		includeValue: true
	},
	Number: {
		pattern: /^[0-9]+$/,
		includeValue: true
	},
	VariableAssignmentOperator: {
		pattern: /^=$/
	},
	BinaryOperator: {
		pattern: /^(\+|-|\*)$/,
		includeValue: true
	},
	LineBreak: {
		pattern: /^\n$/
	}
};

function tryThing(buffer) {
	for (let type of Object.keys(possibleTokens)) {
		let thing = possibleTokens[type];
		let value = buffer.replace(/(\t| )+$/g, "").replace(/^(\t| )+/g, "");
		if (thing.pattern.test(value)) {
			return thing.includeValue
				? {
						type,
						value
				  }
				: { type };
		}
	}
	return null;
}

let keywordPattern = /export|default|let/;

const tokenizer = (
	code /*: string */
) /*: Array<{ type: string, value?: string }>*/ => {
	let tokens = [];

	let buffer = "";

	let chars = code.split("");
	Char: for (let i = 0; i < chars.length; ) {
		buffer += chars[i];
		let thing = tryThing(buffer);
		if (thing !== null) {
			let val = thing;
			let lastVal = val;
			let innerStr = buffer;
			let innerI = i;

			while (val !== null && innerI < chars.length) {
				lastVal = val;
				innerI++;
				innerStr += chars[innerI];
				val = tryThing(innerStr);
			}

			i += innerStr.length - buffer.length;
			if (
				lastVal.type === "Identifier" &&
				// $FlowFixMe
				keywordPattern.test(lastVal.value)
			) {
				i++;
				buffer = innerStr;
				continue Char;
			}
			buffer = "";
			tokens.push(lastVal);
			continue Char;
		}
		i++;
	}
	return tokens;
};

const parser = tokens => {
	/* ... */
	return {}; // an object which is our AST - we can actually refer back to the tree traversal stuff we did
};

const transformer = AST => {
	/* ... */
	return {}; // a modified AST
};

const generator = AST => {
	/* ... */
	return ``; // a string that is code
};

const generate = (code /*:string*/) => {
	const tokens = tokenizer(code);
	const AST = parser(tokens);
	const transformedAST = transformer(AST);
	const newCode = generator(transformedAST);
	return newCode;
};

module.exports = generate;
module.exports.tokenizer = tokenizer;
module.exports.parser = parser;
module.exports.transformer = transformer;
module.exports.generator = generator;
