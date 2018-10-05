/* Creation/modification */
const newTree = () => ({ value: null, left: null, right: null });

const isEmpty = tree => tree.value === null;

const _assign = (t1, t2) => { t1.value = t2.value; t1.left = t2.left, t1.right = t2.right; };

const insert = (tree, value) => {
	while (!isEmpty(tree)) {
		tree = value <= tree.value ? tree.left : tree.right;
	}
	_assign(tree, { value, left: newTree(), right: newTree() });
};

const _removeRightmost = (node) => {
	while (!isEmpty(node.right)) {
		node = node.right;
	}
	_assign(node, node.left); // Hoist left to here.
};

const remove = (tree, value) => {
	while (!isEmpty(tree) && tree.value !== value) {
		tree = value <= tree.value ? tree.left : tree.right;
	}
	if (!isEmpty(tree)) {
		if (tree.left.value === null && tree.right.value === null) { // No children
			_assign(tree, newTree()); // Reset to null, nothing else to do.
		} else if (tree.left.value !== null && tree.right.value !== null) { // Two children
			tree.value = biggest(tree.left);  // Replace with biggest predecessor
			if (tree.left.right.value === null) {  // If it didn't have a right child
				_assign(tree.left, tree.left.left); // then simply hoist.
			} else {
				_removeRightmost(tree.left.right);
			}
		} else {  // One child - hoist child into place here.
			_assign(tree, tree.left.value === null ? tree.right : tree.left);
		}
	}
};

/* Query */
const find = (tree, value) => {
	while (!isEmpty(tree) && tree.value !== value) {
		tree = value <= tree.value ? tree.left : tree.right;
	}
	return tree.value === value;
};

const depth = (tree, value) => {
	let d = 0;
	while (!isEmpty(tree) && tree.value !== value) {
		d += 1;
		tree = value <= tree.value ? tree.left : tree.right;
	}
	return isEmpty(tree) ? -1 : d;
};

const height = (tree) => {
	let h = 0;
	let nextLevel = [tree];
	while (nextLevel.length > 0) {
		const thisLevel = nextLevel.filter(t => !isEmpty(t));
		nextLevel = [];
		if (thisLevel.length) h += 1;
		while (thisLevel.length) {
			const subtree = thisLevel.pop();
			nextLevel.push(subtree.left, subtree.right);
		}
	}
	return h;
};

const count = (tree) => {
	let c = 0;
	let q = [tree];
	while (q.length > 0) {
		const subtree = q.shift();
		if (!isEmpty(subtree)) {
			c += 1;
			q.push(subtree.left, subtree.right);
		}
	}
	return c;
};

const balanced = (tree) => isEmpty(tree) || (balanced(tree.left) && balanced(tree.right) && Math.abs(height(tree.left) - height(tree.right)) <= 1);

const biggest = (tree) => {
	while (!isEmpty(tree.right)) {
		tree = tree.right;
	}
	return tree.value;
};

const smallest = (tree) => {
	while (!isEmpty(tree.left)) {
		tree = tree.left;
	}
	return tree.value;
};

/* Traversal */
const inOrder = (tree) => {
	const result = [];
	let backTrack = false;
	const stack = [tree];
	let subtree = tree;
	while (stack.length) {
		if (backTrack) {
			subtree = stack.pop();
			if (!isEmpty(subtree)) {
				result.push(subtree.value);

				stack.push(subtree.right);
				subtree = subtree.right;
				backTrack = false;
			}
		} else {
			if (isEmpty(subtree)) {
				backTrack = true;
			} else {
				stack.push(subtree.left);
				subtree = subtree.left;
			}
		}
	}
	return result;
};

const preOrder = (tree) => {
	const result = [];
	let backTrack = false;
	const stack = [tree];
	let subtree = tree;
	while (stack.length) {
		if (backTrack) {
			subtree = stack.pop();
			if (!isEmpty(subtree)) {
				stack.push(subtree.right);
				subtree = subtree.right;
				backTrack = false;
			}
		} else {
			if (isEmpty(subtree)) {
				backTrack = true;
			} else {
				result.push(subtree.value);

				stack.push(subtree.left);
				subtree = subtree.left;
			}
		}
	}
	return result;
};

const postOrder = (tree) => isEmpty(tree) ? [] : [...postOrder(tree.left), ...postOrder(tree.right), tree.value];


const breadthFirst = (tree) => {
	const result = [];
	const q = [tree];
	while (q.length) {
		const subtree = q.shift();
		if (!isEmpty(subtree)) {
			result.push(subtree.value);
			q.push(subtree.left, subtree.right);
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
