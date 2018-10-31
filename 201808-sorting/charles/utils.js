module.exports.isLarger = function valueIsLarger(firstValue, secondValue, legend) {
	if (!secondValue) return true;
  if (!firstValue) return false;
  const left = firstValue.toLowerCase();
  const right = secondValue.toLowerCase();
	for (let index = 0; index < firstValue.length; index++) {
		const charVal1 = legend.indexOf(left[index]);
		const charVal2 = legend.indexOf(right[index]);

		if (charVal1 > charVal2 ) {
			return true;
		} else if (charVal1 < charVal2) {
			return false;
		}
	}
	return false;
}
