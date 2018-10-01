/*
 * Creation/modification API
 */

/*
 * Create and return a new tree object. This can have whatever shape you like.
 */
const newTree = () => ({});

/*
 * Insert `value` into `tree`.
 */
const insert = (tree, value) => {
  console.log(tree);
  if (!tree || !tree.value) tree.value = value;
  console.log(tree.value);
  if (value > tree.value) {
    insert(tree.right, value);
  } else if (value < tree.value) {
    insert(tree.left, value);
  }
  return tree;
};



/*
 * Remove `value` from `tree`. Only remove the first instance of the value if it appears multiple times.
 * Use the 'in-order predecessor` techinque for replacing the node when there are two child nodes.
 * (i.e. replace with the largest value from the nodes left-hand tree)
 */
const remove = (tree, value) => {};

/*
 * Query API
 */

/*
 * Determine whether `value` exists in the `tree`. Return boolean.
 */
const find = (tree, value) => {
  if (!tree) return false;
  if (tree.value === value) return true;
  if (tree.value > value) {
    return find(tree.right, value);
  } else if (tree.value < value) {
    return find(tree.left, value );
  }
};

/*
 * Calculate the depth of the given value within the tree. Return -1 if the value does not exist.
 * The value at the root has a depth of zero.
 */
const depth = (tree, value, counter = 0) => {
  if (!tree) return -1;
  if (tree.value === value) return counter;
  if (tree.value > value) return depth(tree.right, value, counter++);
  if (tree.value < value) return depth(tree.left, value, counter++);
};

/*
 * Calculate the height of the tree. An empty tree has a height of zero.
 */
const height = (tree, counter = 0) => {
  if (!tree) return counter;
  const depth = counter + 1;
  const left = height(tree.left, depth);
  const right = height(tree.right, depth);
  return left >= right ? left : right;
};

/*
 * Calculate the number of nodes in the tree.
 */
const count = (tree, counter = 0) => {
  if (!tree) return counter;
  const nodes = counter + 1;
  const left = count(tree.left, nodes);
  const right = count(tree.right, nodes);
  return left + right;
};

/*
 * Determine whether the tree is balanced or not. A tree is balanced if:
 *  - The left sub-tree is balanced, and
 *  - The right sub-tree is balanced, and
 *  - The height of the left sub-tree and right sub-tree differ by no more than one.
 *
 * An empty tree is always balanced.
 */
const balanced = (tree) => true;

/*
 * Calculate the biggest value in the tree. Behaviour is undefined for an empty tree.
 */
const biggest = (tree) => 0;

/*
 * Calculate the smallest value in the tree. Behaviour is undefined for an empty tree.
 */
const smallest = (tree) => 0;

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
const inOrder = (tree) => [];

/*
 * Traverse the tree using pre-order traversal, returning an array.
 */
const preOrder = (tree) => [];

/*
 * Traverse the tree using post-order traversal, returning an array.
 */
const postOrder = (tree) => [];

/*
 * Traverse the tree using breadth first (level-order) traversal, returning an array.
 */
const breadthFirst = (tree) => [];

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
