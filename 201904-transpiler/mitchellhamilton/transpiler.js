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

const tokenizer = code => {
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
			if (lastVal.type === "Identifier" && keywordPattern.test(lastVal.value)) {
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

// Program:: StatementWithLineBreak* [Statement]
// StatementWithLineBreak:: [Statement] : LineBreak
// Statement:: AssignmentExpression | OperationalExpression
// AssignmentExpression:: DefaultExportExpression | VariableDeclaration | VariableAssignment
// OperationalExpression:: Value | BinaryExpression
// DefaultExportExpression:: DefaultExport : OperationalExpression
// VariableDeclaration:: VariableDeclarator : Identifier : VariableAssignmentOperator : OperationalExpression
// VariableAssignment:: Identifer : VariableAssignmentOperator : OperationalExpression
// Value:: Number | Identifier
// BinaryExpression:: Value : BinaryOperator : OperationalExpression

const parser = tokens => {
	let statements = [];
	let i = 0;
	function walk() {
		let token = tokens[i];
		if (
			token.type === "Identifier" &&
			tokens[i + 1] &&
			tokens[i + 1].type === "VariableAssignmentOperator"
		) {
			i += 2;
			return {
				type: "VariableAssignment",
				id: token,
				value: walk()
			};
		}
		if (token.type === "Number" || token.type === "Identifier") {
			i++;
			if (tokens[i] && tokens[i].type === "BinaryOperator") {
				i++;
				return {
					type: "BinaryExpression",
					operator: tokens[i - 1].value,
					left: token,
					right: walk()
				};
			}

			return token;
		}
		if (token.type === "DefaultExport") {
			i++;
			return {
				type: "DefaultExportExpression",
				value: walk()
			};
		}

		if (token.type === "VariableDeclarator") {
			i += 3;
			return {
				type: "VariableDeclaration",
				id: tokens[i - 2],
				value: walk()
			};
		}
		if (token.type === "LineBreak") {
			i++;
			if (tokens.length === i) {
				return null;
			}
			return walk();
		}
		throw new Error("Unknown Thing: " + token.type);
	}
	while (i < tokens.length) {
		statements.push(walk());
	}
	/* ... */
	return { type: "Program", statements: statements.filter(x => x) }; // an object which is our AST - we can actually refer back to the tree traversal stuff we did
};

function traverser(ast, visitor) {
	function traverseNode(node) {
		let enter = visitor[node.type];
		if (enter) {
			enter(node);
		}

		switch (node.type) {
			case "Program": {
				node.statements.forEach(
					statementButItsNotReallyTechnicallyAStatementButWhatever => {
						traverseNode(
							statementButItsNotReallyTechnicallyAStatementButWhatever
						);
					}
				);
				break;
			}
			case "VariableAssignment":
			case "VariableDeclaration": {
				traverseNode(node.id);
				traverseNode(node.value);
				break;
			}

			case "BinaryExpression": {
				traverseNode(node.left);
				traverseNode(node.right);
				break;
			}
			case "DefaultExportExpression": {
				traverseNode(node.value);
				break;
			}

			case "Identifier":
			case "Number":
				break;

			default:
				throw new Error("Unknown Thing: " + node.type);
		}
	}

	traverseNode(ast);
}

const transformer = ast => {
	let declarations = ast.statements.filter(
		x => x.type === "VariableDeclaration"
	);

	let usedDeclarations = new Set();

	traverser(ast, {
		Identifier(node) {
			let decl = declarations.find(x => x.id.value === node.value);
			if (decl && node !== decl.id) {
				usedDeclarations.add(decl);
			}
		}
	});

	let newAst = {
		type: "Program",
		statements: ast.statements.filter(statement => {
			return !(
				statement.type === "VariableDeclaration" &&
				!usedDeclarations.has(statement)
			);
		})
	};
	/* ... */
	return newAst;
};
function stringifyNode(node) {
	switch (node.type) {
		case "Number":
		case "Identifier": {
			return node.value;
		}
		case "VariableDeclaration": {
			return `let ${stringifyNode(node.id)} = ${stringifyNode(node.value)}`;
		}
		case "VariableAssignment": {
			return `${stringifyNode(node.id)} = ${stringifyNode(node.value)}`;
		}
		case "DefaultExportExpression": {
			return `export default ${stringifyNode(node.value)}`;
		}
		case "BinaryExpression": {
			return `${stringifyNode(node.left)} ${node.operator} ${stringifyNode(
				node.right
			)}`;
		}
		case "Program": {
			return node.statements.map(stringifyNode).join("\n");
		}
	}
}

const generator = ast => {
	return stringifyNode(ast);
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
