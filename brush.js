var width = 500,
    height = 500;
var svg = d3.select('body')
    .append('svg')
    .attr('class', 'svg-container')

svg.append('g')
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('style', 'fill: #ccc;')

var brushContainer = svg.append('g')

var brush = d3.brush()
    .extent([[0, 0], [width, height]])
    // .on('start brush', brushed);

brushContainer.call(brush)
    .call(brush.move, [[width / 2 - 100, height / 2 - 100], [width / 2 + 100, height / 2 + 100]])

// function brushed() {

// }