var width = 800,
    height = 500,
    padding = { top: 50, bottom: 50, left: 50, right: 50 };

var svg = d3.select('body')
    .append('svg')
    .attr('width', `${width + padding.left + padding.right}px`)
    .attr('height', `${height + padding.top + padding.bottom}px`)

var g = svg.append('g')
    .attr('transform', `translate(${padding.left}, ${padding.top})`)