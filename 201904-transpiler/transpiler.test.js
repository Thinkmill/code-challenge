const generate = require("./cheats");
const { tokenizer, parser, transformer, generator } = generate;

describe("tokenizer", () => {
	it("should tokenize an empty string", () => {
		expect(tokenizer("")).toEqual([]);
	});
	it("should tokenize a simple assignment", () => {
		expect(tokenizer("let a = 3")).toEqual([
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "3" }
		]);
	});
	it("should tokenize a more complicated assignment", () => {
		expect(tokenizer("let a = 33 + 44")).toEqual([
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "33" },
			{ type: "BinaryOperator", value: "+" },
			{ type: "Number", value: "44" }
		]);
	});
	it("should tokenize a simple equals expresion", () => {
		expect(tokenizer("5 + 3 ")).toEqual([
			{ type: "Number", value: "5" },
			{ type: "BinaryOperator", value: "+" },
			{ type: "Number", value: "3" }
		]);
	});
	it("should tokenize a two line statement", () => {
		const token = `let a = 5
		let b = a`;
		expect(tokenizer(token)).toEqual([
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "5" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "b" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Identifier", value: "a" }
		]);
	});
	it("should tokenize a long variable name", () => {
		expect(tokenizer("let supercallifragellisticexpialedocious = 5")).toEqual([
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "supercallifragellisticexpialedocious" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "5" }
		]);
	});
	it("should tokenize two variable declarations", () => {
		const token = `let a = 33
		let b = 5`;

		expect(tokenizer(token)).toEqual([
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "33" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "b" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "5" }
		]);
	});
	it("should tokenize variable reassignment", () => {
		const token = `let a = 33
		let b = 5
		a + b`;

		expect(tokenizer(token)).toEqual([
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "33" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "b" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "5" },
			{ type: "LineBreak" },
			{ type: "Identifier", value: "a" },
			{ type: "BinaryOperator", value: "+" },
			{ type: "Identifier", value: "b" }
		]);
	});
	it("should handle actual variable reassignment", () => {
		const token = `let a = 33
		a = 13`;

		expect(tokenizer(token)).toEqual([
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "33" },
			{ type: "LineBreak" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "13" }
		]);
	});
	it("more complex variable declaration", () => {
		const token = `let a = 33
		let b = 5
		let c = a + b`;

		expect(tokenizer(token)).toEqual([
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "33" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "b" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "5" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "c" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Identifier", value: "a" },
			{ type: "BinaryOperator", value: "+" },
			{ type: "Identifier", value: "b" }
		]);
	});
	it("should parse export default", () => {
		expect(tokenizer("export default 5")).toEqual([
			{ type: "DefaultExport" },
			{ type: "Number", value: "5" }
		]);
	});
});

describe("parser", () => {
	it("should create an empty ast from no tokens", () => {
		expect(parser([])).toEqual({ type: "Program", statements: [] });
	});
	it("should parse a simple variable declaration", () => {
		const tokens = [
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "5" }
		];
		expect(parser(tokens)).toEqual({
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "5"
					}
				}
			]
		});
	});
	it("should parse a simple binaryDeclaration", () => {
		const tokens = [
			{ type: "Number", value: "5" },
			{ type: "BinaryOperator", value: "+" },
			{ type: "Number", value: "4" }
		];

		expect(parser(tokens)).toEqual({
			type: "Program",
			statements: [
				{
					type: "BinaryExpression",
					operator: "+",
					left: { type: "Number", value: "5" },
					right: { type: "Number", value: "4" }
				}
			]
		});
	});
	it("should handle variable variable assignment with an operator", () => {
		const tokens = [
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "5" },
			{ type: "BinaryOperator", value: "+" },
			{ type: "Number", value: "4" }
		];

		expect(parser(tokens)).toEqual({
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "BinaryExpression",
						operator: "+",
						left: { type: "Number", value: "5" },
						right: { type: "Number", value: "4" }
					}
				}
			]
		});
	});
	it("should handle multiple expressions in a line", () => {
		const tokens = [
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "5" },
			{ type: "BinaryOperator", value: "+" },
			{ type: "Number", value: "4" },
			{ type: "BinaryOperator", value: "+" },
			{ type: "Number", value: "3" },
			{ type: "BinaryOperator", value: "+" },
			{ type: "Number", value: "2" }
		];

		expect(parser(tokens)).toEqual({
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "BinaryExpression",
						operator: "+",
						left: { type: "Number", value: "5" },
						right: {
							type: "BinaryExpression",
							operator: "+",
							left: { type: "Number", value: "4" },
							right: {
								type: "BinaryExpression",
								operator: "+",
								left: { type: "Number", value: "3" },
								right: { type: "Number", value: "2" }
							}
						}
					}
				}
			]
		});
	});
	it("should handle variable multiple expressions", () => {
		const tokens = [
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "5" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "b" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "6" },
			{ type: "LineBreak" }
		];
		expect(parser(tokens)).toEqual({
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "5"
					}
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "b" },
					value: {
						type: "Number",
						value: "6"
					}
				}
			]
		});
	});
	it("should handle variable reassignment", () => {
		const tokens = [
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "33" },
			{ type: "LineBreak" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "13" }
		];

		expect(parser(tokens)).toEqual({
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "33"
					}
				},
				{
					type: "VariableAssignment",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "13"
					}
				}
			]
		});
	});
	it("should handle a default export", () => {
		const tokens = [{ type: "DefaultExport" }, { type: "Number", value: "5" }];
		expect(parser(tokens)).toEqual({
			type: "Program",
			statements: [
				{
					type: "DefaultExportExpression",
					value: { type: "Number", value: "5" }
				}
			]
		});
	});
	it("should handle dangling identifiers and number", () => {
		const tokens = [
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "5" },
			{ type: "LineBreak" },
			{ type: "Number", value: "1" },
			{ type: "LineBreak" },
			{ type: "Number", value: "365" },
			{ type: "LineBreak" },
			{ type: "Identifier", value: "a" }
		];
		expect(parser(tokens)).toEqual({
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "5"
					}
				},
				{
					type: "Number",
					value: "1"
				},
				{
					type: "Number",
					value: "365"
				},
				{
					type: "Identifier",
					value: "a"
				}
			]
		});
	});
});

describe("transformer", () => {
	it("should remove an unused variable", () => {
		const AST = {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "5"
					}
				},
				{
					type: "DefaultExportExpression",
					value: {
						type: "Number",
						value: "100"
					}
				}
			]
		};

		expect(transformer(AST)).toEqual({
			type: "Program",
			statements: [
				{
					type: "DefaultExportExpression",
					value: {
						type: "Number",
						value: "100"
					}
				}
			]
		});
	});
	it("should remove two unused variable", () => {
		const AST = {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "5"
					}
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "b" },
					value: {
						type: "Number",
						value: "55"
					}
				},
				{
					type: "DefaultExportExpression",
					value: {
						type: "Number",
						value: "100"
					}
				}
			]
		};

		expect(transformer(AST)).toEqual({
			type: "Program",
			statements: [
				{
					type: "DefaultExportExpression",
					value: {
						type: "Number",
						value: "100"
					}
				}
			]
		});
	});
	it("should not remove a variable used as an export", () => {
		const AST = {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "5"
					}
				},
				{
					type: "DefaultExportExpression",
					value: {
						type: "Identifier",
						value: "a"
					}
				}
			]
		};

		expect(transformer(AST)).toEqual(AST);
	});
	it("should not remove a variable used in a binaryExpression", () => {
		const AST = {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "5"
					}
				},
				{
					type: "BinaryExpression",
					operator: "-",
					left: {
						type: "Identifier",
						value: "a"
					},
					right: {
						type: "Number",
						value: "16"
					}
				}
			]
		};

		expect(transformer(AST)).toEqual(AST);
	});
	it("should not remove a variable that is reassigned", () => {
		const AST = {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "5"
					}
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "b" },
					value: {
						type: "Identifier",
						value: "a"
					}
				},
				{
					type: "DefaultExportExpression",
					value: {
						type: "Identifier",
						value: "b"
					}
				}
			]
		};

		expect(transformer(AST)).toEqual(AST);
	});
	it("should not remove is used in a variable assignment", () => {
		const AST = {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "5"
					}
				},
				{
					type: "VariableAssignment",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "66"
					}
				}
			]
		};

		expect(transformer(AST)).toEqual(AST);
	});
});

describe("generator", () => {
	it("should convert an empty program", () => {
		const AST = {
			type: "Program",
			statements: []
		};

		expect(generator(AST)).toEqual("");
	});
	it("should convert an AST of a simple variable", () => {
		const AST = {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "5"
					}
				}
			]
		};

		expect(generator(AST)).toEqual("let a = 5");
	});
	it("should convert an AST of a simple expression", () => {
		const AST = {
			type: "Program",
			statements: [
				{
					type: "BinaryExpression",
					operator: "+",
					left: { type: "Number", value: "5" },
					right: { type: "Number", value: "4" }
				}
			]
		};

		expect(generator(AST)).toEqual("5 + 4");
	});
	it("should convert an AST of a variable declaration with a binary operator", () => {
		const AST = {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "BinaryExpression",
						operator: "+",
						left: { type: "Number", value: "5" },
						right: { type: "Number", value: "4" }
					}
				}
			]
		};

		expect(generator(AST)).toEqual("let a = 5 + 4");
	});
	it("should convert an AST with values as expressions", () => {
		const AST = {
			type: "Program",
			statements: [
				{ type: "Number", value: "5" },
				{ type: "Number", value: "4" }
			]
		};

		expect(generator(AST)).toEqual(`5
4`);
	});
	it("should convert an AST with a default export", () => {
		const AST = {
			type: "Program",
			statements: [
				{
					type: "DefaultExportExpression",
					value: { type: "Number", value: "333" }
				}
			]
		};

		expect(generator(AST)).toEqual("export default 333");
	});
	it("should convert an AST with variable assignment", () => {
		const AST = {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "5"
					}
				},
				{
					type: "VariableAssignment",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "22"
					}
				}
			]
		};

		expect(generator(AST)).toEqual(`let a = 5
a = 22`);
	});
});

const fullTransformSnippets = [
	{
		name: "simple export statement",
		code: `let a = 5
export default a`,
		tokens: [
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "5" },
			{ type: "LineBreak" },
			{ type: "DefaultExport" },
			{ type: "Identifier", value: "a" }
		],
		AST: {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "5"
					}
				},
				{
					type: "DefaultExportExpression",
					value: { type: "Identifier", value: "a" }
				}
			]
		},
		transformedAST: {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "5"
					}
				},
				{
					type: "DefaultExportExpression",
					value: { type: "Identifier", value: "a" }
				}
			]
		},
		generatedCode: `let a = 5
export default a`
	},
	{
		name: "export a number",
		code: `export default 7`,
		tokens: [{ type: "DefaultExport" }, { type: "Number", value: "7" }],
		AST: {
			type: "Program",
			statements: [
				{
					type: "DefaultExportExpression",
					value: { type: "Number", value: "7" }
				}
			]
		},
		transformedAST: {
			type: "Program",
			statements: [
				{
					type: "DefaultExportExpression",
					value: { type: "Number", value: "7" }
				}
			]
		},
		generatedCode: `export default 7`
	},
	{
		name: "with an unused variable",
		code: `let a = 52
export default 112`,
		tokens: [
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "52" },
			{ type: "LineBreak" },
			{ type: "DefaultExport" },
			{ type: "Number", value: "112" }
		],
		AST: {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "52"
					}
				},
				{
					type: "DefaultExportExpression",
					value: { type: "Number", value: "112" }
				}
			]
		},
		transformedAST: {
			type: "Program",
			statements: [
				{
					type: "DefaultExportExpression",
					value: { type: "Number", value: "112" }
				}
			]
		},
		generatedCode: `export default 112`
	},
	{
		name: "with a used and an unused variable",
		code: `let a = 11
	let b = 999
	export default b`,
		tokens: [
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "11" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "b" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "999" },
			{ type: "LineBreak" },
			{ type: "DefaultExport" },
			{ type: "Identifier", value: "b" }
		],
		AST: {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "11"
					}
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "b" },
					value: {
						type: "Number",
						value: "999"
					}
				},
				{
					type: "DefaultExportExpression",
					value: { type: "Identifier", value: "b" }
				}
			]
		},
		transformedAST: {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "b" },
					value: {
						type: "Number",
						value: "999"
					}
				},
				{
					type: "DefaultExportExpression",
					value: { type: "Identifier", value: "b" }
				}
			]
		},
		generatedCode: `let b = 999
export default b`
	},
	{
		name: "where two variables are added as the export",
		code: `let a = 11
	let b = 999
	export default a + b`,
		tokens: [
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "11" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "b" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "999" },
			{ type: "LineBreak" },
			{ type: "DefaultExport" },
			{ type: "Identifier", value: "a" },
			{ type: "BinaryOperator", value: "+" },
			{ type: "Identifier", value: "b" }
		],
		AST: {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "11"
					}
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "b" },
					value: {
						type: "Number",
						value: "999"
					}
				},
				{
					type: "DefaultExportExpression",
					value: {
						type: "BinaryExpression",
						operator: "+",
						left: { type: "Identifier", value: "a" },
						right: { type: "Identifier", value: "b" }
					}
				}
			]
		},
		transformedAST: {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "11"
					}
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "b" },
					value: {
						type: "Number",
						value: "999"
					}
				},
				{
					type: "DefaultExportExpression",
					value: {
						type: "BinaryExpression",
						operator: "+",
						left: { type: "Identifier", value: "a" },
						right: { type: "Identifier", value: "b" }
					}
				}
			]
		},
		generatedCode: `let a = 11
let b = 999
export default a + b`
	},
	{
		name: "with variable transitively used",
		code: `let a = 1337
	let b = a
	export default b`,
		tokens: [
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "1337" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "b" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Identifier", value: "a" },
			{ type: "LineBreak" },
			{ type: "DefaultExport" },
			{ type: "Identifier", value: "b" }
		],
		AST: {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "1337"
					}
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "b" },
					value: { type: "Identifier", value: "a" }
				},
				{
					type: "DefaultExportExpression",
					value: { type: "Identifier", value: "b" }
				}
			]
		},
		transformedAST: {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: {
						type: "Number",
						value: "1337"
					}
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "b" },
					value: { type: "Identifier", value: "a" }
				},
				{
					type: "DefaultExportExpression",
					value: { type: "Identifier", value: "b" }
				}
			]
		},
		generatedCode: `let a = 1337
let b = a
export default b`
	},
	{
		name: "with a large number of variables declared",
		code: `let a = 1
let b = 2
let c = 3
let d = 4
let e = 5
let f = 6
let h = 7
let i = 8
let j = 9
let k = 10
let z = a - b * j
export default z + e`,
		tokens: [
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "1" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "b" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "2" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "c" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "3" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "d" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "4" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "e" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "5" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "f" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "6" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "h" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "7" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "i" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "8" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "j" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "9" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "k" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "10" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "z" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Identifier", value: "a" },
			{ type: "BinaryOperator", value: "-" },
			{ type: "Identifier", value: "b" },
			{ type: "BinaryOperator", value: "*" },
			{ type: "Identifier", value: "j" },
			{ type: "LineBreak" },
			{ type: "DefaultExport" },
			{ type: "Identifier", value: "z" },
			{ type: "BinaryOperator", value: "+" },
			{ type: "Identifier", value: "e" }
		],
		AST: {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: { type: "Number", value: "1" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "b" },
					value: { type: "Number", value: "2" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "c" },
					value: { type: "Number", value: "3" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "d" },
					value: { type: "Number", value: "4" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "e" },
					value: { type: "Number", value: "5" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "f" },
					value: { type: "Number", value: "6" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "h" },
					value: { type: "Number", value: "7" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "i" },
					value: { type: "Number", value: "8" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "j" },
					value: { type: "Number", value: "9" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "k" },
					value: { type: "Number", value: "10" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "z" },
					value: {
						type: "BinaryExpression",
						operator: "-",
						left: { type: "Identifier", value: "a" },
						right: {
							type: "BinaryExpression",
							operator: "*",
							left: { type: "Identifier", value: "b" },
							right: { type: "Identifier", value: "j" }
						}
					}
				},
				{
					type: "DefaultExportExpression",
					value: {
						type: "BinaryExpression",
						operator: "+",
						left: { type: "Identifier", value: "z" },
						right: { type: "Identifier", value: "e" }
					}
				}
			]
		},
		transformedAST: {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: { type: "Number", value: "1" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "b" },
					value: { type: "Number", value: "2" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "e" },
					value: { type: "Number", value: "5" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "j" },
					value: { type: "Number", value: "9" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "z" },
					value: {
						type: "BinaryExpression",
						operator: "-",
						left: { type: "Identifier", value: "a" },
						right: {
							type: "BinaryExpression",
							operator: "*",
							left: { type: "Identifier", value: "b" },
							right: { type: "Identifier", value: "j" }
						}
					}
				},
				{
					type: "DefaultExportExpression",
					value: {
						type: "BinaryExpression",
						operator: "+",
						left: { type: "Identifier", value: "z" },
						right: { type: "Identifier", value: "e" }
					}
				}
			]
		},
		generatedCode: `let a = 1
let b = 2
let e = 5
let j = 9
let z = a - b * j
export default z + e`
	},
	{
		name: "second long transform check",
		code: `let a = 1
let b = a
let c = b
let d = c
let e = d
let f = e
let h = f
let i = f
let j = 9
let k = 10
let z = a * a * h
export default z`,
		tokens: [
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "a" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "1" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "b" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Identifier", value: "a" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "c" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Identifier", value: "b" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "d" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Identifier", value: "c" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "e" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Identifier", value: "d" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "f" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Identifier", value: "e" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "h" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Identifier", value: "f" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "i" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Identifier", value: "f" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "j" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "9" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "k" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Number", value: "10" },
			{ type: "LineBreak" },
			{ type: "VariableDeclarator" },
			{ type: "Identifier", value: "z" },
			{ type: "VariableAssignmentOperator" },
			{ type: "Identifier", value: "a" },
			{ type: "BinaryOperator", value: "*" },
			{ type: "Identifier", value: "a" },
			{ type: "BinaryOperator", value: "*" },
			{ type: "Identifier", value: "h" },
			{ type: "LineBreak" },
			{ type: "DefaultExport" },
			{ type: "Identifier", value: "z" }
		],
		AST: {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: { type: "Number", value: "1" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "b" },
					value: { type: "Identifier", value: "a" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "c" },
					value: { type: "Identifier", value: "b" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "d" },
					value: { type: "Identifier", value: "c" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "e" },
					value: { type: "Identifier", value: "d" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "f" },
					value: { type: "Identifier", value: "e" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "h" },
					value: { type: "Identifier", value: "f" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "i" },
					value: { type: "Identifier", value: "f" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "j" },
					value: { type: "Number", value: "9" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "k" },
					value: { type: "Number", value: "10" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "z" },
					value: {
						type: "BinaryExpression",
						operator: "*",
						left: { type: "Identifier", value: "a" },
						right: {
							type: "BinaryExpression",
							operator: "*",
							left: { type: "Identifier", value: "a" },
							right: { type: "Identifier", value: "h" }
						}
					}
				},
				{
					type: "DefaultExportExpression",
					value: { type: "Identifier", value: "z" }
				}
			]
		},
		transformedAST: {
			type: "Program",
			statements: [
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "a" },
					value: { type: "Number", value: "1" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "b" },
					value: { type: "Identifier", value: "a" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "c" },
					value: { type: "Identifier", value: "b" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "d" },
					value: { type: "Identifier", value: "c" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "e" },
					value: { type: "Identifier", value: "d" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "f" },
					value: { type: "Identifier", value: "e" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "h" },
					value: { type: "Identifier", value: "f" }
				},
				{
					type: "VariableDeclaration",
					id: { type: "Identifier", value: "z" },
					value: {
						type: "BinaryExpression",
						operator: "*",
						left: { type: "Identifier", value: "a" },
						right: {
							type: "BinaryExpression",
							operator: "*",
							left: { type: "Identifier", value: "a" },
							right: { type: "Identifier", value: "h" }
						}
					}
				},
				{
					type: "DefaultExportExpression",
					value: { type: "Identifier", value: "z" }
				}
			]
		},
		generatedCode: `let a = 1
let b = a
let c = b
let d = c
let e = d
let f = e
let h = f
let z = a * a * h
export default z`
	}
];

describe("Integrationish Tests", () => {
	fullTransformSnippets.map(testCase =>
		describe(testCase.name, () => {
			it("tokenizer", () => {
				const tokens = tokenizer(testCase.code);

				expect(tokens).toEqual(testCase.tokens);
			});
			it("parser", () => {
				const AST = parser(testCase.tokens);

				expect(AST).toEqual(testCase.AST);
			});
			it("transformer", () => {
				const AST = transformer(testCase.AST);
				expect(AST).toEqual(testCase.transformedAST);
			});
			it("generator", () => {
				const code = generator(testCase.transformedAST);
				expect(code).toEqual(testCase.generatedCode);
			});
		})
	);
});

describe.only("part 2", () => {
	describe("tokenizer", () => {
		describe("string tokens", () => {
			it("should tokenize an empty string", () => {
				expect(tokenizer("''")).toEqual([{ type: "String", value: "" }]);
			});
			it("should tokenize a string value", () => {
				expect(tokenizer("'aye'")).toEqual([{ type: "String", value: "aye" }]);
			});

			it("should tokenize a string with spaces", () => {
				expect(tokenizer("'aye yes of course'")).toEqual([
					{ type: "String", value: "aye yes of course" }
				]);
			});
			it("should tokenize a string with numeric characters", () => {
				expect(tokenizer("'aye 2 be sure'")).toEqual([
					{ type: "String", value: "aye 2 be sure" }
				]);
			});
			it("should tokenize a string with punctuation", () => {
				expect(tokenizer("'aye, to be sure'")).toEqual([
					{ type: "String", value: "aye, to be sure" }
				]);
			});
			it.skip("should tokenize a string with escaped single quotes", () => {
				expect(tokenizer(`'\'aye, to be sure\`, said the captain'`)).toEqual([
					{ type: "String", value: "'aye, to be sure`, said the captain" }
				]);
			});
		});
		describe("function declarations", () => {
			it("should tokenize an empty function declaration", () => {
				expect(tokenizer("function a() {}")).toEqual([
					{ type: "FunctionDeclarator" },
					{ type: "Identifier", value: "a" },
					{ type: "OpenParens" },
					{ type: "CloseParens" },
					{ type: "OpenSquigglyParens" },
					{ type: "CloseSquigglyParens" }
				]);
			});
			it("should understand an argument", () => {
				expect(tokenizer("function a(b) {}")).toEqual([
					{ type: "FunctionDeclarator" },
					{ type: "Identifier", value: "a" },
					{ type: "OpenParens" },
					{ type: "Identifier", value: "b" },
					{ type: "CloseParens" },
					{ type: "OpenSquigglyParens" },
					{ type: "CloseSquigglyParens" }
				]);
			});
			it("should understand arguments", () => {
				expect(
					tokenizer("function collectivistNonsense(b, cauliflower, d) {}")
				).toEqual([
					{ type: "FunctionDeclarator" },
					{ type: "Identifier", value: "collectivistNonsense" },
					{ type: "OpenParens" },
					{ type: "Identifier", value: "b" },
					{ type: "Comma" },
					{ type: "Identifier", value: "cauliflower" },
					{ type: "Comma" },
					{ type: "Identifier", value: "d" },
					{ type: "CloseParens" },
					{ type: "OpenSquigglyParens" },
					{ type: "CloseSquigglyParens" }
				]);
			});
			it("should parse a body", () => {
				expect(
					tokenizer(`function addOne(num) {
	return num + 1
}`)
				).toEqual([
					{ type: "FunctionDeclarator" },
					{ type: "Identifier", value: "addOne" },
					{ type: "OpenParens" },
					{ type: "Identifier", value: "num" },
					{ type: "CloseParens" },
					{ type: "OpenSquigglyParens" },
					{ type: "LineBreak" },
					{ type: "Return" },
					{ type: "Identifier", value: "num" },
					{ type: "BinaryOperator", value: "+" },
					{ type: "Number", value: "1" },
					{ type: "LineBreak" },
					{ type: "CloseSquigglyParens" }
				]);
			});
		});
		describe("function expressions", () => {
			it("should have a function call", () => {
				expect(tokenizer("a()")).toEqual([
					{ type: "Identifier", value: "a" },
					{ type: "OpenParens" },
					{ type: "CloseParens" }
				]);
			});
			it("should have a function call with an argument", () => {
				expect(tokenizer("a(b)")).toEqual([
					{ type: "Identifier", value: "a" },
					{ type: "OpenParens" },
					{ type: "Identifier", value: "b" },
					{ type: "CloseParens" }
				]);
			});
			it("should have a function call with an argument", () => {
				expect(tokenizer("collectivistNonsense(b, cauliflower, d)")).toEqual([
					{ type: "Identifier", value: "collectivistNonsense" },
					{ type: "OpenParens" },
					{ type: "Identifier", value: "b" },
					{ type: "Comma" },
					{ type: "Identifier", value: "cauliflower" },
					{ type: "Comma" },
					{ type: "Identifier", value: "d" },
					{ type: "CloseParens" }
				]);
			});
		});
	});
	describe("parser", () => {
		describe("functions", () => {
			it("should parse function a() {}", () => {
				expect(
					parser([
						{ type: "FunctionDeclarator" },
						{ type: "Identifier", value: "a" },
						{ type: "OpenParens" },
						{ type: "CloseParens" },
						{ type: "OpenSquigglyParens" },
						{ type: "CloseSquigglyParens" }
					])
				).toEqual({
					type: "Program",
					statements: [
						{
							type: "FunctionDeclaration",
							identifier: { type: "Identifier", value: "a" },
							arguments: [],
							body: []
						}
					]
				});
			});
			it("should parse function a(b) {}", () => {
				expect(
					parser([
						{ type: "FunctionDeclarator" },
						{ type: "Identifier", value: "a" },
						{ type: "OpenParens" },
						{ type: "Identifier", value: "b" },
						{ type: "CloseParens" },
						{ type: "OpenSquigglyParens" },
						{ type: "CloseSquigglyParens" }
					])
				).toEqual({
					type: "Program",
					statements: [
						{
							type: "FunctionDeclaration",
							identifier: { type: "Identifier", value: "a" },
							arguments: [{ type: "Identifier", value: "b" }],
							body: []
						}
					]
				});
			});
			it("should parse function a(b, c, d) {}", () => {
				expect(
					parser([
						{ type: "FunctionDeclarator" },
						{ type: "Identifier", value: "a" },
						{ type: "OpenParens" },
						{ type: "Identifier", value: "b" },
						{ type: "Comma" },
						{ type: "Identifier", value: "c" },
						{ type: "Comma" },
						{ type: "Identifier", value: "d" },
						{ type: "Comma" },
						{ type: "CloseParens" },
						{ type: "OpenSquigglyParens" },
						{ type: "CloseSquigglyParens" }
					])
				).toEqual({
					type: "Program",
					statements: [
						{
							type: "FunctionDeclaration",
							identifier: { type: "Identifier", value: "a" },
							arguments: [
								{ type: "Identifier", value: "b" },
								{ type: "Identifier", value: "c" },
								{ type: "Identifier", value: "d" }
							],
							body: []
						}
					]
				});
			});
			it("should parse a function with a body", () => {
				expect(
					parser([
						{ type: "FunctionDeclarator" },
						{ type: "Identifier", value: "addOne" },
						{ type: "OpenParens" },
						{ type: "Identifier", value: "num" },
						{ type: "CloseParens" },
						{ type: "OpenSquigglyParens" },
						{ type: "LineBreak" },
						{ type: "Return" },
						{ type: "Identifier", value: "num" },
						{ type: "BinaryOperator", value: "+" },
						{ type: "Number", value: "1" },
						{ type: "LineBreak" },
						{ type: "CloseSquigglyParens" }
					])
				).toEqual({
					type: "Program",
					statements: [
						{
							type: "FunctionDeclaration",
							identifier: { type: "Identifier", value: "addOne" },
							arguments: [{ type: "Identifier", value: "num" }],
							body: [
								{
									type: "ReturnStatement",
									value: {
										type: "BinaryExpression",
										operator: "+",
										left: { type: "Identifier", value: "num" },
										right: { type: "Number", value: "1" }
									}
								}
							]
						}
					]
				});
			});
		});
	});
});
