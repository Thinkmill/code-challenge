const fs = require('fs');
const unsorted = '../unsorted.json';

const sortOrder = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", " ", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ":", "-", ".", "'", "’", "#", "/", ]

// Function to swap two elements by assigning 
// the first to a temporary variable then
// reassigning the actual array elements
// This runs directly in the function and
// acts on the array in memory rather than returning
// a swapped array
const swap = (array, firstIndex, secondIndex) => {
	let temp = array[firstIndex];
	array[firstIndex] = array[secondIndex];
	array[secondIndex] = temp;
};

const indexOfMinimum = (array, startIndex) => {
	let minValue = array[startIndex];
	let minIndex = startIndex;
	/* Loop through the "sub array" or array not including the minIndex, 
	because we know that one has already been sorted If the index in the 
	loop is less than the minIndex, make it the minIndex instead */
	for(let i = minIndex + 1; i < array.length; i++) {
		if(array[i] < minValue) {
			minIndex = i;
			minValue = array[i];
		}
	} 
	return minIndex;
}; 

const selectionSort = (array) => {
	let newIndex;
	// Loop through the entire array, reassigning the minIndex as we go
	// Swap the minIndex with i because minIndex will be smaller
	for(let i = 0; i < array.length; i++) {
		newIndex = indexOfMinimum(array, i);
		swap(array, i, newIndex);
	}
	return array;
};

fs.readFile(unsorted, 'utf8', (error, data) => {

	if (error) new Error(error);

	const key = 'heroes'; //normies, heroes or villains
	const parsedData = JSON.parse(data);
	let result = selectionSort(parsedData[key]); // Selection Sort each value

	fs.writeFile(`${key}.json`, JSON.stringify(result), 'utf8', (error) => {
		if (error) new Error(error);
		console.log(`${key}.json`);
	});
	
	// Object.entries(parsedData).forEach( ([key, value]) => {
	// 	let result = selectionSort(value); // Selection Sort each value
	// 	fs.writeFile(`${key}.json`, JSON.stringify(result), 'utf8', (error) => {
	// 		if (error) new Error(error);
	// 		console.log(`${key}.json`);
	// 	});
	// });	

});
