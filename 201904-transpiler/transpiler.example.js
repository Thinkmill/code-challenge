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
	return {
		type: "Program",
		statements: parseStatements(tokens),
	}; // an object which is our AST - we can actually refer back to the tree traversal stuff we did
};

const performSyntacticAnalysis = tokens => {
	const token = tokens[0];
	const lookahead = tokens[1];
	switch (tokens[0].type) {
		case "DefaultExport": {
			return parseDefaultExport(tokens);
		}
		case "VariableDeclarator": {
			return parseVariableDeclaration(tokens);
		}
		case "Identifier": {
			if (lookahead && lookahead.type === "VariableAssignmentOperator") {
				return parseVariableAssigment(tokens);
			}
		}
		case "String":
		case "Number":  {
			if (lookahead && lookahead.type === 'BinaryOperator') {
				return parseBinaryExpression(tokens);
			}
			return tokens.shift();
		}
		default: {
			tokens.shift();
		}
	}
}

const parseDefaultExport = tokens => {
	tokens.shift();
	return {
		type: 'DefaultExportExpression',
		value: performSyntacticAnalysis(tokens),
	}
}

const parseVariableAssigment = tokens => {
	let id = tokens.shift();
	tokens.shift() //remove operator;
	let value = performSyntacticAnalysis(tokens);

	const expression = {
		type: 'VariableAssignment',
		id,
		value,
	}
	console.log(expression);
	return expression;
}

const parseStatements = tokens => {
	const statements = [];
	while (tokens.length > 0) {
		console.log('TOKENS', tokens);
		statements.push(performSyntacticAnalysis(tokens));
	}
	console.log(statements.filter(i => i));
	return statements.filter(i=>i);
}

const parseBinaryExpression = tokens => {
	let left = tokens.shift();
	let operator = tokens.shift().value;
	let right = performSyntacticAnalysis(tokens);

	const expression = {
		type: 'BinaryExpression',
		left,
		operator,	
		right,
	}
	console.log(expression);
	return expression;
}


const parseValue = tokens => {
	tokens.shift(); 
	const value = tokens[0];
	const lookahead = tokens[1]
	if (tokens[0].value && !lookahead || lookahead.type === 'LineBreak' ) {
		return tokens.shift();
	} else if (lookahead.type === 'BinaryOperator') {
		return parseBinaryExpression(tokens);
	}
}

const parseVariableDeclaration = tokens => {
	tokens.shift(); 
	let id = tokens.shift();
	let value = parseValue(tokens);
	return {
		type: "VariableDeclaration",
		id,
		value,
	}
}

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
