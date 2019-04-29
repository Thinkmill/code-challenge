/*
	### TOKENIZING ###
*/
const tokenizer = code => {
	/* ... */
	if (!code) return [];
	const truncatedCode = truncate(code);
	const splitCode = truncatedCode.split(' ').filter(v => v !== '');
	const cleanedCode = cleanCode(splitCode);
	const tokens = cleanedCode.filter(v => v).map(convertToToken);
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

const convertToToken = (code) => {
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
};

/*
	### PARSING ###
*/

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
		statements.push(performSyntacticAnalysis(tokens));
	}
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

/*
	## TRANSFORMATION ##
*/

const transformer = AST => {
	/* ... */

	return traverse(AST); // a modified AST
};

const traverse = (AST) => {
	let traverser = traversers[AST.type];
	if (!traverser) {
		console.error(`Traverser does not exist for this type: ${AST.type}`);
		return;
	}
	return traverser(AST);
}

const traversers = {
	Program: (AST) => {
		return {
			type: AST.type,
			statements: AST.statements.map(traverse),
		}
	},
	VariableDeclaration: AST => {
		return {
			type: AST.type,
			id: traverse(AST.id),
			value: traverse(AST.value)
		}
	},
	Identifier: AST => ({
		type: AST.type,
		value: AST.value,
	}),
	Number: AST => ({
		type: AST.type,
		value: AST.value,
	}),
	DefaultExportExpression: AST => {
		return {
			type: AST.type,
			value: traverse(AST.value),
		}
	}
}

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
