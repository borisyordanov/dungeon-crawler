export function findIndex(arr, searchItem) {
	if (!arr) {
		return [];
	}

	for (let i = 0; i < arr.length; i++) {
		for (let j = 0; j < arr[i].length; j++) {
			if (arr[i][j].name === searchItem) {
				return [i, j];
			}
		}
	}
}
