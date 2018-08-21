const fs = require('fs');
const selectionSort = require('./selectionSort');

try {
	const { normies, heroes, vilains} = JSON.parse(fs.readFileSync('./unsorted.json'));
	const sortLegend = fs.readFileSync('./sortLegend.txt').toString().split('\n');
	const sortedNormies = selectionSort(normies, sortLegend);
} catch (e) {
	console.error(e);
}

function mergeSort (array) {
	if (array.length <= 1) return array;
	
	let list1 = [];
	let list2 = [];

	array.forEach((value, index) => {
		index < (array.length / 2)) ? list1.push(value) : list2.push(value);
	});

	mergeSort(list1);
	mergeSort(list2);

	return merge(list1, list2);
}

// take first two items and compare them to each other
// the larger one gets moved
