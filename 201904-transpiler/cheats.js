let counter = 0;

const tokenShapes = [
	{
		type: "DefaultExport",
		matchPattern: `export default`
	},
	{
		type: "VariableDeclarator",
		matchPattern: "let[^a-zA-Z0-9]"
	},
	{
		type: "FunctionDeclarator",
		matchPattern: "function"
	},
	{
		type: "Return",
		matchPattern: "return"
	},
	{
		type: "Identifier",
		matchPattern: "[A-Za-z]+",
		getValue: code => code
	},
	{
		type: "VariableAssignmentOperator",
		matchPattern: "="
	},
	{ type: "Number", matchPattern: `\\d+`, getValue: code => code },
	{
		type: "String",
		matchPattern: "'[^']*'",
		getValue: code => code.match(/'([^']*)'/)[1]
	},
	{ type: "OpenParens", matchPattern: `\\(` },
	{ type: "CloseParens", matchPattern: `\\)` },
	{ type: "OpenSquigglyParens", matchPattern: `\\{` },
	{ type: "CloseSquigglyParens", matchPattern: `\\}` },
	{
		type: "BinaryOperator",
		matchPattern: `(\\+|-|\\*)`,
		getValue: code => code
	},
	{ type: "Comma", matchPattern: "," },
	{ type: "LineBreak", matchPattern: `\\n+` }
];

const space = `\\s+`;

const tokenizer = code => {
	let tokens = [];

	while (code.length && counter < 1000) {
		counter++;
		let tokenShape = tokenShapes.find(({ type, matchPattern }) => {
			const check = new RegExp(`^${matchPattern}`);
			return check.test(code);
		});
		if (!tokenShape) {
			const check = new RegExp(space);
			if (check.test(code)) {
				code = code.replace(/^(\s|\n)+/, "");
				continue;
			}
			console.error("could not get token from", code, code.length);
			throw new Error("could not parse a token here");
		}
		const { type, matchPattern, getValue } = tokenShape;
		const check = new RegExp(matchPattern);
		const tokenCode = check.exec(code)[0];
		code = code.replace(tokenCode, "");
		if (type === "blankSpace") continue;

		const token = { type };

		if (getValue) {
			token.value = getValue(tokenCode);
		}
		tokens.push(token);
	}

	return tokens; // an array of tokens in processed order
};

const parseExpression = tokens => {
	if (tokens.length === 1) return tokens.shift();

	const left = tokens.shift();
	const operator = tokens.shift();
	const right = parseExpression(tokens);
	if (operator.type === "BinaryOperator") {
		return { type: "BinaryExpression", operator: operator.value, left, right };
	} else if (operator.type === "VariableAssignmentOperator") {
		return {
			type: "VariableAssignment",
			id: left,
			value: right
		};
	} else {
		throw new Error(
			`Could not parse expression for operator of type ${operator.type}`
		);
	}
};

const parseArgs = tokens => {
	return tokens.filter(t => t.type === "Identifier");
};

const getTokensBeforeBreak = tokens => {
	let expressionTokens = [];
	while (tokens[0] && tokens[0].type !== "LineBreak") {
		expressionTokens.push(tokens.shift());
	}
	return expressionTokens;
};

const getTokensBeforeType = (tokens, type) => {
	let expressionTokens = [];
	while (tokens[0] && tokens[0].type !== type) {
		expressionTokens.push(tokens.shift());
	}
	return expressionTokens;
};

const parseStatements = tokens => {
	let statements = [];
	let count = 0;

	while (tokens.length && count < 1000) {
		count++;
		let token = tokens.shift();
		switch (token.type) {
			case "VariableDeclarator": {
				const id = tokens.shift();
				// remove our dumb variableAssignment token
				tokens.shift();
				let expressionTokens = getTokensBeforeType(tokens, "LineBreak");
				const value = parseExpression(expressionTokens);
				statements.push({
					type: "VariableDeclaration",
					id,
					value
				});
				break;
			}
			case "BinaryOperator": {
				let expressionTokens = getTokensBeforeType(tokens, "LineBreak");
				statements.push(parseExpression(expressionTokens));
				break;
			}
			case "Number": {
				if (tokens[0] && tokens[0].type === "BinaryOperator") {
					let expressionTokens = getTokensBeforeType(tokens, "LineBreak");
					statements.push(parseExpression([token, ...expressionTokens]));
				} else {
					statements.push(token);
				}
				break;
			}
			case "Identifier": {
				if (
					tokens[0] &&
					(tokens[0].type === "BinaryOperator" ||
						tokens[0].type === "VariableAssignmentOperator")
				) {
					let expressionTokens = getTokensBeforeType(tokens, "LineBreak");
					statements.push(parseExpression([token, ...expressionTokens]));
				} else {
					statements.push(token);
				}
				break;
			}
			case "DefaultExport": {
				let expressionTokens = getTokensBeforeType(tokens, "LineBreak");
				statements.push({
					type: "DefaultExportExpression",
					value: parseExpression(expressionTokens)
				});
				break;
			}
			case "LineBreak": {
				break;
			}
			case "Return": {
				let expressionTokens = getTokensBeforeType(tokens, "LineBreak");

				statements.push({
					type: "ReturnStatement",
					value: parseExpression(expressionTokens)
				});
				break;
			}
			case "FunctionDeclarator": {
				const id = tokens.shift();
				tokens.shift();
				const args = getTokensBeforeType(tokens, "CloseParens");
				tokens.shift();
				tokens.shift();
				const body = getTokensBeforeType(tokens, "CloseSquigglyParens");
				tokens.shift();

				statements.push({
					type: "FunctionDeclaration",
					identifier: id,
					arguments: parseArgs(args),
					body: parseStatements(body)
				});
				break;
			}
			default:
				throw new Error(`unexpected token ${JSON.stringify(token)}`);
		}
	}
	return statements;
};

const parser = tokens => {
	const AST = {
		type: "Program",
		statements: parseStatements(tokens)
	};

	/* ... */
	return AST; // an object which is our AST - we can actually refer back to the tree traversal stuff we did
};

const identifierUsed = (identifier, statements) =>
	statements
		.map(statement => identifierUsedInNode(identifier, statement))
		.find(i => i === true);

identifierUsedInNode = (identifier, node) => {
	switch (node.type) {
		case "Identifier": {
			return node.value === identifier;
		}
		case "VariableDeclaration": {
			return identifierUsedInNode(identifier, node.value);
		}
		case "VariableAssignment": {
			return (
				identifierUsedInNode(identifier, node.id) ||
				identifierUsedInNode(identifier, node.value)
			);
		}
		case "BinaryExpression": {
			return (
				identifierUsedInNode(identifier, node.left) ||
				identifierUsedInNode(identifier, node.right)
			);
		}
		case "DefaultExportExpression": {
			return identifierUsedInNode(identifier, node.value);
		}
		case "Number": {
			return false;
		}
		default: {
			throw new Error(
				`forgot to handle token in variable checking: ${node.type}`
			);
		}
	}
};

const transformer = AST => {
	const convertedStatements = [];
	const unconvertedStatements = [...AST.statements];

	while (unconvertedStatements.length) {
		let statement = unconvertedStatements.shift();

		if (
			statement.type !== "VariableDeclaration" ||
			identifierUsed(statement.id.value, unconvertedStatements)
		) {
			convertedStatements.push(statement);
		}
	}

	return { ...AST, statements: convertedStatements }; // a modified AST
};

const generateExpression = expression => {
	switch (expression.type) {
		case "Number": {
			return expression.value;
		}
		case "BinaryExpression": {
			return "";
		}
		default: {
			throw new Error(
				`unknown expression type in generation ${expression.type}`
			);
		}
	}
};

const generateStatement = statement => {
	switch (statement.type) {
		case "Number": {
			return statement.value;
		}
		case "Identifier": {
			return statement.value;
		}
		case "VariableDeclaration": {
			return `let ${statement.id.value} = ${generateStatement(
				statement.value
			)}`;
		}
		case "BinaryExpression": {
			return `${generateStatement(statement.left)} ${
				statement.operator
			} ${generateStatement(statement.right)}`;
		}
		case "DefaultExportExpression": {
			return `export default ${generateStatement(statement.value)}`;
		}
		case "VariableAssignment": {
			return `${generateStatement(statement.id)} = ${generateStatement(
				statement.value
			)}`;
		}
		default: {
			throw new Error(`unknown statement type in generation ${statement.type}`);
		}
	}
};

const generator = AST => {
	let file = "";
	if (AST.type === "Program") {
		const statementString = AST.statements.map(generateStatement).join("\n");
		file += statementString;
	}
	return file; // a string that is code
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
