module.exports = function selectionSort (array, legend) {
	const unsortedList = array.slice();
	const sortedList = []
	while (unsortedList.length > 0) {
		let largestItem = {
			value: '',
			index: null,
		};
		unsortedList.forEach((value, index) => {
			if (valueIsLarger(value.toLowerCase(), largestItem.value.toLowerCase(), legend)) {
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

function valueIsLarger(firstValue, secondValue, legend) {
	if (!secondValue) return true;
	for (let index = 0; index < firstValue.length; index++) {
		const charVal1 = legend.indexOf(firstValue[index]);
		const charVal2 = legend.indexOf(secondValue[index]);

		if (charVal1 > charVal2 ) {
			return true;
		} else if (charVal1 < charVal2) {
			return false;
		}
	}
	return false;
}
