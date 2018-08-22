#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const selectionSort = require('./selectionSort');
const mergeSort = require('./mergeSort');

const sorters = {
	mergeSort,
	selectionSort,
}
const { isLarger } = require('./utils');
const codeChallenge = function () {
	try {
		const [ _, __, listKey = 'normies', sortType = 'mergeSort' ] = process.argv;

		console.log(`== USING ${sortType} to sort ${listKey} list`);

		const filePath = path.resolve(__dirname, '../unsorted.json');
		const sortLegendPath = path.resolve(__dirname, './sortLegend.txt');
		const lists = JSON.parse(fs.readFileSync(filePath));
		const sortLegend = fs.readFileSync(sortLegendPath).toString().split('\n');
		if (typeof sorters[sortType] !== 'function') {
			throw new Error('Expected second argument to have value of either mergeSort or selectionSort');
		}
		const sortedList = dedupe(sorters[sortType](lists[listKey], sortLegend)).reverse();
		fs.writeFileSync(path.resolve(__dirname,`${listKey}.json`), JSON.stringify(sortedList));
		console.log(`== FILE ${listKey}.json WRITTEN with sorted list`);
	} catch (e) {
		console.error(`=== ERROR: ${e.message}`);
	}
}

function dedupe (arr) {
	return arr.filter((el, i , arr) => arr.indexOf(el) === i);
}

codeChallenge();

// take first two items and compare them to each other
// the larger one gets moved
