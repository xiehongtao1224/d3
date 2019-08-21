import './normal-menu.scss';
import * as Selection from 'd3-selection';

export class NormalMenu {

    menuData = null;
    menuSelection = null;
    promiseReject = null;

    constructor() {
        document.addEventListener('click', () => {
            if (this.promiseReject) {
                this.promiseReject();
                this.promiseReject = null;
            }
            if (this.menuSelection) {
                this.removeMenu();
            }
        }, false);
        document.addEventListener('contextmenu', () => {
            if (this.promiseReject) {
                this.promiseReject();
                this.promiseReject = null;
            }
            if (this.menuSelection) {
                this.removeMenu();
            }
        }, false);
    }

    //调用方法显示菜单
    initMenu(event, menu) {
        this.menuData = menu;
        return new Promise((resolve, reject) => {
            this.removeMenu();
            event.stopPropagation();
            this.promiseReject = reject;

            this.menuSelection = Selection.select('body')
                .append('div')
                .classed('normal-menu', true);

            this.createMenuItems(this.menuData, this.menuSelection, resolve);
            this.revisePosition(this.menuSelection, event);
        });
    }

    // 生成器
    createMenuItems(menuData, parentItemsSelection, resolve) {
        let _this = this;

        let menuItems = parentItemsSelection
            .append('div')
            .classed('normal-menu-items', true);

        let menuItem = menuItems.selectAll('.normal-menu-item')
            .data(menuData).enter()
            .append((d) => {
                if (d.name !== 'segment') {
                    return document.createElement('div');
                } else {
                    let segment = document.createElement('span');
                    segment.setAttribute('class', 'segment');
                    return segment;
                }
            })
            .classed('normal-menu-item', true);

        menuItem.append('svg')
            .classed('normal-menu-item-icon', true)
            .append('use')
            .attr('xlink:href', d => `${d['icon']}`);

        menuItem.append('span')
            .classed('normal-menu-item-label', true)
            .text(d => {
                if (d.name !== 'segment') {
                    return d.name;
                }
            });

        menuItem.each(function (d) {
            if (d.children && d.children.length > 0) {
                Selection.select(this).append('span').classed('normal-menu-item-expand-icon', true)
                    .append('i').classed('fa fa-angle-right', true);
            }
        });

        menuItem
            .on('mouseenter', function (d) {
                Selection.event.stopPropagation();
                _this.removeMenu(menuItems);

                // 有下级菜单元素展示下级菜单
                if (d.children && d.children.length > 0) {
                    _this.createMenuItems(d.children, menuItems, resolve);
                    _this.revisePosition(menuItems, null, this.offsetTop);
                }
            })
            .on('click', (d) => {
                Selection.event.stopPropagation();
                if (d.children && d.children.length > 0) return;

                if (d.operation) {
                    resolve({operation: d.operation, argument: d.argument});
                    this.removeMenu();
                }
            });
    }

    // 调整边缘位置
    revisePosition(menuSelection, event, offsetTop) {
        if (event) {
            // 一级菜单位置;
            let documentWidth = window.innerWidth;
            let documentHeight = window.innerHeight;

            let menuWidth = menuSelection.node().offsetWidth;
            let menuHeight = menuSelection.node().offsetHeight;

            let pageX = event.pageX;
            let pageY = event.pageY;

            if (documentWidth - pageX < menuWidth) {
                pageX = documentWidth - menuWidth;
            }
            if (documentHeight - pageY < menuHeight) {
                pageY = documentHeight - menuHeight;
            }

            menuSelection
                .style('top', `${pageY}px`)
                // .style('left', `265px`);
                .style('left', `${pageX}px`);
        } else {
            // 下级菜单位置;
            let menu = menuSelection.select('.normal-menu-items');

            let documentWidth = window.innerWidth;
            let documentHeight = window.innerHeight;

            let menuWidth = menu.node().offsetWidth;
            let menuHeight = menu.node().offsetHeight;

            let menuOffsetTop = Utils.edgeTop(menu.node());
            let menuOffsetLeft = Utils.edgeLeft(menu.node());

            if (documentWidth - menuOffsetLeft < menuWidth) {
                menu.style('right', 'auto')
                    .style('left', `-${menuWidth}px`);
            }

            let offsetBottom = documentHeight - menuOffsetTop - offsetTop;
            if (offsetBottom < menuHeight) {
                menu.style('top', `-${menuHeight - offsetBottom - offsetTop}px`);
            } else {
                menu.style('top', `${offsetTop - menu.select('.normal-menu-item').node().offsetTop}px`);
            }
        }
    }

    removeMenu(menu = this.menuSelection) {
        if (!menu) return;
        if (menu !== this.menuSelection) {
            menu = menu.select('.normal-menu-items');
            menu.remove();
        } else {
            menu.remove();
        }
    }

}
