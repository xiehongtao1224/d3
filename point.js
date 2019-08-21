function getEqualPoint(arr, k) {
	var perimeter = 0,
		sideList = [];

	arr.push(arr[0]);
	for(var i = 0; i < arr.length-1; i++) {
		if(arr[i][0] === arr[i+1][0]) {
			var sideLength = arr[i+1][1] - arr[i][1];
			sideList.push({
				direction: sideLength > 0 ? 'y' : '-y',
				length: Math.abs(sideLength)
			})
		}else {
			var sideLength = arr[i+1][0] - arr[i][0];
			sideList.push({
				direction: sideLength > 0 ? 'x' : '-x',
				length: Math.abs(sideLength)
			})
		}
		perimeter += Math.abs(sideLength);
	}

	var equalVal = perimeter / k,
		equalPoint = [],
		remainLength = equalVal;

	arr.pop();
	for(var i = 0; i < arr.length; i++) {
		var sideLength = sideList[i].length,
			sideDirection = sideList[i].direction,
			countLength = 0,
			temp;

		while(sideLength - remainLength >= 0) {

			var point = [];
			switch(sideDirection) {
				case 'x':
					temp = (arr[i][0] + countLength + remainLength).toFixed(2) - 0
					point.push(temp)
					point.push(arr[i][1])
					break;
				case '-x':
					temp = (arr[i][0] - countLength - remainLength).toFixed(2) - 0
					point.push(temp)
					point.push(arr[i][1])
					break;
				case 'y':
					temp = (arr[i][1] + countLength + remainLength).toFixed(2) - 0
					point.push(arr[i][0])
					point.push(temp)
					break;
				case '-y':
					temp = (arr[i][1] - countLength - remainLength).toFixed(2) - 0
					point.push(arr[i][0])
					point.push(temp)
					break;
			}
			equalPoint.push(point);
			sideLength = (sideLength - remainLength).toFixed(2) - 0;
			countLength += remainLength;
			remainLength = equalVal;
		}

		countLength = 0;
		remainLength = (remainLength - sideLength).toFixed(2) - 0;
	}
	return equalPoint;
}

var arr = [[0,0], [0,1], [2,1], [2,2], [0,2], [0,3], [3,3], [3,0]];

console.log(getEqualPoint(arr, 5));