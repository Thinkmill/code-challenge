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
		pattern: /^(?!export|default|let)[a-zA-Z]+$/,
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
	for (let [type, { pattern, includeValue }] of Object.entries(
		possibleTokens
	)) {
		if (pattern.test(buffer.trim())) {
			return includeValue
				? {
						type,
						value: buffer.trim()
				  }
				: { type };
		}
	}
	return null;
}

const tokenizer = code => {
	let tokens = [];

	let buffer = "";

	let chars = code.split("");
	Char: for (let i = 0; i < chars.length; ) {
		buffer += chars[i];
		console.log(buffer.trim());
		PossibleTokens: for (let [
			type,
			{ pattern, includeValue }
		] of Object.entries(possibleTokens)) {
			if (pattern.test(buffer.trim())) {
				let val = includeValue
					? {
							type,
							value: buffer.trim()
					  }
					: { type };
				console.log(val);
				let lastVal = val;
				let innerStr = buffer;
				let innerI = i;

				while (val !== null && i < chars.length) {
					console.log(innerStr);
					lastVal = val;
					innerI++;
					innerStr += chars[innerI];
					val = tryThing(innerStr);
				}
				i += innerStr.length - buffer.length;
				buffer = "";
				tokens.push(lastVal);
				continue Char;
			}
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

const generate = code => {
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
