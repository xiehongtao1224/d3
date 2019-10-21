function ButtonNav() {
    this.$container = null;
    this.data = null;
    this.callback = null;
    this.options = {
        toggleEvent: 'click',
        label: 'label'
    }
}
ButtonNav.prototype.init = function(container, data, callback, options) {
    this.$container = $('#'+container);
    if(this.$container.length === 0) return;
    if(!(data && data.length > 0)) return;
    this.data = data;
    if(callback && typeof callback === 'function') this.callback = callback;
    if(options && typeof options === 'object') {
        Object.assign(this.options, options);
    }
    var $navContent = this.createNav(this.data, false);
    this.$container.append($navContent);
    this.initEvent();
}
ButtonNav.prototype.createNav = function(data, child) {
    var _this = this;
    var $navContent = $('<div class="button-nav-content hide '+ (child ? 'child' : '') +'"></div>');
    if(child) {
        $navContent.append('<span class="nav-content-arrow"></span>');
    }
    data.forEach((item, i) => {
        var $navItem = $('<div class="button-nav-item"></div>');
        var navItemContent = document.createElement('div');
        navItemContent.className = 'nav-item-content';
        navItemContent.innerText = item[this.options.label];
        navItemContent._data = item;
        navItemContent.addEventListener('click', function(e) {
            e.stopPropagation();
            _this.$container.find('.nav-item-content').removeClass('active');
            $(this).addClass('active');
            if(_this.callback) {
                _this.callback(item);
            }
        })
        $navItem.append(navItemContent);
        // click事件有多级菜单  mouseover没有
        if(item.children && item.children.length > 0 && this.options.toggleEvent === 'click') {
            $navItem.append(this.createNav(item.children, true));
        }
        $navContent.append($navItem);
    })
    return $navContent;
}

ButtonNav.prototype.initEvent = function() {
    var _this = this;
    if(this.options.toggleEvent === 'click') {
        $('body').click(function() {
            _this.hideNav();
        })
        this.$container.on('click', '.nav-btn', function(e) {
            e.stopPropagation();
            $(this).hasClass('active') ? _this.hideNav() : _this.showNav();
        });
        this.$container.on('mouseenter', '.nav-item-content', function() {
            var $parent = $(this).parent('.button-nav-item');
            $parent.siblings().removeClass('showChildren')
                .children('.button-nav-content').addClass('hide');
            if(this._data.children && this._data.children.length > 0) {
                $parent.addClass('showChildren')
            }
            $(this).next('.button-nav-content').removeClass('hide')
        })
    }else if(this.options.toggleEvent === 'mouseover') {
        this.$container.find('.nav-btn').next('.button-nav-content').css('top', '102%');

        this.$container.on('mouseover', function(e) {
            _this.$container.children('.nav-btn').addClass('active');
            _this.$container.find('.button-nav-content').removeClass('hide');
        });
        this.$container.on('mouseout', function(e) {
            _this.$container.children('.nav-btn').removeClass('active');
            _this.$container.find('.button-nav-content').addClass('hide');
        });
    }
}

ButtonNav.prototype.hideNav = function() {
    console.log('hideNav')
    this.$container.children('.nav-btn').removeClass('active');
    this.$container.find('.button-nav-content').addClass('hide');
    this.$container.find('.showChildren').removeClass('showChildren');
}

ButtonNav.prototype.showNav = function() {
    console.log('showNav')
    this.$container.children('.nav-btn').addClass('active');
    var $activeItem = this.$container.find('.nav-item-content.active');
    if($activeItem.length > 0) {
        $activeItem.parents('.button-nav-content').removeClass('hide')
            .parent('.button-nav-item').addClass('showChildren');
    }else {
        this.$container.children('.button-nav-content').removeClass('hide');
    }
}
