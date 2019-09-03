class Tree{
	constructor() {
		this.svgContainer = null;
		this.groupX = null;
		this.groupY = null;
		this.xScale = null;
		this.yScale = null;
		this.xAxis = null;
		this.yAxis = null;
		this.treeContainer = null;
		this.nodesContainer = null;
		this.linksContainer = null;
		this.treeSize = null
		this.dataset = null;
		this.clickCb = null;
		this.contextmenuCb = null;
		this.zoom = null;
		this.tree = d3.tree()
			.separation((a, b) => {
				return 1;
				//return (a.parent == b.parent ? 1 : 2) / a.depth;
			})

		this.Bézier_curve_generator = d3.linkHorizontal()
			.x(d => d.y)
			.y(d => d.x)

		this.options = {
			nodeSpaceX: 100,
			nodeSpaceY: 60,
			nodeRadius: 20,
			originalX: 50,
			originalY: 50
		}
	}

	initTree(container, dataset, clickCb, contextmenuCb) {

		if(!(dataset && JSON.stringify(dataset) !== '{}')) return;

		this.dataset = JSON.parse(JSON.stringify(dataset));
		this.clickCb = clickCb;
		this.contextmenuCb = contextmenuCb;
		this.handleData(this.dataset);

		this.svgContainer = d3.select(container)
			.append('svg')
			.attr('class', 'svg-container')

		this.groupX = this.svgContainer.append('g')
			.attr('class', 'x-axis')

		this.groupY = this.svgContainer.append('g')
			.attr('class', 'y-axis')

		this.treeContainer = this.svgContainer.append('g')
			.attr('class', 'tree-container')

		this.linksContainer = this.treeContainer.append('g')
		this.nodesContainer = this.treeContainer.append('g')

		this.initGird();
		this.updateTree();
		this.initZoom();
	}

	updateTree() {
		var _this = this;
		var hierarchyData = d3.hierarchy(this.dataset);
		var treeData = this.getTreeData(hierarchyData);
		var nodes = treeData.descendants();
		var	links = treeData.links();

		var treeLinks = this.linksContainer
			.selectAll('.tree-link')
			.data(links, d => {
				return d.target.data.uuid;
			})

		var enterLinks = treeLinks.enter()
			.append('path')
			.attr('class', 'tree-link')
			.attr('d', d => {
				var start = {x: d.source.x, y: d.source.y};
				return this.Bézier_curve_generator({source: start, target: start});
			})

		treeLinks.exit().remove();

		var treeNodeContainer = this.nodesContainer
			.selectAll('.tree-node-container')
			.data(nodes, d => {
				return d.data.uuid;
			})

		var enterNodeContainer = treeNodeContainer.enter()
			.append('g')
			.attr('class', 'tree-node-container')
			.attr('transform', d => {
				if(d.parent) {
					return `translate(${d.parent.y + 5}, ${d.parent.x})`
				}
				return `translate(${d.y + 5}, ${d.x})`
			})

		treeNodeContainer.exit().remove();

		enterNodeContainer.append('circle')
			.attr('r', this.options.nodeRadius + 5)
			.attr('fill', '#fff')

		var treeNode = enterNodeContainer.append('circle')
			.attr('class', 'tree-node')
			.attr('r', this.options.nodeRadius)

		treeNode.on('click', function(d) {
			_this.nodesContainer.selectAll('.tree-node').classed('active', false);
			d3.select(this).classed('active', true);
			if(_this.clickCb && typeof _this.clickCb == 'function') {
				_this.clickCb(d3.event, d)
			}
		}).on('contextmenu', function(d) {
			if(_this.contextmenuCb && typeof _this.contextmenuCb == 'function') {
				_this.contextmenuCb(d3.event, d)
			}
		}).on('mousedown', function(d) {
			d3.event.stopPropagation();
		})

		d3.selectAll('.tree-link')
			.transition()
			//.ease(d3.easeLinear)
			.duration(300)
			// .delay(d => {
			// 	return d.source.depth * 500;
			// })
			.attr('d', d => {
				var start = {x: d.source.x, y: d.source.y},
					end = {x: d.target.x, y: d.target.y};
				return this.Bézier_curve_generator({source: start, target: end});
			})

		d3.selectAll('.tree-node-container')
			// .attr('opacity', 0)
			// .transition()
			// .duration(0)
			// .delay(d => {
			// 	return (d.depth === 0 ? 0 : d.depth - 1)  * 500;
			// })
			// .attr('opacity', 1)
			.transition()
			//.ease(d3.easeLinear)
			.duration(300)
			.attr('transform', d => {
				return `translate(${d.y + 5}, ${d.x})`
			})
	}

	initGird() {
		var containerWidth = this.svgContainer.node().clientWidth,
			containerHeight = this.svgContainer.node().clientHeight;

		this.xScale = d3.scaleLinear()
			.domain([0, containerWidth])
			.range([0, containerWidth])

		this.yScale = d3.scaleLinear()
			.domain([0, containerHeight])
			.range([0, containerHeight])

		this.xAxis = d3.axisBottom(this.xScale)
			.ticks(containerWidth/20)
			.tickSize(containerHeight)
    		.tickPadding(8 - containerHeight)
    		.tickFormat(d => {
    			return d % 100 === 0 ? d : '';
    		});

    	this.yAxis = d3.axisRight(this.yScale)
    		.ticks(containerHeight/20)
			.tickSize(containerWidth)
    		.tickPadding(8 - containerWidth)
    		.tickFormat(d => {
    			return d % 100 === 0 ? d : null;
    		});

		this.groupX.call(this.xAxis);
		this.groupY.call(this.yAxis);
	}

	initZoom() {
		var _this = this;

		this.zoom = d3.zoom()
			.scaleExtent([1/2, 2])
			// .extent([[0, 0], [100, 100]])
			// .translateExtent([[0, 0], [100, 100]])
			.on("zoom", zoomed);
		this.svgContainer.call(this.zoom)
			.on("dblclick.zoom", null);
		this.svgContainer.call(
			this.zoom.transform, 
			d3.zoomIdentity.translate(this.options.originalX, this.options.originalY)
		);

		function zoomed() {
			var transform = d3.zoomTransform(this);
			var containerWidth = _this.svgContainer.node().clientWidth,
				containerHeight = _this.svgContainer.node().clientHeight,
				nodeRadius = _this.options.nodeRadius,
				treeSize = _this.treeSize;

			/*********限制拖动范围*********/
			if(transform.y > containerHeight - 3 * nodeRadius * transform.k) {
				transform.y = containerHeight - 3 * nodeRadius * transform.k;
			}else if(transform.y < 0 - (treeSize.height - 3 * nodeRadius) * transform.k) {
				transform.y = 0 - (treeSize.height - 3 * nodeRadius) * transform.k;
			}

			if(transform.x > containerWidth - nodeRadius * transform.k) {
				transform.x = containerWidth -  nodeRadius * transform.k;
			}else if(transform.x < 0 - (treeSize.width - nodeRadius) * transform.k) {
				transform.x = 0 - (treeSize.width - nodeRadius) * transform.k;
			}
			/*********限制拖动范围*********/

            //setDottedLine(_this.groupX);
            _this.groupX.call(_this.xAxis.scale(transform.rescaleX(_this.xScale)))
            _this.groupY.call(_this.yAxis.scale(transform.rescaleY(_this.yScale)))
            setDottedLine(_this.groupX);
			setDottedLine(_this.groupY);
			_this.treeContainer.attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`);
			//_this.treeContainer.attr('transform', transform);
		}

		function setDottedLine(group) {
			group.selectAll('.tick line')
                .classed('dotted-line-axis', false)
				.filter(d => {
					return d % 100 !== 0;
                }).classed('dotted-line-axis', true)
		}
	}

	getTreeData(hierarchyData) {

		this.treeSize = {
			width: hierarchyData.height * this.options.nodeSpaceX,
			height: hierarchyData.leaves().length * this.options.nodeSpaceY
		}
		return this.tree.size([this.treeSize.height, this.treeSize.width])(hierarchyData);
	}

	handleData(data) {
		data.uuid = this.getDataUUID()
		if(data.children && data.children.length > 0) {
			data.children.forEach(item => {
				this.handleData(item);
			})
		}
	}

	getDataUUID() {
		var d = new Date().getTime();
	    if (window.performance && typeof window.performance.now === "function") {
	        d += performance.now();
	    }
	    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	        var r = (d + Math.random() * 16) % 16 | 0;
	        d = Math.floor(d / 16);
	        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	    });
	    return uuid;
	}

	addNode(node, childNodeData) {
		if(!(node.data.children instanceof Array)) {
			node.data.children = [];
		}
		childNodeData.uuid = this.getDataUUID();
		node.data.children.push(childNodeData);
		this.updateTree();
	}

	removeNode(node) {
		var uuid = node.data.uuid;
        node.parent.data.children.some((item, i) => {
            if(item.uuid === uuid) {
                node.parent.data.children.splice(i, 1);
                return true;
            }
        })
        this.updateTree();
	}

	resetPosition() {
		this.svgContainer
			.transition()
			.duration(500)
			.call(
				this.zoom.transform, 
				d3.zoomIdentity.translate(this.options.originalX, this.options.originalY)
			);
	}
}