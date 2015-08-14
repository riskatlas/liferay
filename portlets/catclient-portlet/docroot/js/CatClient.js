/**
 * Object for searching
 * @constructor
 */
CatalogueClient = function(config){

    this.configOptions = config;

    this.rightPanel = config.rightPanel;
    this.sf = this.configOptions.searchForm;

    /**
     * Add tab with new catalogue service
     * @function
     * @param {Object} cfg configuration of new tab
     */
    this.addService = function(cfg){
                // finalize configuration
        cfg.detailPanel = this.configOptions.detailPanel;
        cfg.rightPanel = this.configOptions.rightPanel;
        cfg.url = this.configOptions.url;
        cfg.standard = this.configOptions.standard;
        cfg.onMouseOver = this.onMouseOverRow;
        cfg.onMouseOut = this.onMouseOutRow;
        cfg.project = this.configOptions.project;
        cfg.catClientPath = this.configOptions.catClientPath;
        cfg.recordRenderer = this.configOptions.recordRenderer;
        cfg.bodyRenderer = this.configOptions.bodyRenderer;
        cfg.scope = this;

                // create new tab
        var tab = new CatClientResult(cfg);
        if (cfg.tab == "true") {
            tab.closable = false;
        }
                // insert new tab
        this.resultContainer.insert(this.resultContainer.items.length-1,tab);
        this.resultContainer.doLayout();
        tab.setVisible(cfg.visible);
                tab.on('activate',this.addBBoxes, this);
                tab.catStore.on('load',function() {
                        if (this.tab ==this.resultContainer.getActiveTab()){
                            this.addBBoxes.apply(this.scope,[this.tab])
                        }
                    },
                    {
                        scope:this,
                        addBBoxes:this.addBBoxes,
                        tab:tab,
                        resultContainer:this.resultContainer
                    });
    };

    /**
     * Add new tab with services
     * @function
     * @param [{Object}] services  array with service configuration
     */
    this.addServices = function(services){

            for(var i=0;i<services.length;i++) {
                this.addService(services[i]);
            }
    };

    /**
     * get list of tabs with services
     * @function
     * @returns [{Ext.TabPanel}]
     */
    this.getServices = function(){
        var serviceTabs = Array();
        var tabs = this.resultContainer.items.items;
        for(i=0;i<tabs.length;i++){
            if(tabs[i].serviceName) {
                if(tabs[i].numResults){
                    serviceTabs.push({
                        'serviceName': tabs[i].serviceName,
                        'title': tabs[i].initialConfig.title,
                        'visible': tabs[i].isVisible(),
                        'numResults':tabs[i].numResults,
                        'tab':tabs[i].tab
                    })
                } else {
                    serviceTabs.push({
                        'serviceName': tabs[i].serviceName,
                        'title': tabs[i].initialConfig.title,
                        'visible': tabs[i].isVisible(),
                        'numResults': 0,
                        'tab':tabs[i].tab
                    })
                }
            }
        }
        return serviceTabs;
    };

    /**
     * Search something
     * @function
     * @param {String} query
     * @param {Object} parmas
     */
    this.search = function(query, params){
        var activate = params.activate;
        for (i=0;i<this.resultContainer.items.items.length;i++) {
            if (this.resultContainer.items.items[i].catStore) {
                if ((activate==true)&&(!this.resultContainer.getActiveTab().catStore)) {
                    this.resultContainer.activate(i);
                    activate=false;
                }
                itemResult = this.resultContainer.items.items[i];
                if (itemResult.catStore.baseParams.session == 'load') {
                    if (itemResult.numResults > 0) {
                        itemResult.search(query,params)
                    } else {
                        itemResult.setTitle(itemResult.defaultTitle+' (0)','cat-imgsprite loading-space');
                    }
                } else {
                    itemResult.search(query,params)
                }
            }
        }
    };

    /**
     * set session cookie
     * @function
     * @param {Object} operation
     */
    this.setSession = function(operation){
        for (i=0;i<this.resultContainer.items.items.length;i++){
            if (this.resultContainer.items.items[i].setParams){
                    this.resultContainer.items.items[i].setParams({'session': operation})
            }
        }
    };


        // nastavit hodnotu bboxu, kdyz se zmeni v mape
        this.rightPanel.on("bboxset",function(bbox){
            this.sf.boundingBoxField.setValue(bbox);
            this.resultContainer.activate(0);
        },this);

        this.sf.on("formcleared",function(form) {
            this.rightPanel.boxes.clearMarkers();
            var vectors = this.rightPanel.vectors;
            if(vectors) vectors.destroyFeatures();
            this.rightPanel.extentContainer.update("");
            for (i=0;i<this.resultContainer.items.items.length;i++) {
                if (this.resultContainer.items.items[i].catStore) {
                    this.resultContainer.items.items[i].clear();
                }
            }
        }, this);


        /* Pro více formulářů
         *
         app.formTabs = new Ext.TabPanel({
            activeTab: 0,
            items: [app.sf,
                    app.sf1
                    ]
        });*/

        var formTabs = this.sf; //TODO do config

    // definice tabpanelu, ktery obsahuje jednotlive klienty
    this.resultContainer = new Ext.TabPanel({
        id: 'this.resultContainer',
        region: (this.configOptions.catclientWidth ? 'west' : 'center'),
        enableTabScroll:true,
        width: (this.configOptions.catclientWidth ? this.configOptions.catclientWidth : 'auto'),
        split: true,
        minSize: 520,
        defaults:{
            autoScroll:true,
            width: 300
        },
        activeTab: 'home',
        items:[{
            //el: 'start-text',
            title: '<font style="color: white">.</font>',
            layout: 'fit',
            id: 'home',
            iconCls: 'cat-imgsprite cat-home',
            border: false,
            frame:false,
            items: formTabs,
        },
        new CSWAddForm(this,this.configOptions)
        ],
        listeners: {
            'tabchange': function(panel, tab){
                tab.doLayout();
            }
        }
    });

    /**
     * Highlight row on mouse over
     *
     * @param rownr {Integer}
     */
    this.onMouseOverRow = function(rownr) {
        var tab  = this.resultContainer.getActiveTab();
        var record = tab.catStore.getAt(rownr);
        var selectFeature = this.rightPanel.selectFeature;
        selectFeature.unselectAll();
        selectFeature.select(record.data.feature);
    };

    /**
     * Cancel highlight when the mouse is out of row
     *
     * @param rownr {Integer}
     */
    this.onMouseOutRow = function(rownr) {
        var selectFeature = this.rightPanel.selectFeature;
        selectFeature.unselectAll();
    };

    /**
     * pri aktivaci prekresli grid a prida bboxy do mapy
     */
    this.addBBoxes = function(tab) {
        var vectors = this.rightPanel.vectors;
        if(vectors) vectors.destroyFeatures();
        if(tab.catStore){
            tab.unselect();
            tab.getView().refresh();
            vectors.events.un({"featureselected":this.onFeatureSelect,"featureunselected":this.onFeatureUnSelect,scope:this});
            vectors.events.on({"featureselected":this.onFeatureSelect,"featureunselected":this.onFeatureUnSelect,scope:this});
            this.rightPanel.mapClickScope = this;
            this.rightPanel.onMapClicked = this.onMapClicked;
            tab.catStore.each(function(record) {
                var linearRing = new OpenLayers.Geometry.LinearRing();
                var coords = record.data.bbox.split(" ");
                linearRing.addPoint(new OpenLayers.Geometry.Point(parseFloat(coords[0]),parseFloat(coords[1])));
                linearRing.addPoint(new OpenLayers.Geometry.Point(parseFloat(coords[0]),parseFloat(coords[3])));
                linearRing.addPoint(new OpenLayers.Geometry.Point(parseFloat(coords[2]),parseFloat(coords[3])));
                linearRing.addPoint(new OpenLayers.Geometry.Point(parseFloat(coords[2]),parseFloat(coords[1])));
                linearRing.addPoint(new OpenLayers.Geometry.Point(parseFloat(coords[0]),parseFloat(coords[1])));
                var linearRingMap = linearRing.transform(new OpenLayers.Projection("epsg:4326"), vectors.map.projection);
                var feature = new OpenLayers.Feature.Vector(linearRingMap,{record:record});
                this.layer.addFeatures([feature]);
                record.data.feature = feature;
            },{layer:vectors});
        }
    };


    /**
     * handle feature select event
     */
    this.onFeatureSelect = function(evt) {
        var record = evt.feature.data.record;
        var tab = this.resultContainer.getActiveTab();
        if(tab.catStore){
            var view = tab.getView();
            var idx =tab.catStore.indexOf(record);
            view.constructor.superclass.addRowClass.call(view, idx, "x-grid3-row-over");
            view.syncFocusEl(view.ensureVisible(idx, 0, false));
        }
    };

    /**
     * handle feature unselect event
     */
    this.onFeatureUnSelect = function(evt) {
        var record = evt.feature.data.record;
        var tab = this.resultContainer.getActiveTab();
        if(tab.catStore){
            var view = tab.getView();
            var idx =tab.catStore.indexOf(record);
            view.constructor.superclass.removeRowClass.call(view, idx, "x-grid3-row-over");
        }
    };

    /**
     * click in the map handler
     */
    this.onMapClicked =  function(evt) {
    };

    this.CLASS_NAME = "CatalogueClient";
  //CatalogueClient.superclass.constructor.call(this.configOptions);
};

//Ext.extend(CatalogueClient, Ext.TabPanel, {});
