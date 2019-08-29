var dataset = {
	name:"中国",
	children:[
		{
			name:"浙江",
			children:[
				{name:"杭州" ,value:100},
				{name:"宁波",value:100}    				
            ]
		},
		{
			name:"广西",
			children:[
				{
					name:"桂林",
					children:[
						{name:"秀峰区",value:100},
        				{name:"叠彩区",value:100},
        				{name:"象山区",value:100},
       					{name:"七星区",value:100}
					]
				},
				{name:"南宁",value:100},
    			{name:"柳州",value:100},
    			{name:"防城港",value:100}
			]
		},
		{
			name:"黑龙江",
			children:[
				{name:"哈尔滨",value:100},
    			{name:"齐齐哈尔",value:100},
    			{name:"牡丹江",value:100},
    			{name:"大庆",value:100}
			]
		}
	]
};

var menuData = [
    {
        name: '增加节点',
        operate: '',
        icon: 'iconadd',
        children: [
            { name: '节点1', operate: 'add' },
            { name: '节点2', operate: 'add' },
            { name: '节点3', operate: 'add' }
        ]
    },
    {
        name: '删除节点',
        operate: 'remove',
        icon: 'iconremove'
    }
]

var menu = new Menu();
var tree = new Tree();
tree.initTree('body', dataset, treeClick, treeContextmenu);

function treeClick(event, node) {
    event.stopPropagation();
    event.preventDefault();

    console.log(node)
}

function treeContextmenu(event, node) {
    event.stopPropagation();
    event.preventDefault();

    menu.initMenu(event, menuData, function(menu) {
        if(menu.operate === 'remove') {
            tree.removeNode(node);
        }else if(menu.operate === 'add'){
            var nodeData = {
                name: menu.name,
            }
            tree.addNode(node, nodeData);
        }
    })
}

d3.select(".reset-btn").on('click', tree.resetPosition.bind(tree))