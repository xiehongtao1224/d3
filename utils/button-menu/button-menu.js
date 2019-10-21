class ButtonMenu {
    constructor() {
        this.$container = null;
        this.data = null;
        this.options = {
            id: '',
            label: 'label',
            loadMenu: function() {},
            clickEvent: function() {}
        };
    }
    
    init(options) {
        Object.assign(this.options, options);
        this.$container = $('#' + options.id);
        if(this.$container.length === 0) return;
        this.createMenu();
        this.initEvent();
    }

    createMenu(item) {
        if(!item) {
            this.$container.append(`
                <div class="button-menu-content hide">
                    <div class="loading hide"><i class="iconfont iconloading"></i></div>
                    <ul class="button-menu-nav"><ul>
                </div>`);
        }
        if(item && item._data.children) {
            this.createMenuEl(item._data.children);
        }else {
            let getMenuData = new Promise((res, rej) => {
                this.showLoading();
                let loadMenu = this.options.loadMenu;
                if(!typeof loadMenu === 'function') rej('LoadMenu is not a function');
                loadMenu(item ? item._data : null, res);
            });
            getMenuData.then(menuData => {
                if(item) {
                    item._data.children = menuData || [];
                }else {
                    this.data = menuData || [];
                }
                this.createMenuEl(menuData);
            }).catch(e => {
                console.log(e);
            }).finally(() => {
                this.hideLoading();
            })
        }
    }

    createMenuEl(menuData) {
        if(!(menuData && menuData.length > 0)) return;

        let _this = this;
        let level = this.$container.find('.menu-nav-item').length + 1;
        this.$container.find('.menu-nav-item').removeClass('active');
        this.$container.find('.menu-options-content').addClass('hide');
        this.$container.find('.button-menu-nav').append(`<li class="menu-nav-item active" level="${level}">请选择</li>`);
        let $menuContainer = $(`<div class="menu-options-content" level="${level}"></div>`);
        menuData.forEach(item => {
            var label = item[this.options.label]
            var menuItem = document.createElement('span');
            menuItem.className = 'menu-options-item';
            menuItem.innerText = label;
            menuItem._data = item;
            menuItem.addEventListener('click', function() {
                if($(this).hasClass('active')) return;
                $(this).addClass('active').siblings().removeClass('active');
                if(typeof _this.options.clickEvent === 'function') {
                    _this.options.clickEvent(item);
                }
                let curLevel = $(this).parent('.menu-options-content').attr('level');
                _this.$container.find(`.menu-nav-item[level="${level}"]`).text(label);
                _this.removeNextAll(parseInt(curLevel)+1);
                _this.createMenu(this);
            })
            $menuContainer.append(menuItem);
        })
        this.$container.find('.button-menu-content').append($menuContainer);
    }

    removeNextAll(level) {
        let menuNav = this.$container.find(`.menu-nav-item[level="${level}"]`);
        if(menuNav.length > 0) {
            menuNav.remove();
            this.$container.find(`.menu-options-content[level="${level}"]`).remove();
            this.removeNextAll(level+1);
        }
    }

    initEvent() {
        let _this = this;
        $('body').click(() => {
            this.$container.find('.menu-btn').removeClass('active');
            this.$container.find('.button-menu-content').addClass('hide');
        })
        this.$container.on('click', '.menu-btn', function(e) {
            e.stopPropagation();
            if($(this).hasClass('active')) {
                $(this).removeClass('active');
                _this.$container.find('.button-menu-content').addClass('hide');
            }else {
                $(this).addClass('active');
                _this.$container.find('.button-menu-content').removeClass('hide');
            }
        });
        this.$container.on('click', '.menu-nav-item', function() {
            let level = $(this).attr('level');
            $(this).addClass('active').siblings().removeClass('active');
            _this.$container.find(`.menu-options-content[level="${level}"]`).removeClass('hide')
                .siblings('.menu-options-content').addClass('hide');
            
        })
        this.$container.on('click', '.button-menu-content', function(e) {
            e.stopPropagation();
        })
    }

    showLoading(){
        console.log('showLoading......');
        this.$container.find('.loading').removeClass('hide');
    }

    hideLoading() {
        console.log('hideLoading......');
        this.$container.find('.loading').addClass('hide');
    }
}