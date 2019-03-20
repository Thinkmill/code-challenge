# March 2019 Challenge

This challenge is going to see us build our own compiler (transpiler), and learn the parts that make up this kind of software.

To do this, you will need to understand the steps that a transpiler goes through as it does its work.

## Your Mission, if you choose to accept it:

Expand out the `transpiler.example.js`'s functions to pass the test suite found in `transpiler.tests.js`.

You can write your functions in any order, however it is likely helpful to understand tokens before you write your parser.

You are not allowed to use any node modules (other than jest).

## To get started

Read the Readme, then open up the `transpiler.example.js` file, and fill in the missing functions.

You can run `yarn jest --watch` in this folder to test your code.

## What is a Transpiler?

A transpiler is software that takes in code from one language, converts it to an Abstract Syntax Tree (AST), and then converts
it back to the same language. Tranpilers are useful to perform transformations on code without doing a full language switch.
For us JS developers, babel and everything we get it to do is why transpilers matter to us.

## How does a transpiler work?

A transpiler performs a series of transforms, to go from raw code to raw code. The conversion steps look like:

```
tokenizer(raw_code) => tokens
parser(tokens) => AST
transformer(AST) => AST
generator(AST) => raw_code
```

### Tokenizing

Tokenizing is the process of converting raw code into tokens. A token is an object that represents a discrete unit
in your code, such as:

```js
{ type 'Number', value: '7' }
```

Every token has a type. This is used by later processes to decide what to do with the token. In addition, some
tokens have values, which are a string, and hold some information from the source code. An example of tokenizing
would be taking the code snippet:

```js
a = 7
```

And transforming it into the list of tokens:

```js
[
  { type 'Identifier', value: 'a' },
  { type: 'VariableAssignmentOperator' },
  { type: "Number", value: "7" }
]
```

### Parsing

An Abstract Syntax Tree (AST) is a tree representation of your code, that goes further than tokens as it contains
informations about how tokens relate to one another.

This can be seen from something such as this variable declaration in an AST:

if you start with the code

```js
let a = 7
```

You would get the tokens

```js
[
  { type: 'VariableDeclarator' },
  { type 'Identifier', value: 'a' },
  { type: 'VariableAssignmentOperator' },
  { type: "Number", value: "7" }
]
```

This would then be parsed into the the following node in an AST

```js
{
  type: "VariableDeclaration",
  id: { type: "Identifier", value: "a" },
  initialValue: {
    type: "Number",
    value: "7"
  }
}
```

An AST is built from tokens, not code directly, however can be used to convert back into code.

### Transforming

In transformation, the goal is to use information from the AST to return a modified AST.

For example, if you wanted a transformation to capitalise all variables, you would be
passed the node:

```js
{
  type: "VariableDeclaration",
  id: { type: "Identifier", value: "a" },
  initialValue: {
    type: "Number",
    value: "7"
  }
}
```

and return the node:

```js
{
  type: "VariableDeclaration",
  id: { type: "Identifier", value: "A" },
  initialValue: {
    type: "Number",
    value: "7"
  }
}
```

### Generating

In the generation step, you need to convert an AST into code. For example, you could convert

```js
{
  type: "VariableDeclaration",
  id: { type: "Identifier", value: "A" },
  initialValue: {
    type: "Number",
    value: "7"
  }
}
```

into the code:

```js
let A = 7
```

## Challenge 1 - initial set of tokens

For the first challenge, our goal is to remove unused variables. For example, in the statement:

```js
let a = 5
let b = a
export default a;
```

The variable b is never used and could be removed, leaving us with the code:

```js
let a = 5
export default a
```

An unused variable is defined as a variable not used in the code after its declaration.

For this first part we are using a very reduced set of javascript that includes:

- `let` as the only variable type
- `numbers` and `identifiers` (variable names) as the only values/data types
- Basic math operators (`+`, `-`, `*`) as the only kinds of operation (no functions yet)


## Formal grammar definition

Note that while all these exist as concepts, not all directly translate to a token type or
an AST node type.

```
`Program`:: [Statement]
`Statement`:: Expression
`Expression`:: AssignmentExpression | OperationalExpression
`AssignmentExpression`:: DefaultExportExpression | VariableDeclaration | VariableAssignment
`OperationalExpression`:: Value | BinaryExpression
`DefaultExportExpression`:: DefaultExport : OperationalExpression
`VariableDeclaration`:: VariableDeclarator : Identifier : OperationalExpression
`VariableAssignment`:: Identifer : VariableAssignmentOperator : OperationalExpression
`Value`:: Number | Identifier
`BinaryExpression`:: OperationalExpression : BinaryOperator : Value
`DefaultExport`:: "export default"
`VariableDeclarator`:: "let"
`Identifier`:: alphabetic characters
`Number`:: numeric characters
`VariableAssignmentOperator`:: "="
`BinaryOperator`:: "+" | "-" | "*"
`LineBreak`:: "\n"
```

## Other Resources

- [How to be a compiler](https://medium.com/@kosamari/how-to-be-a-compiler-make-a-compiler-with-javascript-4a8a13d473b4) is a good article on the concepts at play
- [The AST explorer allows you to examine generated ASTs of code using several different parsers](https://astexplorer.net/)
- [The Super Tiny Compiler](https://github.com/jamiebuilds/the-super-tiny-compiler) is a similar exercise