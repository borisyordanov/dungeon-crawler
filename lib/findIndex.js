export function findIndex(arr, searchItem) {
	if (!arr) {
		return [];
	}

	for (var i = 0; i < arr.length; i++) {
		var index = arr[i].indexOf(searchItem);
		if (index > -1) {
			return [i, index];
		}
	}

	return [];
}
