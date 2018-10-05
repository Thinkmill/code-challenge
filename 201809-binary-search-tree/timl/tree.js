/* Creation/modification */
const newTree = () => ({ value: null, left: null, right: null });

const isEmpty = tree => tree.value === null;

const insert = (tree, value) => {
	if (isEmpty(tree)) {
		tree.value = value;
		tree.left = newTree();
		tree.right = newTree();
	} else {
		insert(value <= tree.value ? tree.left : tree.right, value);
	}
};

const _assign = (t1, t2) => { t1.value = t2.value; t1.left = t2.left, t1.right = t2.right; };

const _removeRightmost = (node) => {
	if (isEmpty(node.right)) {
		_assign(node, node.left); // Hoist left to here.
	} else {
		_removeRightmost(node.right);
	}
};

const remove = (tree, value) => {
	if (!isEmpty(tree)) {
		if (tree.value === value) {
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
		} else {
			remove(value <= tree.value ? tree.left : tree.right, value);
		}
	}
};

/* Query */
const find = (tree, value) => !isEmpty(tree) && (tree.value === value || find(value <= tree.value ? tree.left : tree.right, value));

const _depth = (tree, value) => tree.value === value ? 0 : _depth(value <= tree.value ? tree.left : tree.right, value) + 1;

const depth = (tree, value) => find(tree, value) ? _depth(tree, value) : -1;

const height = (tree) => isEmpty(tree) ? 0 : Math.max(height(tree.left), height(tree.right)) + 1;

const count = (tree) => isEmpty(tree) ? 0 : count(tree.left) + count(tree.right) + 1;

const balanced = (tree) => isEmpty(tree) || (balanced(tree.left) && balanced(tree.right) && Math.abs(height(tree.left) - height(tree.right)) <= 1);

const biggest = (tree) => isEmpty(tree.right) ? tree.value : biggest(tree.right);

const smallest = (tree) => isEmpty(tree.left) ? tree.value : smallest(tree.left);

/* Traversal */
const inOrder = (tree) => isEmpty(tree) ? [] : [...inOrder(tree.left), tree.value, ...inOrder(tree.right)];
const preOrder = (tree) => isEmpty(tree) ? [] : [tree.value, ...preOrder(tree.left), ...preOrder(tree.right)];
const postOrder = (tree) => isEmpty(tree) ? [] : [...postOrder(tree.left), ...postOrder(tree.right), tree.value];

const _bf = (q) => q.length ? [q[0].value, ..._bf(q.slice(1).concat([q[0].left, q[0].right].filter(t => t.value !== null)))] : [];

const breadthFirst = (tree) => isEmpty(tree) ? [] : _bf([tree]);

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
