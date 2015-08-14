window.addEventListener ? window.addEventListener('load', init, false) : window.attachEvent('onload', init);

/*******************************************************************************
 * Catalogue client for CSW 2.0.2
 * version 2.0.2
 * HSRS 2012
 ******************************************************************************/

// ---------------------------------------------------------------------------------
app.showMap = function(id, url, type) {
    if (type && type == 'wmc') {
        window.location = app.mapViewerPath + "?id=" + id + "&wmc=" + escape(url);
    } else if (type && type == 'wms') {
        window.location = app.mapViewerPath + "?id=" + id + "&wms=" + escape(url);
    } else if (type && type == 'wfs') {
        window.location = app.mapViewerPath + "?id=" + id + "&wfs=" + escape(url);
    } else if (type && type == 'wcs') {
        window.location = app.mapViewerPath + "?id=" + id + "&wcs=" + escape(url);
    } else if (type && type == 'kml') {
        window.location = app.mapViewerPath + "?id=" + id + "&kml=" + escape(url);
    } else {
        window.location = app.mapViewerPath + "?id=" + id + "&ows=" + escape(url);
    }
};

/*******************************************************************************
 * Pro Vlka ...
 ******************************************************************************/
app.showMapWithMapman = function(mapmanProjectUrl) {
    var params = {};
    var a1 = mapmanProjectUrl.split("?");
    if (a1.length == 2) {
        var a2 = a1[1].split("&");
        for ( var i = 0; i < a2.length; i++) {
            var a3 = a2[i].split("=");
            params[a3[0].toLowerCase()] = a3[1];
        }
    }

    var url = a1[0] + "?class=Mapman.Api.MapmanGetMapParams&instance=" + params["instance"] + "&mapProject=" + params["mapproject"];
    if (app.proxy) {
        url = app.proxy + escape(url);
    }

    Ext.Ajax.request({
        url : url,
        success : function(response, opts) {
            var mapUrl = app.mapViewerPath + "?cgimapserver=" + escape(response.responseText);
            window.location = mapUrl;
        }
    });
};

// zobrazeni pripojenych DS - TODO - do detailPanel
app.showLinkedDS = function(service, id) {
    var pom = id.split('#');
    var id1 = pom[pom.length - 1];
    app.config.detailPanel.showDetail.call(app.config.detailPanel, {
        serviceName : service,
        q : "ResourceIdentifier='" + id1 + "'"
    });
};

// zobrazeni pripojenych DS - TODO - do detailPanel
app.showCoupledResource = function(service, href) {
    var pom = href.split('#');
    var id1 = pom[pom.length - 1];
    id1 = id1.substr('1');
    // app.config.detailPanel.showDetail.call(app.config.detailPanel,{serviceName:
    // service, q:"identifier='"+id1+"'"});
    app.config.detailPanel.showDetail.call(app.config.detailPanel, {
        serviceName : service,
        metadataURL : href
    });
};

// zobrazeni pripojenych DS - asi upravit
/*
 * app.showLinkedSrv = function(service, id){
 * app.config.detailPanel.showDetail({serviceName:service,
 * q:"OperatesOnIdentifier='"+id+"'"}); }
 */

/*******************************************************************************
 * Ulozeni dat do session cache
 ******************************************************************************/
app.saveStatus = function() {
    var data = {};
    if (app.sf)
        data = app.sf.getValues();
    if (document.simpleForm) {
        data.anytext = document.simpleForm.anytext.value;
        // data.mapCenter=app.mapCenter;
        // data.mapZoom=app.mapZoom;
        if (document.simpleForm.type) {
            data.type = document.simpleForm.type.value;
            if (document.simpleForm.menuId) {
                activatedMenu = Ext.select('#search-form .active').elements[0];
                if (activatedMenu.id != document.simpleForm.menuId.value) {
                    document.simpleForm.menuId.value = activatedMenu.id;
                };
                data.menuId = document.simpleForm.menuId.value;
            }
        }
    }
    if (app.config.rightPanel && app.config.rightPanel.map) {
        data.mapCenter = app.config.rightPanel.map.mapCenter;
    }
    data.tabs = app.catClient.getServices();
    app.statusReader.save(data);
}

/*******************************************************************************
 * Po nacteni dat ze session cache
 ******************************************************************************/
app.readStatus = function(data) {
    // --- vytvoreni zalozek
    if ((data) && (data.tabs) && (data.tabs.length)) {
        app.catClient.addServices(data.tabs);
        app.catClient.resultContainer.activate('home');
        app.readStatus.process(data);
    }

    // --- precteni konfiguraku sluzeb
    else {
        Ext.Ajax.request({
            url : app.config.url,
            params : {
                request : 'getservices',
                tab : 'true'
            },
            success : function(response, opts) {
                app.catClient.addServices(Ext.util.JSON
                        .decode(response.responseText).services);
            },
            callback : function() {
                app.catClient.resultContainer.doLayout();
                app.readStatus.process();
            }
        })
    }
}

// --- tato funkce byla vytvorena kvuli asynchronite Ext.Ajax.request
app.readStatus.process = function(data) {
    // nacteni parametru z URL
    var url = window.location.search.substr(1).split("&");
    var httpGetVars = {};
    if (url[0])
        for (i = 0; i < url.length; i++) {
            var pair = url[i].split("=");
            httpGetVars[pair[0]] = decodeURIComponent(pair[1]);
        }

    delete httpGetVars.lang;
    var i = 0;
    for ( var o in httpGetVars)
        i++;

    if (i > 0) {
        // --- pokud jsou v URL nějaké parametry, spustí se vyhledávání přes ně
        if (app.sf) {
            app.sf.setValues(httpGetVars);
            app.sf.search(true);
        }
        /*
         * if((httpGetVars['anytext']!=undefined)&&(httpGetVars['type']!=undefined)&&(httpGetVars['menuId']!=undefined)){
         * SetTypeValue(httpGetVars['type'],httpGetVars['menuId']);
         * app.search({anytext:httpGetVars['anytext'], hlevel:
         * httpGetVars['type']}); return; }
         */
        // TODO - hodnota prisla z formulare , predelat
        else if (document.simpleForm) {
            app.simpleSearch();
        }
        return;
    }

    // --- Delete tabs which had zero results

    // --- pokud ne, propadne do vyhledavani podle cachovanych promennych
    var toSearch = false;
    if (document.simpleForm) {
        if (data) {
            if (data.type && data.menuId) {
                SetTypeValue(data.type, data.menuId);
            }
        }
    }

    for (d in data) {
        if ((d.substring(0, 3) != 'map') && (d != 'tabs') && (data[d])) {
            toSearch = true;
            break;
        }
    }

    if (toSearch) {
        app.catClient.setSession('load');

        for (i = 0; i < data.tabs.length; i++) {
            app.catClient.resultContainer.items.items[i + 1].numResults = data.tabs[i].numResults;
        }

        // --- nastaveni obsahu rozsireneho formulare
        if (app.sf) {
            app.sf.setValues(data);
        }

        // --- nastaveni obsahu simpleForm
        if (document.simpleForm) {
            document.simpleForm.anytext.value = data.anytext;
            if ((document.simpleForm.type) && (document.simpleForm.menuId)) {
                SetTypeValue(data.type, data.menuId);
            }
        }

        // spusteni vyhledani
        app.search(data);

    }
    // jen nastavi formular
    else if (app.sf) {
        app.sf.onChangeResource();
    }

    app.catClient.setSession('save');
};

// --- jednoduche vyhledavani
app.simpleSearch = function() {
    if (document.simpleForm.type) {
        var type = document.simpleForm.type.value;
    }
    app.search({
        anytext : document.simpleForm.anytext.value,
        ttype : 'AnyText',
        hlevel : type
    }, {
        activate : true
    });
    return false;
}

app.search = function(formValues, params) {
    // formValues.bbox = app.config.rightPanel.getSearchExtent();
    var qstr = app.searchParser.parse(formValues);
    if (params) {
        if (params.sortBy)
            var sortBy = params.sortBy;
        else
            var sortBy = '';
        if (params.activate)
            var activate = params.activate;
        else
            var activate = false;
    }
    app.catClient.search(qstr, {
        sortBy : sortBy,
        activate : activate
    });
    app.catClient.setSession('save');
}

function init() {
    // lang:
    HS.automaticLang = false;
    if (typeof(getLRlang) == 'function') {
        HS.setLang(getLRlang());
    } else {
        HS.setLang(HS.getLastLangCode());
    }

    // --- prace se statusem
    app.statusReader = new HSStatusReader({
        url : app.statusManagerPath,
        project : app.config.project,
        handler : app.readStatus
    });

    // --- vyhledavani
    app.searchParser = new MdExtFormParser();

    // --- rozsirene hledani ---
    app.sf = new AdvancedSearch.SearchForm({
        border : false,
        cfg : app.config,
        collapsible : false,
        frame : true,
        handler : app.search,
        layout : 'fit',
        // autoScroll:true,
        serviceName : app.serviceName,
        title : HS.i18n('Search')
    // +' - INSPIRE'
    });
    app.sf.on("afterRender", app.statusReader.load, app.statusReader, {
        delay : 750
    });

    /*
     * app.sf1 = new AdvancedSearch.SearchForm({ border: false, cfg: app.config,
     * collapsible: false, frame: true, handler: app.search, layout: 'form',
     * serviceName: app.serviceName, title: HS.i18n('Search')+' - Basic' });
     */

    // window.onunload = app.saveStatus;

    if (document.simpleForm) {
        document.simpleForm.onsubmit = app.simpleSearch;
    }

    // --- definovani ramcu aplikace
    app.config.url = app.config.catClientPath
            + '/libs/cswclient/cswClientRun.php';
    app.config.searchForm = app.sf;
    app.config.detailPanel = new CatClientDetail({
        stylePath : app.config.stylePath,
        catClientPath : app.config.catClientPath,
        wms : WMSURL,
        wmsMapHandler : app.showMap,
        standard : app.config.standard
    });
    app.config.rightPanel = new RightPanel(app.config);
    app.catClient = new CatalogueClient(app.config);
    app.catClient.resultContainer.doLayout();

    var windowWidth = document.body.parentNode.clientWidth - 1;
    var windowHeight = document.body.parentNode.clientHeight;
    var headerHeight = 0;
    var westWidth = 0;

    var northDIV = app.config.northDIV;

    for (idiv = 0; idiv < northDIV.length; idiv++) {
        if (Ext.select(northDIV[idiv]).getCount() > 0) {
            headerHeight += Ext.select(northDIV[idiv]).elements[0].clientHeight
        }
    } 
    var westDIV = app.config.westDIV;

    for (idiv = 0; idiv < westDIV.length; idiv++) {
        if (Ext.select(westDIV[idiv]).getCount() > 0) {
            westWidth += Ext.select(westDIV[idiv]).elements[0].clientWidth
        }
    } 

    var catClientHeight = windowHeight - headerHeight - 2;
    windowWidth -= westWidth;

    // --- jednoduche hledani ---
    app.viewport = new Ext.Panel({
        layout : 'border',
        renderTo : 'portalCatClient',
        width : windowWidth,
        height : catClientHeight,
        items : [ app.catClient.resultContainer, app.config.rightPanel ]
    });

    Ext.EventManager.onWindowResize( function() {
        var westWidth = 0;
        var windowWidth = document.body.parentNode.clientWidth;
        var westDIV = app.config.westDIV;

        for (idiv = 0; idiv < westDIV.length; idiv++) {
            if (Ext.select(westDIV[idiv]).getCount() > 0) {
                westWidth += Ext.select(westDIV[idiv]).elements[0].clientWidth
            }
        }

        windowWidth -= westWidth;
        this.setWidth(windowWidth);

        var headerHeight = 0
        var northDIV = app.config.northDIV;

        for (idiv = 0; idiv < northDIV.length; idiv++) {
            if (Ext.select(northDIV[idiv]).getCount() > 0) {
                headerHeight += Ext.select(northDIV[idiv]).elements[0].clientHeight
            }
        }


        windowWidth = arguments[0];
        windowWidth -= westWidth;
        windowHeight = arguments[1];
        this.setHeight(windowHeight - headerHeight - 1);
        this.setWidth(windowWidth);
        this.doLayout();
    }, app.viewport);

    app.config.rightPanel.addMap();

    // prohlizece
    if (window.addEventListener) {
        window.onunload = app.saveStatus;
    }

    // IE < 9
    else if (window.attachEvent) {
        window.attachEvent("onbeforeunload", app.saveStatus);
    }

    Ext.QuickTips.init();
}
