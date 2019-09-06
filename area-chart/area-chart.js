var data = [
    {date: new Date(2007, 3, 24), value: 93.24},
    {date: new Date(2007, 3, 25), value: 85.35},
    {date: new Date(2007, 3, 26), value: 28.84},
    {date: new Date(2007, 3, 27), value: 69.92},
    {date: new Date(2007, 3, 30), value: 59.80},
    {date: new Date(2007, 4,  1), value: 39.47},
];

var width = 800,
    height = 500,
    padding = { top: 50, bottom: 50, left: 50, right: 50 };

var svg = d3.select('body')
    .append('svg')
    .attr('width', `${width + padding.left + padding.right}px`)
    .attr('height', `${height + padding.top + padding.bottom}px`)

var g = svg.append('g')
    .attr('transform', `translate(${padding.left}, ${padding.top})`)

var xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([0, width])

var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([height, 0])

var xAxis = d3.axisBottom(xScale)
var yAxis = d3.axisLeft(yScale)

g.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis)

g.append('g').call(yAxis)

var area = d3.area()
    .x(d => xScale(d.date))
    .y0(height)
    .y1(d => yScale(d.value))

g.append('path')
    .attr('d', area(data))
    .attr('fill', 'steelblue')


