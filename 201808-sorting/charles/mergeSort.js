const { isLarger } = require('./utils');
module.exports = function mergeSort (array, legend) {
	if (array.length <= 1) return array;

	let list1 = [];
	let list2 = [];

	array.forEach((value, index) => {
		index < (array.length / 2) ? list1.push(value) : list2.push(value);
	});

	list1 = mergeSort(list1, legend);
	list2 = mergeSort(list2, legend);

	return merge(list1, list2, legend);
}

function merge (first, second, legend) {
	const left = first.slice();
	const right = second.slice();
	let sortedList = [];

	while (left.length || right.length) {
		const firstElement = left[0];
		const secondElement = right[0];
		if (isLarger(firstElement, secondElement, legend)) {
			sortedList.push(firstElement);
			left.shift();
		} else {
			sortedList.push(secondElement);
			right.shift();
		}
	}
	return sortedList;
}
