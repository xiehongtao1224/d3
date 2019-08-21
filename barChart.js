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

var width = 400,
	height = 400;
var padding = {left:40, right:40, top:50, bottom:50};

var svg = d3.select("body")
		.append("svg", "#chart")
		.attr("width", width + padding.left + padding.right)
		.attr("height", height + padding.top + padding.bottom)

var chartContent = svg.append('g').attr('transform', `translate(${padding.left}, ${padding.top})`);

var xData = dataList.map(item => item.key);
var yData = dataList.map(item => item.value);

var xScale = d3.scaleBand()
	    .range([0, height])
	    .domain(xData)
	    .padding(0.1)

var yScale = d3.scaleLinear()
	    .domain([0, d3.max(yData)])
	    .range([height, 0])

var xAxis = d3.axisBottom(xScale),
	yAxis = d3.axisLeft(yScale).ticks(10);

chartContent.append('g').attr('transform', `translate(0, ${height})`).call(xAxis);
chartContent.append('g').call(yAxis);

var chart = chartContent.selectAll('.bar')
			.data(dataList)
			.enter()
			.append('g')

chart.append('rect')
	.attr('class', 'chart-bar')
	.attr('x', d => {
		return xScale(d.key);
	})
	.attr('y', height)
	.attr('width', xScale.bandwidth())
	.transition()
	.ease(d3.easeBounceIn)
	.delay((d, i) => {
		return (i + 1) * 50;
	})
	.duration(2000)
	.attr('y', d => {
		return yScale(d.value);
	})
	.attr('height', d => {
		return height - yScale(d.value);
	})

chart.append('text')
	.text(d => d.value)
	.attr('class', 'chart-text')
	.attr('x', d => {
		return xScale(d.key) + 15;
	})
	.attr('y', height)
	.transition()
	.ease(d3.easeBounceIn)
	.delay((d, i) => {
		return (i + 1) * 50;
	})
	.duration(2000)
	.attr('y', d => {
		return yScale(d.value) - 5;
	})

chart.on('mouseover', function() {
	d3.select(this).attr('opacity', 0.7)
}).on('mouseout', function() {
	d3.select(this).transition().delay(100).duration(500).attr('opacity', 1.0);
})
