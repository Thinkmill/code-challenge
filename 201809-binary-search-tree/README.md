# Code Challenge - Binary Search Tree

**The challenge finishes at team talks on Wednesday the 26th 4PM**

A Binary Search Tree (BST) is a data structure which allows you to store values in a structure which supports fast insertion, removal, searching and sorting.

For this challenge, you will need to implement a BST which can store numerical values.
This will involve implementing a collection of functions which make up an API.
The API is provided for you, all you need to do is fill in the blanks.

To get started, copy the example file, and install the required packages.

```
cp tree.example.js tree.js
yarn
```

## Test driven development

For this challenge, we will be following a test driven development approach.
A collection of unit tests have been provided which all need to pass in order for the challenge to be complete.

To run the tests, run

```
yarn test
```

When you first run this command, you can expect all the tests to fail.
Your job is to implement the code in `tree.js` so that all of these tests pass.

There are a number of different groups of tests in `tree.test.js`.
During development, you may want to skip certain tests which you know will fail, or select particular tests which you are interested in.
You can change the tests being run by adding `.skip` or `.only` to any `describe` or `test` function, e.g.

```
describe.skip('...', () => {...});
...
test.only('...', () => {...});
```

Don't forget to remove these again to get the full test suite!

## Tips

- Implement `newTree()` and `insert()` first.
	Without these, none of the other functions make any sense.
- Draw the trees in the test cases by hand to make sure you understand what they should look like.
- It might help to implement a `printTree()` function to help you visual the trees as you build them.
	Comparing this output to your hand drawn trees will help you track down any bugs.
- Implement `remove()` last. It is probably the trickiest function of the API, and you might want to use some of the query functions as helpers.
