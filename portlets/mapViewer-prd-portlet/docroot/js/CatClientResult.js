/**
 * Cat client result
 * @constructor
 * @param {Oject} config
 *      - url {String} catalogue url
 *      - serviceName {String} name of the service
 *      - defaultTitle {String} title
 *      - defailtPanel {Ext.Panel} detail panel object
 *      - rightPanel {Ext.Panel} with detail
 *      - project {Object} project
 */

CatClientResult = function(config){

    //this.setTemplate(config.templateUrl)

    this.url = config.url;
    this.serviceName = config.serviceName;
    this.defaultTitle = config.title;
    this.detailPanel = config.detailPanel;
    this.rightPanel = config.rightPanel;
    this.project = config.project;
    this.numResults = 0;
    this.scope = config.scope || this;
    this.configOptions = config;
    if(typeof(config.showPreview)=='undefined') {
        this.showPreview = true;
    }
    else {
        this.showPreview = config.showPreview;
    }

    /**
     * Renders record
     * @function
     * @param {String} value
     * @param {Object} p
     * @params {Object} record
     * @returns {String} reneered record
     */
    this.recordRenderer = config.recordRenderer || function(value, p, record){
            var s = '<span class="rec-title cat-'+record.data.trida.toLowerCase()+'">'+value+"</span>";
            if (record.data.link.toUpperCase().indexOf('WMS')>0) {
                s += "<a class='mapa' href='#' onclick=\"return app.showMap('"+record.data.id+"','"+record.data.link+"','wms');\">map</a>";
            }
            else if(record.data.link.toUpperCase().indexOf('WFS')>0) {
                s += "<a class='mapa' href=\"javascript:app.showMap('"+record.data.id+"','"+record.data.link+"','wfs');\">map</a>";
            }
            else if(record.data.format.toUpperCase().indexOf('MAPMAN')>0) {
                s += "<a class='run' href='"+record.data.link+"' target='_blank'>map</a>";
            }
            //else if(record.data.link!='') s += " <a class='run' href='"+record.data.link+"' target='_blank'>"+HS.i18n("open")+"</a>";
            return s;
    };

    //uložiště metadat
    this.catStore = new Ext.data.JsonStore({
            url: config.url,
            //proxy: this.proxy,
            baseParams: {
                    project:this.project,
                    serviceName:this.serviceName,
                    format:'json',
                    standard:config.standard,
                    query:'',
                    lang: HS.getLang(),
                    session:'save',
                    sortBy:'',limit: 25,
                    detail: (config.standard=="DC") ? 'full' : 'summary'
            },
            autoLoad: false,
            root: 'records',
            totalProperty: 'matched',
            id:'id',
            fields:['id', 'title', 'abstract', 'trida', 'link', 'format', 'imgURL','bbox']
    });

    var catView = Ext.extend(Ext.grid.GridView, {
            forceFit: true,
            enableRowBody: true,
            showPreview: this.showPreview,
            CLASS_NAME:"catView",
            getRowClass : function(record, rowIndex, p, store){
                if(this.showPreview){
                        if(config.bodyRenderer) p.body = config.bodyRenderer(record, rowIndex, p, store);
                        else p.body = '<div style="margin:3px; color:gray">'+record.data.mdAbstract.substring(0,255)+' ...</div>';
                        return 'x-grid3-row-expanded';
                }
                return 'x-grid3-row-collapsed';
            },
            addRowClass : function(row, cls){
                this.constructor.superclass.addRowClass.call(this, row, cls);
                if(cls == 'x-grid3-row-over'){
                    this.fireEvent('mousein', row);
                }
            },
            removeRowClass : function(row, cls){
                this.constructor.superclass.removeRowClass.call(this, row, cls);
                if(cls == 'x-grid3-row-over'){
                    this.fireEvent('mouseout', row);
                }
            },
            initComponent: function() {
                this.addEvents("mousein");
                this.addEvents("mouseout");
                this.constructor.superclass.initComponent.call(this);
            }
    });

    // --- seznam nalezenych
    this.recordList = new Ext.grid.GridPanel({
        itemSelector: 'div.thumb-wrap',
        multiSelect: false,
        region: 'center',
        layout: 'fit',
        title: this.defaultTitle,
        iconCls: 'loading-space',
        store: this.catStore,
        hideHeaders: true,
        closable: true,
        columns: [
            {
                id:'title',
                width: 150,
                sortable: false,
                dataIndex: 'title',
                renderer: this.recordRenderer
            }
        ],
        loadMask: true,
        autoExpandColumn: 'title',
        view: new catView({
            listeners: {
                "mousein": config.onMouseOver || function(){},
                "mouseout": config.onMouseOut || function(){},
                "scope": this.scope
            }
        }),
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {'rowselect': config.onRowSelect || this.showDetail, scope: this}
        }),
        bbar: new Ext.PagingToolbar({
            pageSize: 25,
            store: this.catStore,
            paramNames: {start:'start'},
            displayInfo: true,
            displayMsg: '{0} - {1} / {2}',
            emptyMsg: HS.i18n("Not found"),
            items:[{
                pressed: this.showPreview,
                enableToggle:true,
                text: this.showPreview ? HS.i18n("No details") : HS.i18n("Detailed"),
                icon: 'style/img/document-extended.gif',
                cls: 'x-btn-text-icon details',
                scope: this,
                toggleHandler: function(btn, pressed){
                    this.getView().showPreview = pressed;
                    var text = (pressed ? HS.i18n("No details") : HS.i18n("Detailed"));
                    btn.setText(text);
                    this.getView().refresh();
                }
            }]
        })
    });

    CatClientResult.superclass.constructor.call(this,this.recordList);
};

Ext.extend(CatClientResult, Ext.grid.GridPanel, {

        /**
         * search in catalogue service
         * @function
         * @param {String} query
         * @param {Object} params
         */
    search : function(query, params){
        this.unselect();
        this.catStore.baseParams.query = query;
        if(params){
            this.catStore.baseParams.sortBy = params.sortBy;
        }
        this.catStore.load({params:{'start':0}});
        this.setTitle(this.defaultTitle, 'loading-icon');
        this.catStore.on({
            'load':{
                fn: function(store, records, options){
                    this.numResults = store.getTotalCount();
                    this.setTitle(this.defaultTitle+' ('+store.getTotalCount()+')','loading-space');
                },
                scope: this
            },
            'loadexception':{
                fn: function(store, records, options){
                    this.setTitle(this.defaultTitle, 'loading-error');
                },
                scope: this
            }
        });

    },

        /**
         * Unselect record from list of records
         * @function
         */
    unselect : function(){
        this.recordList.getSelectionModel().clearSelections(true);
    },

        /**
         * Display detail (GetRecordById)
         * @function
         * @param {Ext.SelectionModel} sm
         * @param {Integer} idx
         * @param {} r
         */
    showDetail : function(sm, idx, r){
            this.rightPanel.showDetail();
            this.detailPanel.showDetail({
                    id: r.id,
                    serviceName: this.serviceName,
                    url: this.url
            });
    },

        /**
         * Display detail qith query (GetRecords)
         * @function
         * @param {String} q query
         */
    showDetailByQuery : function(q){
            this.rightPanel.showDetail();
            this.detailPanel.showDetail({
                    query: q,
                    serviceName: this.serviceName,
                    url: this.url
            });
    },


        /**
         * set parameters to catStore
         * @function
         * @param {Object} params
         */
    setParams: function(params) {
            for (var param in params) {
                this.catStore.baseParams[param] = params[param];
            }
    },

        /**
         * Render record
         * @function
         * @param {String} value
         * @returns {String} reneered record
         */
    recordRendererTemplate : function(value, p, record) {
                var config = {};

                // create configuration object for the template
                config.class_value = value;
                config.class_name = record.data.trida.toLowerCase();
                config.other_link = config.wms = config.wfs = config.mapman = config.link = false;

        if(record.data.link.toUpperCase().indexOf('WMS')>0) {
                    config.link = record.data.link;
                    config.wms = true;
                }
        else if(record.data.link.toUpperCase().indexOf('WFS')>0) {
                    config.link = record.data.link;
                    config.wfs = true;
                }
        else if(record.data.format.toUpperCase().indexOf('MAPMAN')>0) {
                    config.link = record.data.link;
                    config.mapman = true;
                }
        else if(record.data.link!=='') {
                    config.open = HS.i18n("open");
                    config.link = record.data.link;
                    config.other_link = true;
                }

        return CatClientResult.RecordTemplate.apply(config);
    },

        /**
         * Remove all found records
         * @function
         */
    reset : function(){
        this.catStore.removeAll();
        this.detailPanel.body.update();
    },

        /**
         * Set template. If no URL is given, default is taken
         *
         * @param {String} url url of the template
         */
        setTemplate: function(url) {
            if (url) {
                CatClientResult.readTemplate(url);
            }

            else {
                CatClientResult.RecordTemplate = new Ext.XTemplate(
                            '<span class="rec-title cat-{class_name}">{class_value}</span>'+
                            '<tpl if="link">'+
                            '    <tpl if="wms">'+
                            '        <a class="mapa" href="javascript:app.showMap(\"wms\",\"{link}\");">map</a>'+
                            '    </tpl>'+
                            '    <tpl if="wfs">'+
                            '        <a class="mapa" href="javascript:app.showMap(\"wfs\",\"{link}\");">map</a>'+
                            '    </tpl>'+
                            '    <tpl if="mapman">'+
                            '        <a class="run" href="{link}" target="_blank">map</a>'+
                            '    </tpl>'+
                            '    <tpl if="other_link">'+
                            '    <a class="run" href="{link}" target="_blank">{open}</a>'+
                            '    </tpl>'+
                            '</tpl>'
                        );
                CatClientResult.RecordTemplate.compile();
            }
        },

        CLASS_NAME: "CatClientResult"

});

CatClientResult.RecordTemplate = undefined;

CatClientResult.readTemplate = function(url) {

    Ext.Ajax.request({
                url : url,
                method: 'GET',
                params :{name:name},
                success: function ( result, request ) {
                    CatClientResult.setTemplate(result.responseText);
            },
                failure: function ( result, request ) {
            }
    });

};

CatClientResult.setTemplate = function(template) {
    CatClientResult.RecordTemplate = new Ext.XTemplate(template);
    CatClientResult.RecordTemplate.compile();
};
