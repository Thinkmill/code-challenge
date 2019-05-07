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
const constructWithReferences = AST => AST;
const transformer = AST => {
	/* ... */
	const unusedVars = AST.statements.reduce((acc, curr) => {
		if (curr.type === 'VariableDeclaration') {
			acc.push({ name: curr.id.value, used: false });
			visit(curr.value, acc);
			return acc;
		}
		visit(curr, acc);
		return acc;
	}, []).map(u =>  !u.used ? u.name : undefined);
	return traverse(AST, unusedVars); // a modified AST
};

const visit = (AST, declaredVars) => {
	if (!AST || typeof AST !== "object") return;
	if (AST.type === 'Identifier') {
		const foundVariable = declaredVars.find(v => v.name === AST.value);
		if (foundVariable) {
			foundVariable.used = true;
		}
	}
	const keys = Object.keys(AST);
	keys.forEach(k => visit(AST[k], declaredVars));
}

const traverse = (AST, unusedVars) => {
	let traverser = traversers[AST.type];
	if (!traverser) {
		console.error(`Traverser does not exist for this type: ${AST.type}`);
		return;
	}
	return traverser(AST, unusedVars);
}

const traversers = {
	Program: (AST, unusedVars) => {
		return {
			type: AST.type,
			statements: AST.statements.map(s => traverse(s, unusedVars)).filter(i=>i),
		}
	},
	VariableAssignment: (AST, unusedVars) => {
		return {
			type: AST.type,
			id: traverse(AST.id, unusedVars),
			value: traverse(AST.value, unusedVars),
		}
	},
	VariableDeclaration: (AST, unusedVars) => {
		const { value } = traverse(AST.id);
		if (unusedVars && unusedVars.includes(value)) return;
		return {
			type: AST.type,
			id: traverse(AST.id, unusedVars),
			value: traverse(AST.value, unusedVars)
		}
	},
	Identifier: (AST, unusedVars) => ({
		type: AST.type,
		value: AST.value,
	}),
	Number: (AST, unusedVars) => ({
		type: AST.type,
		value: AST.value,
	}),
	BinaryExpression: (AST, unusedVars) => ({
		type: AST.type,
		left: traverse(AST.left, unusedVars),
		operator: AST.operator,
		right: traverse(AST.right, unusedVars)
	}),
	DefaultExportExpression: (AST, unusedVars) => {
		return {
			type: AST.type,
			value: traverse(AST.value, unusedVars),
		}
	}
}

const generator = AST => {
	/* ... */
	return convertToString(AST)
};

const convertToString = AST => {
	const generator = generators[AST.type];
	if (!generator) {
		console.error(`generator does not exist for this type: ${AST.type}`);
		return;
	}
	return generator(AST);
}

const generators = {
	DefaultExportExpression: AST => `export default ${convertToString(AST.value)}`,
	Program: AST => {
		if (!AST.statements) return '';
		const code = AST.statements.map(convertToString).join('\n');
		return code;
	},
	BinaryExpression: AST => {
		return `${convertToString(AST.left)} ${AST.operator} ${convertToString(AST.right)}`
	},
	VariableAssignment: AST => {
		return `${convertToString(AST.id)} = ${convertToString(AST.value)}`;
	},
	VariableDeclaration: (AST) => {
		return `let ${convertToString(AST.id)} = ${convertToString(AST.value)}`;
	},
	Identifier: (AST) => {
		return AST.value;
	},
	Number: (AST) => {
		return AST.value;
	}
}

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
