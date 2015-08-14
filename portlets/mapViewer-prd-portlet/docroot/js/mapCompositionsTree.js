// --- konfigurace ----
var catURL = "/php/catalogue/libs/cswclient/cswClientRun.php";
var serviceName = 'default';
var wmcPath = "/php/wmc";
/******************************************************************************/
var args = OpenLayers.Util.getParameters();

var treeCompositionBrowser = {
  catClientURL: catURL,
  serviceName: serviceName,
  openNode: args.openNode,
  keywordList: args.keywordList
};

var compositionBrowser = {
  catClientURL: catURL,
  serviceName: serviceName,
  anytext: ""
};

// query to catalogue
compositionBrowser.compositionRefresh = function(){
    if (compositionBrowser.compositionForm.getForm()) {
        var values = compositionBrowser.compositionForm.getForm().getValues();
        var q = "hierarchyLevelName=MapContext";

        q += " AND creator='"+compositionBrowser.getUser()+"'";

        if (values.anytext.length>0){
            q += " AND anytext like '*"+values.anytext+"*'";
        }

        compositionBrowser.compositionClient.search(q, {sortBy:'title'});
    }
};

/**
 * get current user  - to overwrite
 * @function
 */
compositionBrowser.getUser = function(){
    if(typeof(getLRUser)!='undefined') {
        return getLRUser();
    }
    else {
        return "";
    }
};

compositionBrowser.canSave = function(){
    if(typeof(canSaveWMC)!='undefined') {
        return canSaveWMC();
    }
    else {
        return false;
    }
};

compositionBrowser.onActivate = function(a,b){
    if(!compositionBrowser.activated){
        compositionBrowser.activated = true;
        compositionBrowser.compositionRefresh();
    }
};

treeCompositionBrowser.setQuery = function(a,b){
    var sortValue = "cenia";
    if(b.inputValue=="inspire") {
        sortValue = "inspireKeywords";
    }
    var q = "HierarchyLevelName=MapContext";
    if(sortValue!==''){
        q += " AND subject=";
    }
    treeCompositionBrowser.strom.setBaseParams({'query': q, 'treeBase': sortValue}, true);
};

/**
 * Init catalogue client composition
 * @function
 */
var initCatClientCompositon = function() {

    // ******** TABULKA ******
    var bodyRenderer = function(record, rowIndex, p, store){
        var s = record.data.mdAbstract;
        s = '<div style="padding: 3px; color:#909050; padding-left:60px; background: url('+record.data.imgURL+') 5px 0px no-repeat"><div style="height:50px;float:right;width:1px;"></div>' + s + '<div style="clear:both;height:1px;overflow:hidden;"></div></div>';
        return s;
    };

    //--- INSPIRE themes store ---
      var xmlRecordDef = Ext.data.Record.create([
      {name: 'name', mapping: '@name'},
      {name: 'label', mapping: '/'}
      ]);

   var themesReader = new Ext.data.XmlReader({
     record: "specifications/value"
       }, xmlRecordDef);

   var themesStore = new Ext.data.Store({
      url: wmcPath + '/xsl/codelists_' + HS.getLang() + '.xml',
      reader: themesReader,
      autoload: true
   });

    compositionBrowser.compositionForm = new Ext.FormPanel({
        layout:'form',
        region: 'north',
        frame: true,
        height: 75,
        items:[
            {
                xtype:'panel',
                height: 30,
                html: HS.i18n('PortalUsersCompositions')
            },
            {
                xtype: 'textfield',
                anchor:'95%',
                name: 'anytext',
                triggerAction: 'all',
                enableKeyEvents: true,
                validator: function(){
                    var s = this.getValue();
                    if (compositionBrowser.anytext == s) {
                        return true;
                    }
                    else if (s.length===0 || s.length > 2) {
                        compositionBrowser.anytext = s;
                        compositionBrowser.compositionRefresh();
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                fieldLabel: HS.i18n('Filter')
            }
        ]
    });

    var url = compositionBrowser.catClientURL;
    if (url.search("http://") === 0 && OpenLayers.ProxyHost) {
        url = OpenLayers.ProxyHost+escape(url);
    }

    compositionBrowser.compositionClient = new CatClientResult({
        title: OpenLayers.i18n("Map compositions"),
        serviceName: compositionBrowser.serviceName,
        url: url,
        forceLayout:true,
        showPreview: false,
        onRowSelect: function(a,b,r) {
            showComposition(r.data);
        },
        bodyRenderer: bodyRenderer
      });

    var compositionPanel = new Ext.Panel({
        title: HS.i18n("Mine"),
        forceLayout: (compositionBrowser.getUser()!==''),
        disabled: (!compositionBrowser.canSave()),
        region: 'center',
        layout: 'border',
        id: 'compositionPanel',
        items: [
            compositionBrowser.compositionForm,
            compositionBrowser.compositionClient
        ],
        listeners: {'activate': compositionBrowser.onActivate}
    });


    // *********** STROM *********************
    var url = treeCompositionBrowser.catClientURL;
    if(OpenLayers.ProxyHost && (url.indexOf("http") === 0)) {
        if(typeof OpenLayers.ProxyHost == "function") {
            url = OpenLayers.ProxyHost(url);
        } else {
            url = OpenLayers.ProxyHost + encodeURIComponent(url);
        }
    }

    var treeBase;
    if(treeCompositionBrowser.keywordList && treeCompositionBrowser.keywordList.toLowerCase()=='inspire'){
        treeBase = "inspireKeywords";
    }
    else {
        treeBase = 'cenia';
    }


    treeCompositionBrowser.strom = new TreeReader({
        autoScroll: true,
        forceLayout: true,
        lang: HS.getLang(), //TODO nastaveni jazyka
        region: 'center',
        layout: 'fit',
        handler: showComposition,
        treeBase: treeBase,
        openNode: treeCompositionBrowser.openNode,
        serviceName: treeCompositionBrowser.serviceName,
        serviceURL: url
    });

    treeCompositionBrowser.theme = new Ext.form.RadioGroup({
        listeners: {'change': treeCompositionBrowser.setQuery},
        items: [
            {boxLabel: HS.i18n('Basic'), name: 'theme', inputValue: 'cenia', checked: (treeBase=='cenia')},
            {boxLabel: 'INSPIRE', name: 'theme', inputValue: 'inspire', checked: (treeBase=='inspireKeywords')}
        ],
        height: 20
    });

    var ctPanelItems = [
            {
                xtype: 'panel',
                layout: 'border',
                title: HS.i18n('Public'),
                items:[{
                    region: 'north',
                    layout: 'form',
                    forceLayout: true,
                    frame: true,
                    labelWidth: 1,
                    active: true,
                    height: 70,
                    items:[
                        {xtype:'panel', height: 40, html: HS.i18n('PortalAdminCompositions')},
                        treeCompositionBrowser.theme
                    ]},
                    treeCompositionBrowser.strom
                ]
            }
        ];
    if (window.getLRUser && window.getLRUser() != "guest") {
            ctPanelItems.push(compositionPanel);
    }

    var ctPanel = new Ext.TabPanel({
        activeTab: 0,
        forceLayout: true,
        deferredRender: false,
        items: ctPanelItems
    });
    var layoutPanel = new Ext.Panel({
        title: OpenLayers.i18n('Maps'),
        layout: "fit",
        id:"composition_layout_panel",
        forceLayout: true,
        items: [
            ctPanel
        ],
        listeners: {
            'activate':function() {
            },
            scope: this
        }
    });

    geoportal.toolsPanel.insert(2, layoutPanel);
    treeCompositionBrowser.setQuery(null,{inputValue:args.keywordList});
    return;
  };


// request for stored WMC
var showComposition = function(r){
    geoportal.openWMCFromURL(r.link);
};

HS.Lang.cze['Author'] = 'Autor';
HS.Lang.cze['Official'] = 'Oficiální';
HS.Lang.cze['Mine'] = 'Moje';
HS.Lang.cze['Sort by'] = 'Třídit podle';
HS.Lang.cze['ISO Topics'] = 'Kategorie ISO';
HS.Lang.cze['Basic'] = 'Základní';
HS.Lang.cze['Maps'] = 'Mapy';

HS.Lang.cze['Public']='Veřejné';
HS.Lang.cze['Mine']='Moje';
HS.Lang.cze['Filter']='Filtr';
HS.Lang.cze['Show my maps only']='Ukázat pouze moje mapy';
HS.Lang.cze['INSPIRE theme']='Téma INSPIRE';
HS.Lang.cze['Mine']='Moje';
HS.Lang.cze['All']='Vše';
HS.Lang.cze['Official']='Výchozí';
HS.Lang.cze['PortalAdminCompositions']= "Tyto mapy byly vytvořeny ověřenými poskytovateli dat a správcem geoportálu.";
HS.Lang.eng['PortalAdminCompositions']="These maps were created by the geoportal administrator from the provider's data that has been verified.";
HS.Lang.cze['PortalUsersCompositions']='Tyto mapy vytvořil přihlášený uživatel. <a href="/web/guest/help-maps#IkonyKompozice">Jak mapy vytvořit?</a>';
HS.Lang.eng['PortalUsersCompositions']='These maps were created by geoportal users. <a href="/web/guest/help-maps#IkonyKompozice">How to create a map?</a>';
