import './designer-tree.scss';
import * as Selection from 'd3-selection';
import * as Transition from 'd3-transition';
import {hierarchy, tree} from 'd3-hierarchy';
import {linkHorizontal} from 'd3-shape';
import {zoom, zoomIdentity} from 'd3-zoom';
import {scaleLinear} from 'd3-scale';
import {axisBottom, axisRight} from 'd3-axis';
import {Subject} from 'rxjs';
import {IconMap} from '@assets/icon-manage/icon-map.js';

const generateUUID = Utils.generateUUID;

export class DesignerTree {

    options = {
        intervalX: 120,
        intervalY: 100,
        iconSize: 30,
        position: {
            left: 100,
            top: 40
        }
    };

    data = null;

    treeGraphSize = {
        height: null,
        width: null
    };

    hierarchyTree = tree().separation((a, b) => {
        return 1;
        // return a.parent === b.parent ? 1 : 2;
    });

    contextMenuSubject = new Subject();
    selectedNodeSubject = new Subject();

    constructor(containerElement, options) {
        this.options = Object.assign(this.options, options);
        this.container = Selection.select(containerElement).append('svg').classed('designer-tree', true);

        // 网格线路
        this.groupX = this.container.append('g')
            .attr('class', 'canvas-axis');
        this.groupY = this.container.append('g')
            .attr('class', 'canvas-axis');

        // 节点、连接线
        this.linksGroup = this.container.append('g')
            .classed('designer-tree-links', true);
        this.nodesGroup = this.container.append('g')
            .classed('designer-tree-nodes', true);

        this.initZoom();
    }

    init(data) {
        if (!data) return;

        data.forEach((node) => {
            if (!node.uuid) {
                node.uuid = generateUUID();
            }
        });

        this.data = this.stratifyData(data);
        this.updateTree();
    }

    initGrid() {
        let _this = this;
        let container = this.container.node();
        let height = container.clientHeight;
        let width = container.clientWidth;
        let interval = 100;

        let yTicks = Math.ceil(height / 20);
        let xTicks = Math.ceil((width) / (height) * yTicks);

        this.xScale = scaleLinear()
            .domain([0, width])
            .range([0, width]);

        this.yScale = scaleLinear()
            .domain([0, height])
            .range([0, height]);

        this.xAxis = axisBottom(this.xScale)
            .ticks(xTicks)
            .tickSize(height)
            .tickFormat((data, index) => {
                return data % interval === 0 ? data : null;
            })
            .tickPadding(8 - height);

        this.yAxis = axisRight(this.yScale)
            .ticks(yTicks)
            .tickSize(width)
            .tickFormat((data, index) => {
                return data % interval === 0 ? data : null;
            })
            .tickPadding(8 - width);

        this.groupX.call(setAxisX);
        this.groupY.call(setAxisY);

        function setAxisX(axis) {
            axis.call(_this.xAxis).enter();
            setShotAxis(axis);
        }

        function setAxisY(axis) {
            axis.call(_this.yAxis);
            setShotAxis(axis);
        }

        function setShotAxis(axis) {
            axis.selectAll('.tick line')
                .classed('canvas-shot-axis', false)
                .filter(data => {
                    return data % interval !== 0 ? data : null;
                })
                .classed('canvas-shot-axis', true);
        }
    }

    initZoom() {
        // 定义缩放
        this.initGrid();

        this.zoom = zoom()
            .scaleExtent([1 / 2, 2])
            .on('zoom', () => {
                zoomed.call(this);
            });

        function zoomed() {
            const transform = Selection.event.transform;
            const node = this.container.node();
            const containerWidth = node.clientWidth;
            const containerHeight = node.clientHeight;
            const interval = 100;
            let _this = this;

            function setShotAxis(axis) {
                axis.selectAll('.tick line')
                    .classed('canvas-shot-axis', false)
                    .filter(data => {
                        return data % interval !== 0 ? data : null;
                    })
                    .classed('canvas-shot-axis', true);
            }

            function transformAxisX(axis) {
                axis.call(_this.xAxis.scale(transform.rescaleX(_this.xScale)));
                setShotAxis(axis);
            }

            function transformAxisY(axis) {
                axis.call(_this.yAxis.scale(transform.rescaleY(_this.yScale)));
                setShotAxis(axis);
            }

            // // 增加拖动区域限制
            if (transform.x < 0 && Math.abs(transform.x) > (this.treeGraphSize.width) * transform.k) {
                transform.x = -((this.treeGraphSize.width)) * transform.k;
            } else if (transform.x > 0 && transform.x > containerWidth) {
                transform.x = containerWidth;
            } else {
                this.groupX.call(transformAxisX);
            }

            if (transform.y < 0 && Math.abs(transform.y) > (this.treeGraphSize.height - this.options.intervalY) * transform.k) {
                transform.y = -((this.treeGraphSize.height - this.options.intervalY)) * transform.k;
            } else if (transform.y > 0 && transform.y > containerHeight - this.options.intervalY) {
                transform.y = containerHeight - this.options.intervalY;
            } else {
                this.groupY.call(transformAxisY);
            }

            this.linksGroup.attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`);
            this.nodesGroup.attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`);
        }

        this.container.call(this.zoom)
        // .on('wheel.zoom', null)
            .on('dblclick.zoom', null);

        this.zoom.transform(this.container, zoomIdentity.translate(this.options.position.left, this.options.position.top));
    }

    getData() {
        return this.flattenData(this.data);
    }

    reposition() {
        this.zoom.transform(this.container.transition().duration(500),
            zoomIdentity.translate(this.options.position.left, this.options.position.top));
    }

    onContextMenu() {
        return this.contextMenuSubject.asObservable();
    }

    getSelectedNode() {
        return this.selectedNodeSubject.asObservable();
    }

    updateTree() {
        let _this = this;

        let root = hierarchy(this.data);
        this.updateTreeSize(root);

        // 更新link
        let link = this.linksGroup.selectAll('.designer-tree-link')
            .data(root.links(), d => {
                return `${d['source'].data.uuid}-${d['target'].data.uuid}`;
            });

        link.enter().append('path')
            .classed('designer-tree-link', true)
            .attr('d', d => {
                let o = {
                    x: d.source['data']['px'] || d.source['x'],
                    y: d.source['data']['py'] || d.source['y']
                };
                return this.linkLine({source: o, target: o});
            });
        link.exit().remove();

        // 更新node
        let node = this.nodesGroup.selectAll('.designer-tree-node')
            .data(root.descendants(), d => {
                return d['data']['uuid'];
            });

        node.selectAll('.designer-tree-node-text-label')
            .text(d => {
                const maxLength = 8;
                let label;
                if (d.label.length > maxLength) {
                    label = d.label.substr(0, maxLength) + '...';
                } else {
                    label = d.label;
                }
                return label || '';
            })
            .append('title')
            .text(d => d.label);

        const enterNode = node.enter()
            .append('g')
            .classed('designer-tree-node', true)
            .attr('transform', d => {
                let y = d['parent'] ? d['parent']['data']['py'] || d['parent']['y'] : d['y'];
                let x = d['parent'] ? d['parent']['data']['px'] || d['parent']['x'] : d['x'];
                return `translate(${y - this.options.iconSize / 2},${x - this.options.iconSize / 2})`;
            });

        enterNode.append('circle')
            .classed('designer-tree-node-back-circle-mask', true)
            .attr('cx', this.options.iconSize / 2)
            .attr('cy', this.options.iconSize / 2)
            .attr('r', this.options.iconSize / 2 * 2);

        enterNode.append('circle')
            .classed('designer-tree-node-circle-mask', true)
            .attr('cx', this.options.iconSize / 2)
            .attr('cy', this.options.iconSize / 2)
            .attr('r', this.options.iconSize / 2 * 1.7);

        enterNode.append('svg')
            .classed('designer-tree-node-icon', true)
            .attr('height', this.options.iconSize)
            .attr('width', this.options.iconSize)
            .append('use')
            .attr('xlink:href', d => `${d['data']['icon']}`);

        enterNode.append('g')
            .classed('designer-tree-node-text', true)
            .attr('transform', `translate(${this.options.iconSize / 2}, ${this.options.iconSize + 28})`)
            .datum((d) => d.data)
            .append('text')
            .text(d => d.name);

        enterNode.append('g')
            .attr('transform', `translate(${this.options.iconSize / 2}, ${this.options.iconSize + 42})`)
            .datum((d) => d.data)
            .append('text')
            .classed('designer-tree-node-text-label', true)
            .text(d => {
                const maxLength = 8;
                let label;
                if (d.label.length > maxLength) {
                    label = d.label.substr(0, maxLength) + '...';
                } else {
                    label = d.label;
                }
                return label || '';
            })
            .attr('title', d => d.label)
            .append('title')
            .text(d => d.label);

        let nodeExit = node.exit();
        nodeExit
            .on('mouseover', null)
            .on('mouseout', null)
            .on('click', null)
            .on('contextmenu', null);
        nodeExit.remove();

        enterNode
            .on('mousedown', function () {
                Selection.event.stopPropagation();
            })
            .on('click', function (d) {
                Selection.event.stopPropagation();
                if (Selection.select(this).classed('active')) {
                    Selection.select(this).classed('active', false);
                    _this.selectedNodeSubject.next({});
                    return;
                }

                _this.container.selectAll('.designer-tree-node').classed('active', false);
                Selection.select(this).classed('active', true);
                _this.selectedNodeSubject.next(d.data);
            })
            .on('contextmenu', function (d) {
                Selection.event.preventDefault();
                _this.contextMenuSubject.next({node: d, event: Selection.event});
            });

        // 过渡
        let transition = Transition.transition().duration(400);
        transition.selectAll('.designer-tree-link').attr('d', this.linkLine);
        transition.selectAll('.designer-tree-node').attr('transform', d => {
            d['data']['px'] = d['x'];
            d['data']['py'] = d['y'];
            return `translate(${d['y'] - this.options.iconSize / 2},${d['x'] - this.options.iconSize / 2})`;
        });

    }

    linkLine(d) {
        // 三次贝塞尔连线
        return linkHorizontal()
            .x(d => d['y'])
            .y(d => d['x'])(d);
        // 直连线
        // return `M${d.source.y},${d.source.x} L${d.target.y},${d.target.x}`;
    }

    flattenData(data) {
        let flatData = [];
        setNodePropTo(data);
        flatten(data);
        return flatData;

        function setNodePropTo(data,) {
            if (data.children && data.children.length > 0) {
                let to = [];
                data.children.forEach(item => {
                    to.push(item.uuid);
                    setNodePropTo(item);
                });
                data.to = to.join(',');
            } else {
                data['to'] = '';
            }
        }

        function flatten(data, parent) {
            if (data.children && data.children.length > 0) {
                let node = Object.assign({}, data);
                node.parent = null;
                node.children = null;

                node.from = parent ? parent.uuid || '' : '';

                // 过滤掉子节点
                flatData.push(node);

                data.children.forEach((item) => {
                    flatten(item, data);
                });

            } else {
                data.from = parent ? parent.uuid || '' : '';
                flatData.push(JSON.parse(JSON.stringify(data, (key, value) => {
                    if (key === 'parent') {
                        return undefined;
                    }
                    return value;
                })));
            }
        }

    }

    stratifyData(data) {
        let root = {};
        let parent;
        let nodes = {};

        data.forEach((node) => {
            nodes[node.uuid] = node;
        });

        data.forEach((node) => {
            if (!node.from || node.from === '') {
                root = node;
            } else {
                parent = nodes[node.from];
                if (parent.children) {
                    parent.children.push(node);
                } else {
                    parent.children = [node];
                }
                node.parent = parent;
            }
        });
        return root;
    }

    updateTreeSize(data) {
        let vertical = data.leaves().length;

        this.treeGraphSize = {
            height: this.options.intervalY * vertical,
            width: this.options.intervalX * data.height
        };

        return this.hierarchyTree.size([this.treeGraphSize.height, this.treeGraphSize.width])(data);
    }
}
