var fs = require('fs');
const unsorted = '../unsorted.json';

// compare the arrays item by item and return the concatenated result
const merge = (left, right) => {
  let result = []
  let indexLeft = 0
  let indexRight = 0

  while (indexLeft < left.length && indexRight < right.length) {
    if (left[indexLeft] < right[indexRight]) {
      result.push(left[indexLeft])
      indexLeft++
    } else {
      result.push(right[indexRight])
      indexRight++
    }
  }

  return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight))
}

// Split the array into halves and merge them recursively 
const mergeSort = (arr) => {
  if (arr.length === 1) return arr; // return once we hit an array with a single item

  const middle = Math.floor(arr.length / 2) // get the middle item of the array rounded down
  const left = arr.slice(0, middle) // items on the left side
  const right = arr.slice(middle) // items on the right side

  return merge(
    mergeSort(left),
    mergeSort(right)
  )
}

fs.readFile(unsorted, 'utf8', (error, data) => {
  
  if (error) new Error(error);
  
  const key = 'villains'; //normies, heroes or villains
	const parsedData = JSON.parse(data);
  const result = mergeSort(parsedData[key]); // Merge Sort each value
  
  fs.writeFile(`${key}.json`, JSON.stringify(result), 'utf8', (error) => {
		if (error) new Error(error);
		console.log(`${key}.json`);
  });
  
});
