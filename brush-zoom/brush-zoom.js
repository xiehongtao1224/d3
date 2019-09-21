var width = 1000,
    height = 500,
    height1 = 350,
    height2 = 100;
var padding = { top: 50, left: 50, bottom: 50, right: 50 };

var svg = d3.select('body')
    .append('svg')
    .attr('width', width + padding.left + padding.right)
    .attr('height', height + padding.top + padding.bottom)

var zoomContent = svg.append('g')
    .attr('transform', `translate(${padding.left}, ${padding.top})`);

var brushContent = svg.append('g')
    .attr('transform', `translate(${padding.left}, ${padding.top + height - height2})`);

var parseDate = d3.timeParse("%b %Y");

data.forEach(item => {
    item.date = parseDate(item.date);
    item.value -= 0;
});

var x1 = d3.scaleTime()
    .range([0, width])
    .domain(d3.extent(data, d => d.date))
var x2 = d3.scaleTime()
    .range([0, width])
    .domain(x1.domain())
var y1 = d3.scaleLinear()
    .range([height1, 0])
    .domain([0, d3.max(data, d => d.value)])
var y2 = d3.scaleLinear()
    .range([height2, 0])
    .domain(y1.domain())

var xAxis1 = d3.axisBottom(x1).ticks(10),
    xAxis2 = d3.axisBottom(x2),
    yAxis1 = d3.axisLeft(y1);

zoomContent.append('g')
    .attr('class', 'axis-x')
    .attr('transform', `translate(0, ${height1})`)
    .call(xAxis1)
zoomContent.append('g')
    .attr('class', 'axis-y')
    .call(yAxis1)

brushContent.append('g')
    .attr('class', 'axis-x')
    .attr('transform', `translate(0, ${height2})`)
    .call(xAxis2)

var area1 = d3.area()
    .x(d => x1(d.date))
    .y0(height1)
    .y1(d => y1(d.value))

var area2 = d3.area()
    .x(d => x1(d.date))
    .y0(height2)
    .y1(d => y2(d.value))

zoomContent.append('path')
    .attr('d', area1(data))
    .attr('fill', 'steelblue')

brushContent.append('path')
    .attr('d', area2(data))
    .attr('fill', 'steelblue')

var zoom = d3.zoom()
    .scaleExtent([1, 20])
    .translateExtent([[0, 0], [width, height1]])
    .extent([[0, 0], [width, height1]])
    .on('zoom', zoomed);

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on('brush end', brushed)

function zoomed () {

}

function brushed () {
    
}
