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

