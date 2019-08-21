var arr = [5,2,3,6,8,4,1,9,7];

function quickSort(arr, l, r) {
	if(l >= r) return;
	var flag = arr[l],
		left = l,
		right = r;

	while(left < right) {

		while(right > left && arr[right] >= flag) right--;
		arr[left] = arr[right];

		while(left < right && arr[left] <= flag) left++;
		arr[right] = arr[left];

	}

	arr[left] = flag;
	quickSort(arr, l, left - 1)
	quickSort(arr, left + 1, r);
}
// quickSort(arr, 0, arr.length - 1);

function bubbleSort(arr) {
	var temp;

	for(var i = 0; i < arr.length; i++) {
		for(var j = 0; j < arr.length-1-i; j++) {
			if(arr[j] > arr[j+1]) {
				temp = arr[j];
				arr[j] = arr[j+1];
				arr[j+1] = temp;
			}
		}
	}
}
// bubbleSort(arr)

function selectionSort(arr) {
	var	k, temp;

	for(var i = 0; i < arr.length-1; i++) {
		k = i;
		for(var j = i+1; j < arr.length; j++) {
			if(arr[j] < arr[k]) {
				k = j;
			}
		}
		temp = arr[i]
		arr[i] = arr[k];
		arr[k] = temp;
	}
}
// selectionSort(arr)

function insertSort(arr) {
	
	for (var i = 1; i < arr.length; i++) {
		var j = i,
			target = arr[i];

		while(j > 0 && target < arr[j-1]) {
			arr[j] = arr[j-1];
			j--;
		}

		arr[j] = target;
	}
}
// insertSort(arr)
