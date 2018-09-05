const {
	newTree,
	insert,
	remove,

	find,
	depth,
	height,
	count,
	balanced,
	biggest,
	smallest,

	inOrder,
	preOrder,
	postOrder,
	breadthFirst,
} = require('./tree');

describe('Dataset tests - Insert-only', () => {
	test('Empty tree', () => {
		const tree = newTree();

		expect(find(tree, 0)).toEqual(false);
		expect(depth(tree, 0)).toEqual(-1);
		expect(height(tree)).toEqual(0);
		expect(count(tree)).toEqual(0);
		expect(balanced(tree)).toEqual(true);
		expect(inOrder(tree)).toEqual([]);
		expect(preOrder(tree)).toEqual([]);
		expect(postOrder(tree)).toEqual([]);
		expect(breadthFirst(tree)).toEqual([]);
	});

	test('Single value tree', () => {
		const tree = newTree();
		insert(tree, 1);

		expect(find(tree, 0)).toEqual(false);
		expect(find(tree, 1)).toEqual(true);
		expect(depth(tree, 0)).toEqual(-1);
		expect(depth(tree, 1)).toEqual(0);
		expect(height(tree)).toEqual(1);
		expect(count(tree)).toEqual(1);
		expect(balanced(tree)).toEqual(true);
		expect(biggest(tree)).toEqual(1);
		expect(smallest(tree)).toEqual(1);
		expect(inOrder(tree)).toEqual([1]);
		expect(preOrder(tree)).toEqual([1]);
		expect(postOrder(tree)).toEqual([1]);
		expect(breadthFirst(tree)).toEqual([1]);
	});

	test('Single value tree - with dupes', () => {
		const tree = newTree();
		insert(tree, 1);
		insert(tree, 1);
		insert(tree, 1);

		expect(find(tree, 0)).toEqual(false);
		expect(find(tree, 1)).toEqual(true);
		expect(depth(tree, 0)).toEqual(-1);
		expect(depth(tree, 1)).toEqual(0);
		expect(height(tree)).toEqual(3);
		expect(count(tree)).toEqual(3);
		expect(balanced(tree)).toEqual(false);
		expect(biggest(tree)).toEqual(1);
		expect(smallest(tree)).toEqual(1);
		expect(inOrder(tree)).toEqual([1, 1, 1]);
		expect(preOrder(tree)).toEqual([1, 1, 1]);
		expect(postOrder(tree)).toEqual([1, 1, 1]);
		expect(breadthFirst(tree)).toEqual([1, 1, 1]);
	});

	test('Sorted Values', () => {
		const tree = newTree();
		insert(tree, 1);
		insert(tree, 2);
		insert(tree, 3);
		insert(tree, 4);
		insert(tree, 5);

		expect(find(tree, 0)).toEqual(false);
		expect(find(tree, 1)).toEqual(true);
		expect(find(tree, 2)).toEqual(true);
		expect(find(tree, 3)).toEqual(true);
		expect(find(tree, 4)).toEqual(true);
		expect(find(tree, 5)).toEqual(true);
		expect(find(tree, 6)).toEqual(false);
		expect(depth(tree, 0)).toEqual(-1);
		expect(depth(tree, 1)).toEqual(0);
		expect(depth(tree, 2)).toEqual(1);
		expect(depth(tree, 3)).toEqual(2);
		expect(depth(tree, 4)).toEqual(3);
		expect(depth(tree, 5)).toEqual(4);
		expect(depth(tree, 6)).toEqual(-1);
		expect(height(tree)).toEqual(5);
		expect(count(tree)).toEqual(5);
		expect(balanced(tree)).toEqual(false);
		expect(biggest(tree)).toEqual(5);
		expect(smallest(tree)).toEqual(1);
		expect(inOrder(tree)).toEqual([1, 2, 3, 4, 5]);
		expect(preOrder(tree)).toEqual([1, 2, 3, 4, 5]);
		expect(postOrder(tree)).toEqual([5, 4, 3, 2, 1]);
		expect(breadthFirst(tree)).toEqual([1, 2, 3, 4, 5]);
	});

	test('Sorted Values - with dupes', () => {
		const tree = newTree();
		insert(tree, 1);
		insert(tree, 1);
		insert(tree, 2);
		insert(tree, 2);
		insert(tree, 3);
		insert(tree, 3);
		insert(tree, 4);
		insert(tree, 4);
		insert(tree, 5);
		insert(tree, 5);

		expect(find(tree, 0)).toEqual(false);
		expect(find(tree, 1)).toEqual(true);
		expect(find(tree, 2)).toEqual(true);
		expect(find(tree, 3)).toEqual(true);
		expect(find(tree, 4)).toEqual(true);
		expect(find(tree, 5)).toEqual(true);
		expect(find(tree, 6)).toEqual(false);
		expect(depth(tree, 0)).toEqual(-1);
		expect(depth(tree, 1)).toEqual(0);
		expect(depth(tree, 2)).toEqual(1);
		expect(depth(tree, 3)).toEqual(2);
		expect(depth(tree, 4)).toEqual(3);
		expect(depth(tree, 5)).toEqual(4);
		expect(depth(tree, 6)).toEqual(-1);
		expect(height(tree)).toEqual(6);
		expect(count(tree)).toEqual(10);
		expect(balanced(tree)).toEqual(false);
		expect(biggest(tree)).toEqual(5);
		expect(smallest(tree)).toEqual(1);
		expect(inOrder(tree)).toEqual([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
		expect(preOrder(tree)).toEqual([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
		expect(postOrder(tree)).toEqual([1, 2, 3, 4, 5, 5, 4, 3, 2, 1]);
		expect(breadthFirst(tree)).toEqual([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
	});

	test('Reverse Sorted Values', () => {
		const tree = newTree();
		insert(tree, 5);
		insert(tree, 4);
		insert(tree, 3);
		insert(tree, 2);
		insert(tree, 1);

		expect(find(tree, 0)).toEqual(false);
		expect(find(tree, 1)).toEqual(true);
		expect(find(tree, 2)).toEqual(true);
		expect(find(tree, 3)).toEqual(true);
		expect(find(tree, 4)).toEqual(true);
		expect(find(tree, 5)).toEqual(true);
		expect(find(tree, 6)).toEqual(false);
		expect(depth(tree, 0)).toEqual(-1);
		expect(depth(tree, 1)).toEqual(4);
		expect(depth(tree, 2)).toEqual(3);
		expect(depth(tree, 3)).toEqual(2);
		expect(depth(tree, 4)).toEqual(1);
		expect(depth(tree, 5)).toEqual(0);
		expect(depth(tree, 6)).toEqual(-1);
		expect(height(tree)).toEqual(5);
		expect(count(tree)).toEqual(5);
		expect(balanced(tree)).toEqual(false);
		expect(biggest(tree)).toEqual(5);
		expect(smallest(tree)).toEqual(1);
		expect(inOrder(tree)).toEqual([1, 2, 3, 4, 5]);
		expect(preOrder(tree)).toEqual([5, 4, 3, 2, 1]);
		expect(postOrder(tree)).toEqual([1, 2, 3, 4, 5]);
		expect(breadthFirst(tree)).toEqual([5, 4, 3, 2, 1]);
	});

	test('Reverse Sorted Values - with dupes', () => {
		const tree = newTree();
		insert(tree, 5);
		insert(tree, 5);
		insert(tree, 4);
		insert(tree, 4);
		insert(tree, 3);
		insert(tree, 3);
		insert(tree, 2);
		insert(tree, 2);
		insert(tree, 1);
		insert(tree, 1);

		expect(find(tree, 0)).toEqual(false);
		expect(find(tree, 1)).toEqual(true);
		expect(find(tree, 2)).toEqual(true);
		expect(find(tree, 3)).toEqual(true);
		expect(find(tree, 4)).toEqual(true);
		expect(find(tree, 5)).toEqual(true);
		expect(find(tree, 6)).toEqual(false);
		expect(depth(tree, 0)).toEqual(-1);
		expect(depth(tree, 1)).toEqual(8);
		expect(depth(tree, 2)).toEqual(6);
		expect(depth(tree, 3)).toEqual(4);
		expect(depth(tree, 4)).toEqual(2);
		expect(depth(tree, 5)).toEqual(0);
		expect(depth(tree, 6)).toEqual(-1);
		expect(height(tree)).toEqual(10);
		expect(count(tree)).toEqual(10);
		expect(balanced(tree)).toEqual(false);
		expect(biggest(tree)).toEqual(5);
		expect(smallest(tree)).toEqual(1);
		expect(inOrder(tree)).toEqual([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
		expect(preOrder(tree)).toEqual([5, 5, 4, 4, 3, 3, 2, 2, 1, 1]);
		expect(postOrder(tree)).toEqual([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
		expect(breadthFirst(tree)).toEqual([5, 5, 4, 4, 3, 3, 2, 2, 1, 1]);
	});

	test('Balanced Values', () => {
		const tree = newTree();
		insert(tree, 5);
		insert(tree, 3);
		insert(tree, 7);
		insert(tree, 2);
		insert(tree, 6);
		insert(tree, 4);
		insert(tree, 8);

		expect(find(tree, 1)).toEqual(false);
		expect(find(tree, 2)).toEqual(true);
		expect(find(tree, 3)).toEqual(true);
		expect(find(tree, 4)).toEqual(true);
		expect(find(tree, 5)).toEqual(true);
		expect(find(tree, 6)).toEqual(true);
		expect(find(tree, 7)).toEqual(true);
		expect(find(tree, 8)).toEqual(true);
		expect(find(tree, 9)).toEqual(false);
		expect(depth(tree, 1)).toEqual(-1);
		expect(depth(tree, 2)).toEqual(2);
		expect(depth(tree, 3)).toEqual(1);
		expect(depth(tree, 4)).toEqual(2);
		expect(depth(tree, 5)).toEqual(0);
		expect(depth(tree, 6)).toEqual(2);
		expect(depth(tree, 7)).toEqual(1);
		expect(depth(tree, 8)).toEqual(2);
		expect(depth(tree, 9)).toEqual(-1);
		expect(height(tree)).toEqual(3);
		expect(count(tree)).toEqual(7);
		expect(balanced(tree)).toEqual(true);
		expect(biggest(tree)).toEqual(8);
		expect(smallest(tree)).toEqual(2);
		expect(inOrder(tree)).toEqual([2, 3, 4, 5, 6, 7, 8]);
		expect(preOrder(tree)).toEqual([5, 3, 2, 4, 7, 6, 8]);
		expect(postOrder(tree)).toEqual([2, 4, 3, 6, 8, 7, 5]);
		expect(breadthFirst(tree)).toEqual([5, 3, 7, 2, 4, 6, 8]);
	});

	test('Balanced Values - with dupes', () => {
		const tree = newTree();
		insert(tree, 5);
		insert(tree, 3);
		insert(tree, 7);
		insert(tree, 2);
		insert(tree, 6);
		insert(tree, 4);
		insert(tree, 8);
		insert(tree, 5);
		insert(tree, 3);
		insert(tree, 7);
		insert(tree, 2);
		insert(tree, 6);
		insert(tree, 4);
		insert(tree, 8);

		expect(find(tree, 1)).toEqual(false);
		expect(find(tree, 2)).toEqual(true);
		expect(find(tree, 3)).toEqual(true);
		expect(find(tree, 4)).toEqual(true);
		expect(find(tree, 5)).toEqual(true);
		expect(find(tree, 6)).toEqual(true);
		expect(find(tree, 7)).toEqual(true);
		expect(find(tree, 8)).toEqual(true);
		expect(find(tree, 9)).toEqual(false);
		expect(depth(tree, 1)).toEqual(-1);
		expect(depth(tree, 2)).toEqual(2);
		expect(depth(tree, 3)).toEqual(1);
		expect(depth(tree, 4)).toEqual(2);
		expect(depth(tree, 5)).toEqual(0);
		expect(depth(tree, 6)).toEqual(2);
		expect(depth(tree, 7)).toEqual(1);
		expect(depth(tree, 8)).toEqual(2);
		expect(depth(tree, 9)).toEqual(-1);
		expect(height(tree)).toEqual(4);
		expect(count(tree)).toEqual(14);
		expect(balanced(tree)).toEqual(true);
		expect(biggest(tree)).toEqual(8);
		expect(smallest(tree)).toEqual(2);
		expect(inOrder(tree)).toEqual([2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]);
		expect(preOrder(tree)).toEqual([5, 3, 2, 2, 3, 4, 4, 5, 7, 6, 6, 7, 8, 8]);
		expect(postOrder(tree)).toEqual([2, 3, 2, 4, 5, 4, 3, 6, 7, 6, 8, 8, 7, 5]);
		expect(breadthFirst(tree)).toEqual([5, 3, 7, 2, 4, 6, 8, 2, 3, 4, 5, 6, 7, 8]);
	});

	test('Unbalanced Values', () => {
		const tree = newTree();
		insert(tree, 5);
		insert(tree, 2);
		insert(tree, 8);
		insert(tree, 3);
		insert(tree, 7);
		insert(tree, 4);
		insert(tree, 6);

		expect(find(tree, 1)).toEqual(false);
		expect(find(tree, 2)).toEqual(true);
		expect(find(tree, 3)).toEqual(true);
		expect(find(tree, 4)).toEqual(true);
		expect(find(tree, 5)).toEqual(true);
		expect(find(tree, 6)).toEqual(true);
		expect(find(tree, 7)).toEqual(true);
		expect(find(tree, 8)).toEqual(true);
		expect(find(tree, 9)).toEqual(false);
		expect(depth(tree, 1)).toEqual(-1);
		expect(depth(tree, 2)).toEqual(1);
		expect(depth(tree, 3)).toEqual(2);
		expect(depth(tree, 4)).toEqual(3);
		expect(depth(tree, 5)).toEqual(0);
		expect(depth(tree, 6)).toEqual(3);
		expect(depth(tree, 7)).toEqual(2);
		expect(depth(tree, 8)).toEqual(1);
		expect(depth(tree, 9)).toEqual(-1);
		expect(height(tree)).toEqual(4);
		expect(count(tree)).toEqual(7);
		expect(balanced(tree)).toEqual(false);
		expect(biggest(tree)).toEqual(8);
		expect(smallest(tree)).toEqual(2);
		expect(inOrder(tree)).toEqual([2, 3, 4, 5, 6, 7, 8]);
		expect(preOrder(tree)).toEqual([5, 2, 3, 4, 8, 7, 6]);
		expect(postOrder(tree)).toEqual([4, 3, 2, 6, 7, 8, 5]);
		expect(breadthFirst(tree)).toEqual([5, 2, 8, 3, 7, 4, 6]);
	});

	test('Unbalanced Values - with dupes', () => {
		const tree = newTree();
		insert(tree, 5);
		insert(tree, 2);
		insert(tree, 8);
		insert(tree, 3);
		insert(tree, 7);
		insert(tree, 4);
		insert(tree, 6);
		insert(tree, 5);
		insert(tree, 2);
		insert(tree, 8);
		insert(tree, 3);
		insert(tree, 7);
		insert(tree, 4);
		insert(tree, 6);

		expect(find(tree, 1)).toEqual(false);
		expect(find(tree, 2)).toEqual(true);
		expect(find(tree, 3)).toEqual(true);
		expect(find(tree, 4)).toEqual(true);
		expect(find(tree, 5)).toEqual(true);
		expect(find(tree, 6)).toEqual(true);
		expect(find(tree, 7)).toEqual(true);
		expect(find(tree, 8)).toEqual(true);
		expect(find(tree, 9)).toEqual(false);
		expect(depth(tree, 1)).toEqual(-1);
		expect(depth(tree, 2)).toEqual(1);
		expect(depth(tree, 3)).toEqual(2);
		expect(depth(tree, 4)).toEqual(3);
		expect(depth(tree, 5)).toEqual(0);
		expect(depth(tree, 6)).toEqual(3);
		expect(depth(tree, 7)).toEqual(2);
		expect(depth(tree, 8)).toEqual(1);
		expect(depth(tree, 9)).toEqual(-1);
		expect(height(tree)).toEqual(5);
		expect(count(tree)).toEqual(14);
		expect(balanced(tree)).toEqual(false);
		expect(biggest(tree)).toEqual(8);
		expect(smallest(tree)).toEqual(2);
		expect(inOrder(tree)).toEqual([2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]);
		expect(preOrder(tree)).toEqual([5, 2, 2, 3, 3, 4, 4, 5, 8, 7, 6, 6, 7, 8]);
		expect(postOrder(tree)).toEqual([2, 3, 4, 5, 4, 3, 2, 6, 7, 6, 8, 7, 8, 5]);
		expect(breadthFirst(tree)).toEqual([5, 2, 8, 2, 3, 7, 3, 4, 6, 8, 4, 5, 6, 7]);
	});
});

describe('Dataset tests - Insert/Remove', () => {
	test('Empty tree', () => {
		const tree = newTree();
		remove(tree, 0);

		expect(find(tree, 0)).toEqual(false);
		expect(depth(tree, 0)).toEqual(-1);
		expect(height(tree)).toEqual(0);
		expect(count(tree)).toEqual(0);
		expect(balanced(tree)).toEqual(true);
		expect(inOrder(tree)).toEqual([]);
		expect(preOrder(tree)).toEqual([]);
		expect(postOrder(tree)).toEqual([]);
		expect(breadthFirst(tree)).toEqual([]);
	});

	test('Single insert/remove', () => {
		const tree = newTree();
		insert(tree, 0);
		remove(tree, 0);

		expect(find(tree, 0)).toEqual(false);
		expect(depth(tree, 0)).toEqual(-1);
		expect(height(tree)).toEqual(0);
		expect(count(tree)).toEqual(0);
		expect(balanced(tree)).toEqual(true);
		expect(inOrder(tree)).toEqual([]);
		expect(preOrder(tree)).toEqual([]);
		expect(postOrder(tree)).toEqual([]);
		expect(breadthFirst(tree)).toEqual([]);
	});

	test('Single insert/remove - with dupes', () => {
		const tree = newTree();
		insert(tree, 0);
		insert(tree, 0);
		remove(tree, 0);
		remove(tree, 0);

		expect(find(tree, 0)).toEqual(false);
		expect(depth(tree, 0)).toEqual(-1);
		expect(height(tree)).toEqual(0);
		expect(count(tree)).toEqual(0);
		expect(balanced(tree)).toEqual(true);
		expect(inOrder(tree)).toEqual([]);
		expect(preOrder(tree)).toEqual([]);
		expect(postOrder(tree)).toEqual([]);
		expect(breadthFirst(tree)).toEqual([]);
	});

	test('Sorted Values', () => {
		const tree = newTree();
		insert(tree, 1);
		insert(tree, 2);
		insert(tree, 3);
		remove(tree, 1);
		insert(tree, 4);
		insert(tree, 5);
		remove(tree, 4);

		expect(find(tree, 0)).toEqual(false);
		expect(find(tree, 1)).toEqual(false);
		expect(find(tree, 2)).toEqual(true);
		expect(find(tree, 3)).toEqual(true);
		expect(find(tree, 4)).toEqual(false);
		expect(find(tree, 5)).toEqual(true);
		expect(find(tree, 6)).toEqual(false);
		expect(depth(tree, 0)).toEqual(-1);
		expect(depth(tree, 1)).toEqual(-1);
		expect(depth(tree, 2)).toEqual(0);
		expect(depth(tree, 3)).toEqual(1);
		expect(depth(tree, 4)).toEqual(-1);
		expect(depth(tree, 5)).toEqual(2);
		expect(depth(tree, 6)).toEqual(-1);
		expect(height(tree)).toEqual(3);
		expect(count(tree)).toEqual(3);
		expect(balanced(tree)).toEqual(false);
		expect(biggest(tree)).toEqual(5);
		expect(smallest(tree)).toEqual(2);
		expect(inOrder(tree)).toEqual([2, 3, 5]);
		expect(preOrder(tree)).toEqual([2, 3, 5]);
		expect(postOrder(tree)).toEqual([5, 3, 2]);
		expect(breadthFirst(tree)).toEqual([2, 3, 5]);
	});

	test('Sorted Values - with dupes', () => {
		const tree = newTree();
		insert(tree, 1);
		insert(tree, 1);
		insert(tree, 2);
		remove(tree, 1);
		insert(tree, 2);
		insert(tree, 3);
		remove(tree, 3);
		insert(tree, 3);
		insert(tree, 4);
		insert(tree, 4);
		insert(tree, 5);
		remove(tree, 2);
		insert(tree, 5);
		remove(tree, 4);
		remove(tree, 4);
		remove(tree, 4);

		expect(find(tree, 0)).toEqual(false);
		expect(find(tree, 1)).toEqual(true);
		expect(find(tree, 2)).toEqual(true);
		expect(find(tree, 3)).toEqual(true);
		expect(find(tree, 4)).toEqual(false);
		expect(find(tree, 5)).toEqual(true);
		expect(find(tree, 6)).toEqual(false);
		expect(depth(tree, 0)).toEqual(-1);
		expect(depth(tree, 1)).toEqual(0);
		expect(depth(tree, 2)).toEqual(1);
		expect(depth(tree, 3)).toEqual(2);
		expect(depth(tree, 4)).toEqual(-1);
		expect(depth(tree, 5)).toEqual(3);
		expect(depth(tree, 6)).toEqual(-1);
		expect(height(tree)).toEqual(5);
		expect(count(tree)).toEqual(5);
		expect(balanced(tree)).toEqual(false);
		expect(biggest(tree)).toEqual(5);
		expect(smallest(tree)).toEqual(1);
		expect(inOrder(tree)).toEqual([1, 2, 3, 5, 5]);
		expect(preOrder(tree)).toEqual([1, 2, 3, 5, 5]);
		expect(postOrder(tree)).toEqual([5, 5, 3, 2, 1]);
		expect(breadthFirst(tree)).toEqual([1, 2, 3, 5, 5]);
	});

	test('Reverse Sorted Values', () => {
		const tree = newTree();
		insert(tree, 5);
		insert(tree, 4);
		insert(tree, 3);
		remove(tree, 4);
		insert(tree, 2);
		insert(tree, 1);
		remove(tree, 5);

		expect(find(tree, 0)).toEqual(false);
		expect(find(tree, 1)).toEqual(true);
		expect(find(tree, 2)).toEqual(true);
		expect(find(tree, 3)).toEqual(true);
		expect(find(tree, 4)).toEqual(false);
		expect(find(tree, 5)).toEqual(false);
		expect(find(tree, 6)).toEqual(false);
		expect(depth(tree, 0)).toEqual(-1);
		expect(depth(tree, 1)).toEqual(2);
		expect(depth(tree, 2)).toEqual(1);
		expect(depth(tree, 3)).toEqual(0);
		expect(depth(tree, 4)).toEqual(-1);
		expect(depth(tree, 5)).toEqual(-1);
		expect(depth(tree, 6)).toEqual(-1);
		expect(height(tree)).toEqual(3);
		expect(count(tree)).toEqual(3);
		expect(balanced(tree)).toEqual(false);
		expect(biggest(tree)).toEqual(3);
		expect(smallest(tree)).toEqual(1);
		expect(inOrder(tree)).toEqual([1, 2, 3]);
		expect(preOrder(tree)).toEqual([3, 2, 1]);
		expect(postOrder(tree)).toEqual([1, 2, 3]);
		expect(breadthFirst(tree)).toEqual([3, 2, 1]);
	});

	test('Reverse Sorted Values - with dupes', () => {
		const tree = newTree();
		insert(tree, 5);
		insert(tree, 5);
		insert(tree, 4);
		insert(tree, 4);
		insert(tree, 3);
		remove(tree, 4);
		insert(tree, 3);
		insert(tree, 2);
		insert(tree, 2);
		remove(tree, 5);
		insert(tree, 1);
		insert(tree, 1);
		remove(tree, 2);
		remove(tree, 2);
		remove(tree, 2);

		expect(find(tree, 0)).toEqual(false);
		expect(find(tree, 1)).toEqual(true);
		expect(find(tree, 2)).toEqual(false);
		expect(find(tree, 3)).toEqual(true);
		expect(find(tree, 4)).toEqual(true);
		expect(find(tree, 5)).toEqual(true);
		expect(find(tree, 6)).toEqual(false);
		expect(depth(tree, 0)).toEqual(-1);
		expect(depth(tree, 1)).toEqual(4);
		expect(depth(tree, 2)).toEqual(-1);
		expect(depth(tree, 3)).toEqual(2);
		expect(depth(tree, 4)).toEqual(1);
		expect(depth(tree, 5)).toEqual(0);
		expect(depth(tree, 6)).toEqual(-1);
		expect(height(tree)).toEqual(6);
		expect(count(tree)).toEqual(6);
		expect(balanced(tree)).toEqual(false);
		expect(biggest(tree)).toEqual(5);
		expect(smallest(tree)).toEqual(1);
		expect(inOrder(tree)).toEqual([1, 1, 3, 3, 4, 5]);
		expect(preOrder(tree)).toEqual([5, 4, 3, 3, 1, 1]);
		expect(postOrder(tree)).toEqual([1, 1, 3, 3, 4, 5]);
		expect(breadthFirst(tree)).toEqual([5, 4, 3, 3, 1, 1]);
	});

	test('Balanced Values', () => {
		const tree = newTree();
		insert(tree, 5);
		insert(tree, 3);
		insert(tree, 7);
		insert(tree, 2);
		insert(tree, 6);
		insert(tree, 4);
		insert(tree, 8);
		remove(tree, 5);
		remove(tree, 7);

		expect(find(tree, 1)).toEqual(false);
		expect(find(tree, 2)).toEqual(true);
		expect(find(tree, 3)).toEqual(true);
		expect(find(tree, 4)).toEqual(true);
		expect(find(tree, 5)).toEqual(false);
		expect(find(tree, 6)).toEqual(true);
		expect(find(tree, 7)).toEqual(false);
		expect(find(tree, 8)).toEqual(true);
		expect(find(tree, 9)).toEqual(false);
		expect(depth(tree, 1)).toEqual(-1);
		expect(depth(tree, 2)).toEqual(2);
		expect(depth(tree, 3)).toEqual(1);
		expect(depth(tree, 4)).toEqual(0);
		expect(depth(tree, 5)).toEqual(-1);
		expect(depth(tree, 6)).toEqual(1);
		expect(depth(tree, 7)).toEqual(-1);
		expect(depth(tree, 8)).toEqual(2);
		expect(depth(tree, 9)).toEqual(-1);
		expect(height(tree)).toEqual(3);
		expect(count(tree)).toEqual(5);
		expect(balanced(tree)).toEqual(true);
		expect(biggest(tree)).toEqual(8);
		expect(smallest(tree)).toEqual(2);
		expect(inOrder(tree)).toEqual([2, 3, 4, 6, 8]);
		expect(preOrder(tree)).toEqual([4, 3, 2, 6, 8]);
		expect(postOrder(tree)).toEqual([2, 3, 8, 6, 4]);
		expect(breadthFirst(tree)).toEqual([4, 3, 6, 2, 8]);
	});

	test('Balanced Values - with dupes', () => {
		const tree = newTree();
		insert(tree, 5);
		insert(tree, 3);
		insert(tree, 7);
		insert(tree, 2);
		insert(tree, 6);
		insert(tree, 4);
		insert(tree, 8);
		insert(tree, 5);
		insert(tree, 3);
		insert(tree, 7);
		insert(tree, 2);
		insert(tree, 6);
		insert(tree, 4);
		insert(tree, 8);
		remove(tree, 5);
		remove(tree, 5);
		remove(tree, 4);
		remove(tree, 4);

		expect(find(tree, 1)).toEqual(false);
		expect(find(tree, 2)).toEqual(true);
		expect(find(tree, 3)).toEqual(true);
		expect(find(tree, 4)).toEqual(false);
		expect(find(tree, 5)).toEqual(false);
		expect(find(tree, 6)).toEqual(true);
		expect(find(tree, 7)).toEqual(true);
		expect(find(tree, 8)).toEqual(true);
		expect(find(tree, 9)).toEqual(false);
		expect(depth(tree, 1)).toEqual(-1);
		expect(depth(tree, 2)).toEqual(1);
		expect(depth(tree, 3)).toEqual(0);
		expect(depth(tree, 4)).toEqual(-1);
		expect(depth(tree, 5)).toEqual(-1);
		expect(depth(tree, 6)).toEqual(2);
		expect(depth(tree, 7)).toEqual(1);
		expect(depth(tree, 8)).toEqual(2);
		expect(depth(tree, 9)).toEqual(-1);
		expect(height(tree)).toEqual(4);
		expect(count(tree)).toEqual(10);
		expect(balanced(tree)).toEqual(true);
		expect(biggest(tree)).toEqual(8);
		expect(smallest(tree)).toEqual(2);
		expect(inOrder(tree)).toEqual([2, 2, 3, 3, 6, 6, 7, 7, 8, 8]);
		expect(preOrder(tree)).toEqual([3, 2, 2, 3, 7, 6, 6, 7, 8, 8]);
		expect(postOrder(tree)).toEqual([2, 3, 2, 6, 7, 6, 8, 8, 7, 3]);
		expect(breadthFirst(tree)).toEqual([3, 2, 7, 2, 3, 6, 8, 6, 7, 8]);
	});
});

describe('API Tests - Insert only', () => {
	const setup = () => {
		const data = {
			empty: [],
			single: [1],
			sorted: [1, 2, 3, 4, 5],
			reverse_sorted: [5, 4, 3, 2, 1],
			balanced:  [5, 3, 7, 2, 6, 4, 8],
			marginally_balanced:  [4, 3, 7, 2, 6, 5, 8],
			unbalanced:  [5, 2, 8, 3, 7, 4, 6],
		};

		return { trees: Object.entries(data).reduce((acc, [k, d]) => {
			const t = newTree();
			d.forEach(x => insert(t, x));
			return {...acc, [k]: t};
		}, {}),
		data,
		};
	};

	describe('Query API', () => {
		test('find', () => {
			const { trees, data } = setup();
			Object.keys(data).forEach(k => {
				for (let i = 0; i < 20; i++) {
					expect(find(trees[k], i)).toEqual(data[k].includes(i));
				}
			});
		});

		test('depth', () => {
			const { trees } = setup();
			expect(depth(trees.single, 1)).toEqual(0);

			expect(depth(trees.sorted, 1)).toEqual(0);
			expect(depth(trees.sorted, 2)).toEqual(1);
			expect(depth(trees.sorted, 3)).toEqual(2);
			expect(depth(trees.sorted, 4)).toEqual(3);
			expect(depth(trees.sorted, 5)).toEqual(4);

			expect(depth(trees.reverse_sorted, 5)).toEqual(0);
			expect(depth(trees.reverse_sorted, 4)).toEqual(1);
			expect(depth(trees.reverse_sorted, 3)).toEqual(2);
			expect(depth(trees.reverse_sorted, 2)).toEqual(3);
			expect(depth(trees.reverse_sorted, 1)).toEqual(4);

			expect(depth(trees.balanced, 2)).toEqual(2);
			expect(depth(trees.balanced, 3)).toEqual(1);
			expect(depth(trees.balanced, 4)).toEqual(2);
			expect(depth(trees.balanced, 5)).toEqual(0);
			expect(depth(trees.balanced, 6)).toEqual(2);
			expect(depth(trees.balanced, 7)).toEqual(1);
			expect(depth(trees.balanced, 8)).toEqual(2);

			expect(depth(trees.marginally_balanced, 2)).toEqual(2);
			expect(depth(trees.marginally_balanced, 3)).toEqual(1);
			expect(depth(trees.marginally_balanced, 4)).toEqual(0);
			expect(depth(trees.marginally_balanced, 5)).toEqual(3);
			expect(depth(trees.marginally_balanced, 6)).toEqual(2);
			expect(depth(trees.marginally_balanced, 7)).toEqual(1);
			expect(depth(trees.marginally_balanced, 8)).toEqual(2);

			expect(depth(trees.unbalanced, 2)).toEqual(1);
			expect(depth(trees.unbalanced, 3)).toEqual(2);
			expect(depth(trees.unbalanced, 4)).toEqual(3);
			expect(depth(trees.unbalanced, 5)).toEqual(0);
			expect(depth(trees.unbalanced, 6)).toEqual(3);
			expect(depth(trees.unbalanced, 7)).toEqual(2);
			expect(depth(trees.unbalanced, 8)).toEqual(1);
		});

		test('height', () => {
			const { trees } = setup();
			expect(height(trees.empty)).toEqual(0);
			expect(height(trees.single)).toEqual(1);
			expect(height(trees.sorted)).toEqual(5);
			expect(height(trees.reverse_sorted)).toEqual(5);
			expect(height(trees.balanced)).toEqual(3);
			expect(height(trees.marginally_balanced)).toEqual(4);
			expect(height(trees.unbalanced)).toEqual(4);
		});

		test('count', () => {
			const { trees } = setup();
			expect(count(trees.empty)).toEqual(0);
			expect(count(trees.single)).toEqual(1);
			expect(count(trees.sorted)).toEqual(5);
			expect(count(trees.reverse_sorted)).toEqual(5);
			expect(count(trees.balanced)).toEqual(7);
			expect(count(trees.marginally_balanced)).toEqual(7);
			expect(count(trees.unbalanced)).toEqual(7);
		});

		test('balanced', () => {
			const { trees } = setup();
			expect(balanced(trees.empty)).toEqual(true);
			expect(balanced(trees.single)).toEqual(true);
			expect(balanced(trees.sorted)).toEqual(false);
			expect(balanced(trees.reverse_sorted)).toEqual(false);
			expect(balanced(trees.balanced)).toEqual(true);
			expect(balanced(trees.marginally_balanced)).toEqual(true);
			expect(balanced(trees.unbalanced)).toEqual(false);
		});

		test('biggest', () => {
			const { trees } = setup();
			expect(biggest(trees.single)).toEqual(1);
			expect(biggest(trees.sorted)).toEqual(5);
			expect(biggest(trees.reverse_sorted)).toEqual(5);
			expect(biggest(trees.balanced)).toEqual(8);
			expect(biggest(trees.marginally_balanced)).toEqual(8);
			expect(biggest(trees.unbalanced)).toEqual(8);
		});

		test('smallest', () => {
			const { trees } = setup();
			expect(smallest(trees.single)).toEqual(1);
			expect(smallest(trees.sorted)).toEqual(1);
			expect(smallest(trees.reverse_sorted)).toEqual(1);
			expect(smallest(trees.balanced)).toEqual(2);
			expect(smallest(trees.marginally_balanced)).toEqual(2);
			expect(smallest(trees.unbalanced)).toEqual(2);
		});
	});

	describe('Traversal API', () => {
		test('inOrder', () => {
			const { trees } = setup();
			expect(inOrder(trees.empty)).toEqual([]);
			expect(inOrder(trees.single)).toEqual([1]);
			expect(inOrder(trees.sorted)).toEqual([1, 2, 3, 4, 5]);
			expect(inOrder(trees.reverse_sorted)).toEqual([1, 2, 3, 4, 5]);
			expect(inOrder(trees.balanced)).toEqual([2, 3, 4, 5, 6, 7, 8]);
			expect(inOrder(trees.marginally_balanced)).toEqual([2, 3, 4, 5, 6, 7, 8]);
			expect(inOrder(trees.unbalanced)).toEqual([2, 3, 4, 5, 6, 7, 8]);
		});
		test('preOrder', () => {
			const { trees } = setup();
			expect(preOrder(trees.empty)).toEqual([]);
			expect(preOrder(trees.single)).toEqual([1]);
			expect(preOrder(trees.sorted)).toEqual([1, 2, 3, 4, 5]);
			expect(preOrder(trees.reverse_sorted)).toEqual([5, 4, 3, 2, 1]);
			expect(preOrder(trees.balanced)).toEqual([5, 3, 2, 4, 7, 6, 8]);
			expect(preOrder(trees.marginally_balanced)).toEqual([4, 3, 2, 7, 6, 5, 8]);
			expect(preOrder(trees.unbalanced)).toEqual([5, 2, 3, 4, 8, 7, 6]);
		});

		test('postOrder', () => {
			const  { trees } = setup();
			expect(postOrder(trees.empty)).toEqual([]);
			expect(postOrder(trees.single)).toEqual([1]);
			expect(postOrder(trees.sorted)).toEqual([5, 4, 3, 2, 1]);
			expect(postOrder(trees.reverse_sorted)).toEqual([1, 2, 3, 4, 5]);
			expect(postOrder(trees.balanced)).toEqual([2, 4, 3, 6, 8, 7, 5]);
			expect(postOrder(trees.marginally_balanced)).toEqual([2, 3, 5, 6, 8, 7, 4]);
			expect(postOrder(trees.unbalanced)).toEqual([4, 3, 2, 6, 7, 8, 5]);
		});

		test('breadthFirst', () => {
			const { trees } = setup();
			expect(breadthFirst(trees.empty)).toEqual([]);
			expect(breadthFirst(trees.single)).toEqual([1]);
			expect(breadthFirst(trees.sorted)).toEqual([1, 2, 3, 4, 5]);
			expect(breadthFirst(trees.reverse_sorted)).toEqual([5, 4, 3, 2, 1]);
			expect(breadthFirst(trees.balanced)).toEqual([5, 3, 7, 2, 4, 6, 8]);
			expect(breadthFirst(trees.marginally_balanced)).toEqual([4, 3, 7, 2, 6, 8, 5]);
			expect(breadthFirst(trees.unbalanced)).toEqual([5, 2, 8, 3, 7, 4, 6]);
		});
	});
});
