class ButtonMenu {
    constructor() {
        this.$container = null;
        this.data = null;
        this.options = {
            id: '',
            label: 'label',
            children: 'children',
            data: [],
            defaultLoadList: [],
            lazy: false,
            loadMenu: function() {},
            clickEvent: function() {}
        };
        this.defaultLoading = true;
        this.firstLoading = true;
    }
    
    init(options) {
        Object.assign(this.options, options);
        this.$container = $('#' + options.id);
        if(this.$container.length === 0) return;
        if(!this.options.lazy && this.options.data) {
            this.data = JSON.parse(JSON.stringify(this.options.data));
        }
        this.createMenu();
        this.initEvent();
    }

    createMenu(itemData) {
        let children = this.options.children;
        if(!itemData) {
            this.$container.append(`
                <div class="button-menu-content hide">
                    <div class="loading hide"><i class="iconfont iconloading"></i></div>
                    <ul class="button-menu-nav"><ul>
                </div>`);
        }
        if(itemData && itemData[children]) {
            this.createMenuEl(itemData[children]);
        }else {
            if(!this.options.lazy) {
                if(this.firstLoading) {
                    this.firstLoading = false;
                    this.createMenuEl(this.data);
                }
            }else {
                let getMenuData = new Promise((res, rej) => {
                    this.showLoading();
                    let loadMenu = this.options.loadMenu;
                    if(!typeof loadMenu === 'function') rej('LoadMenu is not a function');
                    loadMenu(itemData, res);
                });
                getMenuData.then(menuData => {
                    if(itemData) {
                        itemData[children] = menuData || [];
                    }else {
                        this.data = menuData || [];
                    }
                    this.createMenuEl(menuData)
                }).catch(e => {
                    console.log(e);
                }).finally(() => {
                    this.hideLoading();
                })
            }
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
            let label = item[this.options.label]
            let menuItem = document.createElement('span');
            menuItem.className = 'menu-options-item';
            menuItem.innerText = label;
            menuItem.title = label;
            // menuItem._data = item;
            menuItem.addEventListener('click', function() {
                // if($(this).hasClass('active')) return;
                $(this).addClass('active').siblings().removeClass('active');
                if(!_this.defaultLoading) {
                    _this.$container.find('.menu-btn-text').text(label);
                    if(typeof _this.options.clickEvent === 'function') {
                        _this.options.clickEvent(item);
                    }
                }
                let curLevel = $(this).parent('.menu-options-content').attr('level');
                _this.$container.find(`.menu-nav-item[level="${level}"]`).text(label).attr('title', label);
                _this.removeNextAll(parseInt(curLevel)+1);
                _this.createMenu(item);
            })
            $menuContainer.append(menuItem);
        })
        this.$container.find('.button-menu-content').append($menuContainer);
        if(this.defaultLoading) {
            let defaultLoadList = this.options.defaultLoadList;
            let hasDeafultLabel = menuData.some(item => {
                return item.label === defaultLoadList[level - 1]
            })
            if(level === defaultLoadList.length) this.defaultLoading = false;
            if(hasDeafultLabel) {
                $menuContainer.find('.menu-options-item[title="'+ defaultLoadList[level - 1] +'"]').click();
            }else {
                this.defaultLoading = false;
            }
        }
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
        this.$container.find('.loading').removeClass('hide');
    }

    hideLoading() {
        this.$container.find('.loading').addClass('hide');
    }
}
