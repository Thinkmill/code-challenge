module.exports.isLarger = function valueIsLarger(firstValue, secondValue, legend) {
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
