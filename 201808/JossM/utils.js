'use strict';

function unique(value, index, self) {
	return self.indexOf(value) === index;
}
function clone(arr) {
	return arr.slice(0);
}
function toArray(obj) {
	return Object.keys(obj).map(k => obj[k]);
}

module.exports = exports = { clone, toArray, unique };
