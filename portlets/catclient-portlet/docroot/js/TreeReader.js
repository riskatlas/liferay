var TreeReader = function(config){
	config.loader = new Ext.tree.TreeLoader({
		url: config.serviceURL,
        createNode: function(attr){
  			attr.text = attr.title;
  			attr.qtip = attr.mdAbstract;
  			if(!attr.node){
  				attr.leaf = true;
  				attr.icon = 'style/img/bullet.gif';
  			}
			return Ext.tree.TreeLoader.prototype.createNode.call(this, attr);
  		},
        baseParams: {
        	project: 'catclient',
        	detail: 'summary',
        	language: 'cze',
        	treeBase: config.treeBase,
        	serviceName: 'cenian',
        	format: 'json',
        	start: 0
        },
        // je otazka, zda nevyresit na serveru ...
        processResponse: function(response, node, callback){
        	var pos = response.responseText.indexOf('"records":[');
        	if(pos>0){
        		response.responseText = response.responseText.substring(pos+10,response.responseText.length-1);
        	}
        	Ext.tree.TreeLoader.prototype.processResponse.call(this, response, node, callback);
        }
  });
  config.autoScroll = true;
  config.rootVisible = false;
  config:id = 'text';

  TreeReader.superclass.constructor.call(this,config);

  this.setRootNode(new Ext.tree.AsyncTreeNode({
    text: config.rootText,
    draggable: false,
    id: 'ROOT'
  }));

  this.selNode = function(node){
    if(node.leaf){
      this.handler(node.attributes);
    }
  }

  this.on('click', this.selNode, this);
  this.getRootNode().expand();
}

Ext.extend(TreeReader, Ext.tree.TreePanel, {});





