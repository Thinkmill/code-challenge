const { isLarger } = require('./utils');
module.exports = function selectionSort (array, legend) {
	const unsortedList = array.slice();
	const sortedList = []
	while (unsortedList.length > 0) {
		let largestItem = {
			value: '',
			index: null,
		};
		unsortedList.forEach((value, index) => {
			if (isLarger(value.toLowerCase(), largestItem.value.toLowerCase(), legend)) {
				largestItem = {
					value,
					index,
				}
			}
		});
		unsortedList.splice(largestItem.index, 1);
		sortedList.push(largestItem.value);
	}
	return sortedList.reverse();
};
