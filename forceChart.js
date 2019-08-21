var width = 1000,
	height = 500;
var padding = {left:50, right:50, top:50, bottom:50};

var svg = d3.select('body')
			.append('svg')
			.attr('class', 'chart')
			.attr("width", width + padding.left + padding.right)
			.attr("height", height + padding.top + padding.bottom)

var g = svg.append('g')
			.attr('transform', `translate(${padding.left}, ${padding.top})`);

//节点集
var nodes = [
	{ name: "0" },
	{ name: "1" },
	{ name: "2" },
	{ name: "3" },
	{ name: "4" },
	{ name: "5" },
	{ name: "6" },
	{ name: "7" },
	{ name: "8" }
]

//边集
var edges = [
	{ source: 0, target: 4 },
	{ source: 4, target: 5 },
	{ source: 4, target: 6 },
	{ source: 4, target: 7 },
	{ source: 1, target: 6 },
	{ source: 2, target: 5 },
	{ source: 3, target: 7 },
	{ source: 5, target: 6 },
	{ source: 6, target: 7 },
	{ source: 6, target: 8 }
];

//颜色比例尺
var colorScale = d3.scaleOrdinal()
    		.domain(d3.range(nodes.length))
    		.range(d3.schemeCategory10)

var forceSimulation = d3.forceSimulation()
    		.force("link",d3.forceLink())
    		.force("charge",d3.forceManyBody())
    		.force("center",d3.forceCenter())

forceSimulation.nodes(nodes)
			.alphaDecay(0.02)  //alpha衰减系数[0,1]之间
			.alpha(1)
			.alphaTarget(0)
			.alphaMin(0.01)  //alpha降到alphaMin使停止运动
			.velocityDecay(0.4)  //速度衰减系数
    		.on("tick",ticked)  

forceSimulation.force("link")
    		.links(edges)
    		.distance(100)   //两个点之间的距离，默认30
    		.strength(0.2)   //两个点之间的强度，默认1 / Math.min(count(link.source), count(link.target))

forceSimulation.force("charge").strength(-30)  //两个点的作用力 +吸引 -排斥，默认-30

forceSimulation.force("center")
    		.x(width/2)
    		.y(height/2);

var links = g.append("g")
    		.selectAll("line")
    		.data(edges)
    		.enter()
    		.append("line")
    		.attr("stroke",function(d,i){
    			return colorScale(i);
    		})
    		.attr("stroke-width",1);


// var linksText = g.append("g")
//     		.selectAll("text")
//     		.data(edges)
//     		.enter()
//     		.append("text")
//     		.text(function(d){
//     			return d.relation;
//     		})


var gs = g.selectAll(".circleText")
    		.data(nodes)
    		.enter()
    		.append("g")
    		.attr("transform",function(d,i){
    			var cirX = d.x;
    			var cirY = d.y;
    			return "translate("+cirX+","+cirY+")";
    		})
    		.call(d3.drag()
    			.on("start",started)
    			.on("drag",dragged)
    			.on("end",ended));

gs.append("circle")
	.attr("r",10)
	.attr("fill",function(d,i){
		return colorScale(i);
	})
//文字
// gs.append("text")
// 	.attr("x",-10)
// 	.attr("y",-20)
// 	.attr("dy",10)
// 	.text(function(d){
// 		return d.name;
// 	})

function ticked(){
	links
		.attr("x1",function(d){return d.source.x;})
		.attr("y1",function(d){return d.source.y;})
		.attr("x2",function(d){return d.target.x;})
		.attr("y2",function(d){return d.target.y;});
		
	// linksText
	// 	.attr("x",function(d){
	// 	return (d.source.x+d.target.x)/2;
	// })
	// .attr("y",function(d){
	// 	return (d.source.y+d.target.y)/2;
	// });
		
	gs.attr("transform",function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

console.log(nodes)
console.log(edges)

function started(d){
	console.log(d);
	if(!d3.event.active){
		forceSimulation.alphaTarget(0.8).restart();
	}
	d.fx = d.x;
	d.fy = d.y;
}
function dragged(d){
	d.fx = d3.event.x;
	d.fy = d3.event.y;
}
function ended(d){
	if(!d3.event.active){
		forceSimulation.alphaTarget(0);
	}
	d.fx = null;
	d.fy = null;
}

