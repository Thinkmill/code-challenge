const tokenizer = code => {
	/* ... */
	if (!code) return [];
	const truncatedCode = truncate(code);
	console.log('truncate', truncatedCode);
	const splitCode = truncatedCode.split(' ').filter(v => v !== '');
	console.log('SPLITCODE', splitCode);
	const cleanedCode = cleanCode(splitCode);
	const tokens = cleanedCode.filter(v => v).map(convertToToken);
	console.log('TOKENS', tokens);
	return tokens; // an array of tokens in processed order
};

const truncate = code => code.replace(/\b/gi,' ');

const cleanCode = code => {
	return code.map(v => v.replace(/\t+/, '')).reduce((acc, curr) => {
		if (curr.match(/\n/)) {
			const linebreakIndex = curr.indexOf('\n');
			const a = curr.substring(0, linebreakIndex);
			const b = curr.substring(linebreakIndex, linebreakIndex + 1);
			const c = curr.substring(linebreakIndex + 1, code.length);
			console.log('HELLO', a, b, c)
			acc = acc.concat([a,b,c]);
		} else if (curr.match('default')) {
			acc[acc.length - 1] = `${acc[acc.length - 1]} default`;
		} else {
			acc.push(curr);
		}
		return acc;
	}, [])
}
const convertToToken = code => {
	console.log('convertToToken',code, Number(code));
	if (code.match(/\n/gi)) {
		return {
			type: 'LineBreak',
		}
	}
	if (code.match('export default')) {
		return {
			type: 'DefaultExport',
		}
	}
	if (!isNaN(Number(code))) {
		return {
			type: 'Number',
			value: code,
		}
	} 
	if (code.match('let')) {
		return {
			type: 'VariableDeclarator',
		}
	}
	if (code.match(/[+-\/*]/gi)) {
		return {
			type: "BinaryOperator",
			value: code,
		}
	}
	if (code.match(/=/gi)) {
		return {
			type: 'VariableAssignmentOperator',
		}
	}
	if (!code.includes('"')) {
		return {
			type: 'Identifier', 
			value: code,
		}
	}
}
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
