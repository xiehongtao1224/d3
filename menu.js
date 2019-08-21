class Menu {
	constructor() { 
		this.menuData = null;
		this.menuContent = null;
		this.callback = null;
	}

	initMenu(event, data, callback) {

		if(!(data && data.length > 0)) return;
		this.menuData = data;

		if(this.menuContent) this.removeMenu();

		if(callback) {
			this.callback = callback;
		}

		this.menuContent = d3.select('body')
			.append('div')
			.attr('class', 'menu-content')

		this.createMenu(data, this.menuContent);
		this.revisePosition(this.menuContent, event);

		document.addEventListener('click', () => {
			if(this.menuContent) this.removeMenu();
		})

		document.addEventListener('contextmenu', () => {
			if(this.menuContent) this.removeMenu();
		})

	}

	createMenu(menuData, parentSelection) {
		var _this = this;

		var menuItems = parentSelection.selectAll('menu-item')
			.data(menuData)
			.enter()
			.append('div')
			.attr('class', 'menu-item')

		var itemContent =  menuItems.append('div')
			.attr('class', 'item-content')

		itemContent.each(function(d) {
			if(d.icon) {
				d3.select(this).append('i')
					.attr('class', () => {
						return 'iconfont ' + d.icon;
					})
			}
		})

		itemContent.append('span')
			.text(d => {
				return d.name
			})

		itemContent.each(function(d) {
			if(d.children && d.children.length > 0) {
				d3.select(this).append('i')
					.attr('class', 'iconfont iconright');
			}
		})

		itemContent.on('mouseenter', function(d) {
			d3.event.stopPropagation();
			_this.removeMenu(menuItems);
			if(!(d.children && d.children.length > 0)) return;

			var childContent = d3.select(this.parentNode)
				.append('div')
				.attr('class', 'menu-content child')
			_this.createMenu(d.children, childContent);
			_this.revisePosition(childContent);	
		}).on('click', function(d) {
			d3.event.stopPropagation();
			if(d.children && d.children.length > 0) return;
			_this.callback && typeof _this.callback == 'function' ? _this.callback(d) : '';
			_this.removeMenu();
		})

	}

	revisePosition(menuContent, event) {
		var menuWidth = menuContent.node().offsetWidth,
			windowWidth = window.innerWidth,
			windowHeight = window.innerHeight;

		if(event) {
			var menuX =  event.pageX,
				menuY =  event.pageY;

			if(menuX + menuWidth > windowWidth) {
				menuX = windowWidth - menuWidth;
			}
			menuContent.attr('style', () => {
				return `top: ${menuY}px; left: ${menuX}px;`
			})
		}else {
			var menuX = menuWidth;

			if(getPageX(menuContent.node()) + 2 * menuWidth > windowWidth) {
				menuX = 0 - menuWidth;
			}

			menuContent.attr('style', () => {
				return `top: 0px; left: ${menuX}px;`
			})
		}
	}


	removeMenu(item = this.menuContent) {
		if(item == this.menuContent) {
			item.remove();
		}else {
			item.select('.menu-content').remove();
		}
	}
}

function getPageX(el) {
	if(el.offsetParent) {
		return el.offsetLeft + getPageX(el.offsetParent);
	}else {
		return el.offsetLeft;
	}
}