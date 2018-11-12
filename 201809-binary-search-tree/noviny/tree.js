// @flow

/*::
type Leaf = {
	value: number,
	left: Leaf | null,
	right: Leaf | null
};

type Tree = {
	value: number | null,
	left: Leaf | null,
	right: Leaf | null
};
*/

const newTree = () /*: Tree */ => {
	return {
		value: null,
		left: null,
		right: null
	};
};

const getPath = (value /*: number */, tree /*: Leaf */) =>
	value <= tree.value ? tree.left : tree.right;

const insert = (tree /*: Tree | Leaf | null */, value /*: number */) /*: Leaf */ => {
	if (tree === null) return { left: null, right: null, value };
	if (tree.value === null) {
		tree.value = value;
	} else if (value <= tree.value) {
		tree.left = insert(tree.left, value);
	} else {
		tree.right = insert(tree.right, value);
	}
	return tree;
};

const getRightValueNode = tree => {
	if (tree.right) return getRightValueNode(tree.right);
	return tree.value;
};

const reassign = (tree /*: Tree */, node /*: Leaf */) => {
	tree.value = node.value;
	tree.left = node.left;
	tree.right = node.right;
};

const remove = (
	tree /*: Tree | Leaf | null */,
	value /*: number */,
	parent /*: ?Leaf | Tree */
) /*: void */ => {
	if (!find(tree, value) || tree === null) return;
	if (tree.value !== value) {
		let path = getPath(value, tree);
		remove(path, value, tree);
	} else {
		if (parent && tree.left === tree.right) {
			let direction = value <= parent.value ? 'left' : 'right';
			parent[direction] = null;
			return;
		} else {
			if (tree.left === tree.right) {
				tree.value = null;
				return;
			} else if (tree.left === null) {
				return reassign(tree, tree.right);
			} else if (tree.right === null) {
				return reassign(tree, tree.left);
			} else {
				let newVal = getRightValueNode(tree.left);
				tree.value = newVal;
				return remove(tree.left, newVal, tree);
			}
		}
	}
};

const find = (tree /*: Tree | Leaf | null */, value /*: number */) /*: boolean */ => {
	if (tree === null) return false;
	if (tree.value === null) return false;
	if (tree.value === value) return true;
	let path = getPath(value, tree);
	return find(path, value);
};

const depth = (tree /*: Tree | Leaf | null */, value /*: number */) /*: number */ => {
	if (tree === null) return -1;
	if (tree.value === null) return -1;
	if (tree.value === value) return 0;
	let path = getPath(value, tree);
	let calcDepth = depth(path, value);
	return calcDepth === -1 ? calcDepth : calcDepth + 1;
};

const height = (tree /*: Tree | Leaf | null */) /*: number */ => {
	if (tree === null) return 0;
	if (tree.value === null) return 0;
	let leftHeight = 1 + height(tree.left);
	let rightHeight = 1 + height(tree.right);
	return leftHeight > rightHeight ? leftHeight : rightHeight;
};

const count = (tree /*: Tree | Leaf | null */) /*: number */ => {
	if (tree === null) return 0;
	if (tree.value === null) return 0;
	return 1 + count(tree.left) + count(tree.right);
};

const cheekyIsWithinOne = (v1, v2) => [v1, v1 + 1, v1 - 1].includes(v2);

const balanced = (tree /*: Tree | Leaf | null */) /*: boolean */ => {
	if (tree === null) return true;
	if (tree.value === null) return true;
	if (tree.left === tree.right) return true;
	return (
		balanced(tree.left) &&
		balanced(tree.right) &&
		cheekyIsWithinOne(height(tree.left), height(tree.right))
	);
};
const biggest = (tree /*: Tree | Leaf */) /*: number | void */ => {
	if (tree.value === null) return undefined;
	if (tree.right === null) return tree.value;
	return biggest(tree.right);
};
const smallest = (tree /*: Tree | Leaf */) /*: number | void */ => {
	if (tree.value === null) return undefined;
	if (tree.left === null) return tree.value;
	return smallest(tree.left);
};
const inOrder = (tree /*: Tree | Leaf | null */) /*: number[] */ => {
	if (tree === null) return [];
	if (tree.value === null) return [];
	else return [...inOrder(tree.left), tree.value, ...inOrder(tree.right)];
};
const preOrder = (tree /*: Tree | Leaf | null */) /*: number[] */ => {
	if (tree === null) return [];
	if (tree.value === null) return [];
	else return [tree.value, ...preOrder(tree.left), ...preOrder(tree.right)];
};
const postOrder = (tree /*: Tree | Leaf | null */) /*: number[] */ => {
	if (tree === null) return [];
	if (tree.value === null) return [];
	else return [...postOrder(tree.left), ...postOrder(tree.right), tree.value];
};

const breadthFirst = (tree /*: Tree | Leaf */) /*: number[] */ => {
	if (tree === null) return [];
	if (tree.value === null) return [];
	let results = [];
	let queue = [];

	results.push(tree.value);
	queue.push(tree.left, tree.right);
	while (queue.length > 0) {
		let leaf = queue.shift();
		if (leaf === null) continue;
		results.push(leaf.value);
		queue.push(leaf.left, leaf.right);
	}

	return results;
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
	breadthFirst
};
