export function left(arr, searchItem) {
	console.log('asdasd');
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


export function right(arr, searchItem) {
	console.log('asdasdasd');

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

