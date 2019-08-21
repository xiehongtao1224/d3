function countWater(arr) {
	var maxSet = [],
		maxdata = arr[0];
	for(var i = 0; i < arr.length; i++) {
		if(maxdata < arr[i]) {
			maxSet = [i];
			maxdata = arr[i];
		}else if(maxdata === arr[i]) {
			maxSet.push[i];
		}
	}

	var water = 0,
		leftEnd,
		rightBegin,
		flag;
	if(maxSet.length > 1) {
		for(var i = 0; i < maxSet.length-1; i++) {
			for(var j = maxSet[i]+1; j < maxSet[i+1]; j++) {
				water += arr[maxSet[i]] - arr[j];
			}
		}
		leftEnd = maxSet[0];
		rightBegin = maxSet[maxSet.length - 1];
	}else {
		leftEnd = maxSet[0];
		rightBegin = maxSet[0];
	}

	flag = 0;
	for(var i = 0; i < leftEnd; i++) {
		if(arr[flag] > arr[i]) {
			water += arr[flag] - arr[i];
		}else {
			flag = i;
		}
	}

	flag = arr.length-1;
	for(var i = arr.length-1; i > rightBegin; i--) {
		if(arr[flag] > arr[i]) {
			water += arr[flag] - arr[i];
		}else {
			flag = i;
		}
	}

	return water;
}

var arr = [0,1,0,2,1,0,1,3,2,1,2,1];

console.log(countWater(arr));