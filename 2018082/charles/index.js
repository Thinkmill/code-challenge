const fs = require('fs');
const path = require('path');
const selectionSort = require('./selectionSort');
const { isLarger } = require('./utils');

try {
	const filePath = path.resolve(__dirname, '../unsorted.json');
	const sortLegendPath = path.resolve(__dirname, './sortLegend.txt');
	console.log(filePath);
	const { normies, heroes, villains} = JSON.parse(fs.readFileSync(filePath));
	const sortLegend = fs.readFileSync(sortLegendPath).toString().split('\n');
	const sortedNormies = mergeSort(heroes, sortLegend);
	console.log(sortedNormies);
} catch (e) {
	console.error(e);
}

function mergeSort (array, legend) {
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

	while (left.length && right.length) {
		const firstElement = left[0];
		const secondElement = right[0];
		if (isLarger(firstElement.toLowerCase(), secondElement.toLowerCase(), legend)) {
			sortedList.push(firstElement);
			left.shift();
		} else {
			sortedList.push(secondElement);
			right.shift();
		}
	}

	while (left.length) {
		sortedList.push(left[0]);
		left.shift();
	};

	while (right.length) {
		sortedList.push(right[0]);
		right.shift();
	};
	return sortedList;
}

// take first two items and compare them to each other
// the larger one gets moved
