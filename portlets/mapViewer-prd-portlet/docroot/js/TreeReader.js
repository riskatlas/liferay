var TreeReader = function(config){

    config.loader = new Ext.tree.TreeLoader({
        url: config.serviceURL,
        createNode: function(attr){
            attr.text = attr.title;
            attr.qtip = attr.mdAbstract;
            if(!attr.node){
                attr.leaf = true;
                if(config.leafIcon) {
                    attr.icon = config.leafIcon;
                }
            }
            return Ext.tree.TreeLoader.prototype.createNode.call(this, attr);
        },
        baseParams: {
            project: 'catclient',
            detail: 'summary',
            lang: config.lang,
            sortBy: 'title',
            query: "",
            treeBase: config.treeBase,
            serviceName: config.serviceName,
            format: 'json',
            start: 0
        },
        // upravi odpoved json
        processResponse: function(response, node, callback){
            var js  = Ext.util.JSON.decode(response.responseText);
            response.responseText  =  Ext.util.JSON.encode(js.records ? js.records : js);
            Ext.tree.TreeLoader.prototype.processResponse.call(this, response, node, callback);
        }
    });

    config.autoScroll = true;
    config.rootVisible = false;
    config.autoScroll = true;
    config.id = 'text';
    config.deferredRender= false;

    TreeReader.superclass.constructor.call(this,config);

    this.on("expandnode", function(n){
        if(n.lastChild){
            n.lastChild.ensureVisible();
        }
        n.ensureVisible();
    });

    this.setRootNode(new Ext.tree.AsyncTreeNode({
        text: config.rootText,
        draggable: false,
        id: 'ROOT'
    }));

    this.selNode = function(node){
        if(node.leaf){
            this.handler(node.attributes);
        }
    };

    this.openNode = function(node){
        var n = this.getNodeById(config.openNode);
        if(n) {
            n.expand();
        }
        // odstrani udalost
        this.removeListener("load", this.openNode, this);
    };

    this.setBaseParams = function(pars, expand){
        for (var key in pars) {
            this.loader.baseParams[key] = pars[key];
        }
        this.setRootNode(new Ext.tree.AsyncTreeNode({
            text: config.rootText,
            draggable: false,
            id: 'ROOT'
        }));
        if(expand) {
            this.getRootNode().expand();
        }
    };


    if(config.openNode){
        this.on("load", this.openNode, this);
    }
    this.on('click', this.selNode, this);

};

Ext.extend(TreeReader, Ext.tree.TreePanel, {});
