/*
 * Creation/modification API
 */

/*
 * Create and return a new tree object. This can have whatever shape you like.
 */
const newTree = (value = null) => ({
	value: value,
	left: null,
	right: null
});

const direction = (tree, value) => value <= tree.value ? 'left': 'right';

/*
 * Insert `value` into `tree`.
 */
const insert = (tree, value) => {
	if(tree === null) return newTree(value);
	if(tree.value === null) return tree.value = value;
	if(value <= tree.value) {
		tree.left === null ? tree.left = newTree(value) : insert(tree.left, value);
	} else {
		tree.right === null ? tree.right = newTree(value) : insert(tree.right, value);
	}
};

/*
 * Remove `value` from `tree`. Only remove the first instance of the value if it appears multiple times.
 * Use the 'in-order predecessor` techinque for replacing the node when there are two child nodes.
 * (i.e. replace with the largest value from the nodes left-hand tree)
 */
const remove = (tree, value) => tree + value;

/*
 * Query API
 */

/*
 * Determine whether `value` exists in the `tree`. Return boolean.
 */
const find = (tree, value) => {
	if(tree === null || tree.value === null) return false;
	if(tree.value === value) return true;
	const path = direction(tree, value);
	return find(tree[path], value);
};

/*
 * Calculate the depth of the given value within the tree. Return -1 if the value does not exist.
 * The value at the root has a depth of zero.
 */
const depth = (tree, value) => {
	let noValue = find(tree, value) === false;
	if(tree === null || tree.value === null || noValue) return -1;
	if (tree.value === value) return 0;

	const path = direction(tree, value);
	return depth(tree[path], value) + 1;
};

/*
 * Calculate the height of the tree. An empty tree has a height of zero.
 */
const height = (tree) => {
	if(tree === null || tree.value === null) return 0;

	const heightLeft = height(tree.left);
	const heightRight = height(tree.right);
	return heightLeft > heightRight ? heightLeft + 1 : heightRight + 1;
};

/*
 * Calculate the number of nodes in the tree.
 */
const count = (tree) => {
	if(tree === null || tree.value === null) return 0;
	return count(tree.left) + count(tree.right) + 1;
};

/*
 * Determine whether the tree is balanced or not. A tree is balanced if:
 *  - The left sub-tree is balanced, and
 *  - The right sub-tree is balanced, and
 *  - The height of the left sub-tree and right sub-tree differ by no more than one.
 *
 * An empty tree is always balanced.
 */
const balanced = (tree) => {
	if (tree === null
		|| tree.value === null
		|| tree.left === tree.right
	) return true;

	const heightLeft = height(tree.left);
	const heightRight = height(tree.right);
	const difference = Math.abs(heightRight - heightLeft);
	if(difference <= 1 && balanced(tree.left) && balanced(tree.right)) return true;
	return false;
};

/*
 * Calculate the biggest value in the tree. Behaviour is undefined for an empty tree.
 */
const biggest = (tree) => {
	if(tree.value === null) return undefined;
	return (tree.right === null) ? tree.value : biggest(tree.right);
};
/*
 * Calculate the smallest value in the tree. Behaviour is undefined for an empty tree.
 */
const smallest = (tree) => {
	if(tree.value === null) return undefined;
	return (tree.left === null) ? tree.value : smallest(tree.left);
};

/*
 * Traversal API
 *
 * The traversal API allows the user to visit each node in the tree in a particular order.
 *
 * See https://en.wikipedia.org/wiki/Tree_traversal for definitions of the traversal types.
 */

/*
 * Traverse the tree using in-order traversal, returning an array.
 */
const inOrder = (tree) => {
	if(tree === null || tree.value === null) return ([]);

	const result = [];
	const transverseInOrder = (tree) => {
		tree.left && transverseInOrder(tree.left);
		result.push(tree.value);
		tree.right && transverseInOrder(tree.right);
	};

	transverseInOrder(tree);
	return result;
};

/*
 * Traverse the tree using pre-order traversal, returning an array.
 */
const preOrder = (tree) => {
	if(tree.value === null) return ([]);
	const result = [];
	const transversePreOrder = (tree) => {
		result.push(tree.value);
		tree.left && transversePreOrder(tree.left);
		tree.right && transversePreOrder(tree.right);
	};

	transversePreOrder(tree);
	return result;
};
// [currentNode, ...left, ...right] depth first traversal
/*
 * Traverse the tree using post-order traversal, returning an array.
 */
const postOrder = (tree) => {
	if(tree.value === null) return ([]);
	const result = [];
	const transversePostOrder = (tree) => {
		tree.left && transversePostOrder(tree.left);
		tree.right && transversePostOrder(tree.right);
		result.push(tree.value);
	};

	transversePostOrder(tree);
	return result;
};
// [...left, ...right, currentNode] depth first traversal
/*
 * Traverse the tree using breadth first (level-order) traversal, returning an array.
 */
// Hint, use a queue
// queue = [5]
// result = []
// 1 pop the queue
// 2 put the value in the result
// 3 push left and right onto queue
const breadthFirst = (tree) => {
	let queue = [tree];
	let result = [];
	while(queue.length) {
		let subtree = queue.shift(); //removes the first element from an array and returns that removed element
		if(subtree !== null && subtree.value !== null) {
			result.push(subtree.value);
			queue.push(subtree.left, subtree.right);
		}
	}
	return result;
};


module.exports = {
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
};
