var width = 1000,
    height = 500,
    zoomHeight = 350,
    brushHeight = 100;
var padding = { top: 50, left: 50, bottom: 50, right: 50 };

var svg = d3.select('body')
    .append('svg')
    .attr('width', width + padding.left + padding.right)
    .attr('height', height + padding.top + padding.bottom)

svg.append('defs')
    .append('clipPath')
    .attr('id', 'clipArea')
    .append('rect')
    .attr('width', width)
    .attr('height', zoomHeight)


var zoomContent = svg.append('g')
    .attr('transform', `translate(${padding.left}, ${padding.top})`);

var brushContent = svg.append('g')
    .attr('transform', `translate(${padding.left}, ${padding.top + height - brushHeight})`);

var parseDate = d3.timeParse("%b %Y");

data.forEach(item => {
    item.date = parseDate(item.date);
    item.value -= 0;
});

var zoomX = d3.scaleTime()
    .range([0, width])
    .domain(d3.extent(data, d => d.date))
var zoomY = d3.scaleLinear()
    .range([zoomHeight, 0])
    .domain([0, d3.max(data, d => d.value)])
var brushX = d3.scaleTime()
    .range([0, width])
    .domain(zoomX.domain())
var brushY = d3.scaleLinear()
    .range([brushHeight, 0])
    .domain(zoomY.domain())

var zoomArea = d3.area()
    .x(d => zoomX(d.date))
    .y0(zoomHeight)
    .y1(d => zoomY(d.value))

var brushArea = d3.area()
    .x(d => zoomX(d.date))
    .y0(brushHeight)
    .y1(d => brushY(d.value))

zoomContent.append('path')
    .datum(data)
    .attr('d', zoomArea)
    .attr('class', 'zoom-area')

brushContent.append('path')
    .attr('d', brushArea(data))
    .attr('class', 'brush-area')

var zoomXAxis = d3.axisBottom(zoomX),
    zoomYAxis = d3.axisLeft(zoomY),
    brushXAxis = d3.axisBottom(brushX);

zoomContent.append('g')
    .attr('class', 'axis-x')
    .attr('transform', `translate(0, ${zoomHeight})`)
    .call(zoomXAxis)
zoomContent.append('g')
    .attr('class', 'axis-y')
    .call(zoomYAxis)

brushContent.append('g')
    .attr('class', 'axis-x')
    .attr('transform', `translate(0, ${brushHeight})`)
    .call(brushXAxis)


var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, zoomHeight]])
    .extent([[0, 0], [width, zoomHeight]])
    .on('zoom', zoomed);

var brush = d3.brushX()
    .extent([[0, 0], [width, brushHeight]])
    .on('brush end', brushed)

brushContent.append('g')
    .attr('class', 'brushTarget')
    .call(brush)
    .call(brush.move, [0, width])

zoomContent.append('rect')
    .attr('width', width)
    .attr('height', zoomHeight)
    .attr('class', 'zoomTarget')
    .call(zoom)

function zoomed () {
    if(d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return;
    var t = d3.event.transform;
    zoomX.domain(t.rescaleX(brushX).domain());
    zoomContent.select('.zoom-area').attr('d', zoomArea);
    zoomContent.select('.axis-x').call(zoomXAxis);
    brushContent.select('.brushTarget').call(brush.move, zoomX.range().map(t.invertX, t));
}

function brushed () {
    if(d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return;
    var s = d3.event.selection || brushX.range();
    zoomX.domain(s.map(brushX.invert, brushX));
    zoomContent.select('.zoom-area').attr('d', zoomArea);
    zoomContent.select('.axis-x').call(zoomXAxis)
    zoomContent.select('.zoomTarget').call(
        zoom.transform,
        d3.zoomIdentity.scale(width / (s[1] - s[0]))
            .translate(-s[0], 0)
    )
}
