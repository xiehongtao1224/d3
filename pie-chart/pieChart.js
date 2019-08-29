var dataList = [
	{
		key: 'red',
		value: 10
	},
	{
		key: 'blue',
		value: 20
	},
	{
		key: 'green',
		value: 30
	},
	{
		key: 'yellow',
		value: 22
	},
	{
		key: 'gray',
		value: 33
	},
	{
		key: 'black',
		value: 50
	},
	{
		key: 'purple',
		value: 45
	}
]

var dataset = dataList.map(item => item.value);

var width = 400,
	height = 400;
var padding = {left:50, right:50, top:50, bottom:50};

var colorScale = d3.scaleOrdinal()   
		.domain(d3.range(dataset.length))
		.range(d3.schemeAccent)   //d3.schemeAccent 生成颜色数组

var arcGenerator = d3.arc()
		.innerRadius(0)
		.outerRadius(150)
        .padAngle(0.01)

var pie = d3.pie();
var pieData = pie(dataset);

/***** 第一个饼状图 *****/
var pieData1 = JSON.parse(JSON.stringify(pieData));

var svg1 = d3.select("#chart1")
		.append("svg")
		.attr("width", width + padding.left + padding.right)
		.attr("height", height + padding.top + padding.bottom)

var chartContent1 = svg1.append('g').attr('transform', `translate(${padding.left}, ${padding.top})`);

pieData1.sort(function (a, b) {
	return a.startAngle - b.startAngle;
})

var sum = 0;
pieData1.forEach(d => {
	d.duration = (d.endAngle - d.startAngle) * 500;
	d.delay = sum;
	sum += d.duration;
})

var chart1 = chartContent1.selectAll('.pie')
				.data(pieData1)
				.enter()
				.append('g')
				.attr('transform', `translate(${width/2}, ${height/2})`)

chart1.append('path')
	.attr('fill', (d, i) => {
		return colorScale(i)
	})
	.transition()
	.ease(d3.easeLinear)
	.duration(d => d.duration)
	.delay(d => d.delay)
	.attrTween('d', tweenPie1)

chart1.append('text')
	.text(d =>d.data)
	.attr("text-anchor","middle")
	.attr('style', 'opacity: 0')
	.transition()
	.ease(d3.easeQuadIn)
	.duration(d => d.duration)
	.delay(d => d.delay)
	.attr('style', 'opacity: 1')
	.attr('transform', d => {
		return `translate(${arcGenerator.centroid(d)})`
	})

function tweenPie1(d) {
	var i = d3.interpolateObject({ endAngle: d.startAngle }, d);
	return function (t) {
		return arcGenerator(i(t))
	}
}

/***** 第一个饼状图 结束*****/

/***** 第二个饼状图 *****/
var arcHoverGenerator = d3.arc()
		.innerRadius(0)
		.outerRadius(160)
		.padAngle(0.01)

var pieData2 = JSON.parse(JSON.stringify(pieData));

var svg2 = d3.select("#chart2")
		.append("svg")
		.attr("width", width + padding.left + padding.right)
		.attr("height", height + padding.top + padding.bottom)

var chartContent2 = svg2.append('g').attr('transform', `translate(${padding.left}, ${padding.top})`);

var chart2 = chartContent2.selectAll('.pie')
			.data(pieData2)
			.enter()
			.append('g')
			.attr('transform', `translate(${width/2}, ${height/2})`)

chart2.append('path')
	.attr('fill', (d, i) => {
		return colorScale(i)
	})
	.transition()
	.duration(2000)
	.attrTween('d', tweenPie2)

chart2.select('path').on('mouseover', function(d) {
	d3.select(this).attr('d', arcHoverGenerator)
}).on('mouseout', function(d) {
	d3.select(this).attr('d', arcGenerator)
})

function tweenPie2(d) {
	var i = d3.interpolateObject({ startAngle: 0, endAngle: 0 }, d);
	return function (t) {
		return arcGenerator(i(t))
	}
}

/***** 第二个饼状图 结束*****/
