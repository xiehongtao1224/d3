var data = [
    {date: new Date(2007, 3, 24), value: 93.24},
    {date: new Date(2007, 3, 25), value: 95.35},
    {date: new Date(2007, 3, 26), value: 98.84},
    {date: new Date(2007, 3, 27), value: 99.92},
    {date: new Date(2007, 3, 30), value: 99.80},
    {date: new Date(2007, 4,  1), value: 99.47},
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
    .range([0, width])
    .domain(d3.extent(data, d => d.date))
var yScale = d3.scaleLinear()
    .range([height, 0])
    .domain(d3.extent(data, d => d.value))

var xAxis = d3.axisBottom(xScale)
    .tickSizeOuter(10)
    .tickSizeInner(10)
    .tickPadding(10)
    .ticks(5)
var yAxis = d3.axisLeft(yScale)

g.append('g').attr('transform', `translate(0, ${height})`).call(xAxis)
g.append('g').call(yAxis)

var line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.value))
    .curve(d3.curveLinearClosed)

g.append('path')
    .attr('d', line(data))
    .attr('style', () => {
        return 'fill: none; stroke: black; stroke-width: 1.5px;';
    })