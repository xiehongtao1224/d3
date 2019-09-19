var width = 1000,
    height = 500,
    height1 = 350,
    height2 = 100;
var padding = { top: 50, left: 50, bottom: 50, right: 50 };

var svg = d3.select('body')
    .append('svg')
    .attr('width', width + padding.left + padding.right)
    .attr('height', height + padding.top + padding.bottom)

var parseDate = d3.timeParse("%b %Y");

data.forEach(item => {
    item.date = parseDate(item.date);
});

var x1 = d3.scaleTime()
    .range([0, width])
    .domain(data.extent(d => d.date))
var x2 = d3.scaleTime()
    .range([0, width])
    .domain(x1.domain())
var y1 = d3.scaleLinear()
    .range([0, height1])
    .domain([0, data.max(d => d.price)])
var y2 = d3.scaleLinear()
    .range([0, height2])
    .domain(y1.domain())
