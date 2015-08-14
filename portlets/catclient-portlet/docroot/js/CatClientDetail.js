CatClientDetail = function(config){
    this.wmsurl  = config.wms;
    this.wmsMapHandler = config.wmsMapHandler;
    this.url  = config.catClientPath+'/libs/cswclient/cswClientRun.php';
    this.standard = config.standard || '';

    //pujceno z hs_dmap.js
    this.adjustRect = function(mapsize, mapext, buffer){
        var epsg=4326;
        if(buffer) var bFactor = buffer/100 + 1.0; else bFactor = 1;
        var x = (parseFloat(mapext[2]) + parseFloat(mapext[0]))/2;
        var y = (parseFloat(mapext[3]) + parseFloat(mapext[1]))/2;
        if((Math.abs(y)<90)&&(epsg==4326)) var xyRatio = Math.cos(y/180*Math.PI); else xyRatio = 1; // pouze pro WGS84
        var cellsize = Math.max(Math.abs((mapext[2]-mapext[0])/(mapsize[0]-1))*xyRatio, Math.abs((mapext[3]-mapext[1])/(mapsize[1]-1)))/2*bFactor;
        var rozsah = new Array(4);
        rozsah[0] = x - mapsize[0]*cellsize/xyRatio;
        rozsah[1] = y - mapsize[1]*cellsize;
        rozsah[2] = parseFloat(x) + mapsize[0]*cellsize/xyRatio;
        rozsah[3] = parseFloat(y) + mapsize[1]*cellsize;
        return [rozsah[0],rozsah[1],rozsah[2],rozsah[3]];
    }

    // vlozi do dokumentu odkazy na propojene sluzby pres resourceIdentifier
    this.addLinkedResources = function(response, div){
        //var div = document.getElementById(el);
        div.innerHTML = "";
        var records = Ext.util.JSON.decode(response.responseText).records;
        for(var i=0;i<records.length;i++){
            var sp = document.createElement('span');
            sp.className = "cat-imgsprite coupled cat-"+records[i].trida;
            var a = document.createElement('a');
            a.uuidref = records[i].id;
            a.scope = this;
            a.onclick = function(){
                this.scope.showDetail({serviceName: this.scope.serviceName, id: this.uuidref});
            }
            a.setAttribute('href','#');
            a.appendChild(document.createTextNode(records[i].title));
            div.appendChild(sp);
            sp.appendChild(a);
            div.appendChild(document.createElement("br"));
        }
    }

    // nahrada javascritpive fce pro IE < 9
    this.getElementsByClassName = function(tag, className){
        var tags = document.getElementsByTagName(tag);
        if(tags){
            for(var i=0; i<tags.length; i++){
                if(tags[i].className.indexOf(className)>-1) return [tags[i]];
            }
        }
        return null;
    }

   // co se děje po zobrazení detailu - zobrazení extentu - je třeba asi dát jinam
    this.detailLoaded = function(){
        // --- zobrazeni tlacitka WMS ---
        var mapToShow = null;
        if(document.getElementsByClassName){
            mapToShow = document.getElementsByClassName('map-to-show');
        }
        else {
            mapToShow = this.getElementsByClassName('A', 'map-to-show');
        }
        if(mapToShow && mapToShow.length > 0){
            this.mapToShow = mapToShow[0].href;
            this.detailPanel.getTopToolbar().items.items[1].show();
        }
        else {
            this.detailPanel.getTopToolbar().items.items[1].hide();
        }

        // --- zobrazeni mapy ---
        var west = document.getElementById('westBoundLongitude');
        if(west && this.wmsurl){
            west=west.innerHTML;
            var south = document.getElementById('southBoundLatitude').innerHTML;
            var east = document.getElementById('eastBoundLongitude').innerHTML;
            var north = document.getElementById('northBoundLatitude').innerHTML;
            this.drawBbox('extMap', [250, 180], [west,south,east,north], 5);
            }

            // --- zpracovani coupled sluzeb ---
        this.processLinked('fileIdentifier', 'coupledResources', "uuidRef");

            // --- zpracovani parent identifer ---
        this.processLinked('parentIdentifier', 'parentResource', "identifier");

            // --- zpracovani podrizenych, jejichz parent je tento zaznam ---
            this.processLinked('fileIdentifier', 'childResources', "parentIdentifier");
    }

    this.processLinked = function(idFrom, idTo, qpar){
        var theId = document.getElementById(idFrom);
        if(theId){
            var qstr = qpar+"='"+theId.innerHTML+"'";
            var did = document.getElementById(idTo);
            if(!did) return;
            did.innerHTML = "<img src='"+config.stylePath+"/img/loading.gif'/>";
            Ext.Ajax.request({
                url: this.url,
                scope: this,
                params: {serviceName: this.serviceName, format:'json', lang: HS.getLang(), standard: this.standard, query: qstr},
                success: function(r){this.addLinkedResources(r,did)},
                failure: function(r){did.innerHTML="error";}
            });
        }
    }

  // zobrazení extentu v pravém panelu
    this.drawBbox = function(id, mapsize, mapext, buffer){
    if(!mapext[0]) return false;
    var ext = this.adjustRect(mapsize,mapext,buffer);
    var wmsURL = this.wmsurl+"&REQUEST=GetMap&BBOX="+ext[0]+","+ext[1]+","+ext[2]+","+ext[3]+"&WIDTH="+mapsize[0]+"&HEIGHT="+mapsize[1];
    var d = document.getElementById(id);
    if(!d) return false;
    d.innerHTML="<img src='"+wmsURL+"' width='"+mapsize[0]+"' height='"+mapsize[1]+"'></div>";
    var jg = new jsGraphics(id);
    jg.setColor("#F00000");
    jg.setStroke(3);

    var x1 = Math.round((mapext[0]-ext[0])/(ext[2]-ext[0])*mapsize[0])-1;
    var y1 = Math.round((ext[3]-mapext[3])/(ext[3]-ext[1])*mapsize[1])-1;
    var x2 = Math.round((mapext[2]-ext[0])/(ext[2]-ext[0])*mapsize[0])-1;
    var y2 = Math.round((ext[3]-mapext[1])/(ext[3]-ext[1])*mapsize[1])-1;
    jg.drawRect(x1, y1, x2-x1, y2-y1);
    jg.paint();
    }

   // zobrazení detailu v pravé tabulce
    this.showDetail = function(params){
        this.serviceName = params.serviceName;
        // primy odkaz na metadata do CSW
        if(params.metadataURL){
            var url = this.url+'?serviceName='+this.serviceName+'&detail=full&lang='+HS.getLang()+'&template=iso2html.xsl&metadataURL='+escape(params.metadataURL);
        }
        else {
            var url = this.url+'?serviceName='+this.serviceName+'&detail=full&lang='+HS.getLang()+'&standard='+this.standard+'&template=iso2html.xsl';
            if(params.id) {
                url += '&id=' + escape(params.id);
                this.cswID = params.id;
            }
            else {
                url += '&query='+params.q;
            }
        }
        if(params.proxy) url = params.proxy+escape(url);
        this.expand();
        this.body.load({url:url, scope:this, callback: this.detailLoaded});
    }

    this.clear = function() {
        if(this.body) this.body.update('');
    }

    this.showPDF = function(e){
        //var id = document.getElementById('fileIdentifier');
        if(!id) alert('Identifier not found');
        window.open(this.url+"?serviceName="+this.serviceName+"&format=application/pdf&id="+escape(this.cswID)+"&lang="+'cze');
    }

    this.showXML = function(e){
        //var id = document.getElementById('fileIdentifier');
        if(!id) alert('Identifier not found');
        window.open(this.url+"?serviceName="+this.serviceName+"&format=application/xml&id="+escape(this.cswID)+"&lang="+'cze');
    }

    this.showMap = function(e){
        var mapType = 'ows';
        var url = this.mapToShow.toLowerCase();
        if(url.indexOf('.wmc')>0) mapType = 'wmc';
        else if(url.indexOf('=wms')>0) mapType = 'wms'; // TODO lepe identifikovat
        else if(url.indexOf('=wfs')>0) mapType = 'wfs';
        else if(url.indexOf('=wcs')>0) mapType = 'wcs';
        else if(url.indexOf('kml')>0)  mapType = 'kml';
        this.wmsMapHandler(this.cswID, this.mapToShow, mapType);
    }

    // --- detail zaznamu - pravý panel ---
    this.detailPanel = new Ext.Panel({
        tbar: new Ext.Toolbar({
            items: ["->",
            { xtype: 'button', text: HS.i18n('Map'), iconCls: 'cat-imgsprite iconShowMap', scope: this, handler: this.showMap, hidden:true},
            { xtype: 'button', text: 'PDF', iconCls: "cat-imgsprite iconPdf", scope: this, handler: this.showPDF},
            { xtype: 'button', text: 'XML', iconCls: "cat-imgsprite iconXml", scope: this, handler: this.showXML}
        ]}),
        region:'east',
        id:'detail',
        title: HS.i18n('Detail'),
        collapsed: true,
        collapsible: true,
        collapseMode: 'mini',
        split:true, width: '50%',
        minSize: 175, maxSize: 600,
        layout:'fit', margins:'0 5 0 0',
        loadMask: true,
        autoScroll: true,
        header: false
    });

    CatClientDetail.superclass.constructor.call(this, this.detailPanel);
}

Ext.extend(CatClientDetail, Ext.Panel, {});

