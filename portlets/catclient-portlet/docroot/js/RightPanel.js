RightPanel = function(config){
    this.config  = config;
    this.showDetail = function(){
        this.expand();
        this.activate('detail');
    }

    this.extentContainer = new Ext.Container({html:"&nbsp;"});

    this.mapPanel = new Ext.Panel({
        border: true,
        frame: false,
        title: HS.i18n("Map"),
        layout: 'fit',
        id: 'mapPanel',
        tbar: [{
            text: HS.i18n('Bounding box'),
            enableToggle: true,
            pressed: false,
            iconCls: 'cat-imgsprite iconBbox',
            scope: this,
            handler: this.onExtentClicked
        }],
        bbar: [HS.i18n("Bounding box")+": ", this.extentContainer ]
    });

    // --- detail zaznamu - pravy panel ---
    this.rightPanel = new Ext.TabPanel({
        region:(config.mapWidth ? 'east' : 'center'),
        id:'right',
        activeTab: 0,
        width: (config.mapWidth ? config.mapWidth : 'auto'),
        items: [
            this.mapPanel,
            config.detailPanel
        ]
    });

    RightPanel.superclass.constructor.call(this, this.rightPanel);
    this.addEvents("mousein");
}

Ext.extend(RightPanel, Ext.TabPanel, {

    mapPanel: undefined,
    map: undefined,
    vectors: undefined,
    selectFeature: undefined,
    mapClickScope: undefined,
    boxControl: undefined,
    boxes: undefined,
    extentBox: undefined,

    addMap: function() {
        this.map = AdvancedSearch.Map.createMap(this.mapPanel.body.dom.id);
        this.boxes = new OpenLayers.Layer.Boxes("Boxes",{displayInLayerSwitcher:false});
        this.map.addLayer(this.boxes);
        this.vectors = new OpenLayers.Layer.Vector("BBoxes");
        this.map.addLayer(this.vectors);
        this.selectFeature = new OpenLayers.Control.SelectFeature(
            [this.vectors],
            {
                multiple: false, hover: true,toggle:true
            }
        );
        this.map.addControl(this.selectFeature);
        this.selectFeature.activate();
        this.vectors.styleMap.styles["default"].defaultStyle.fillOpacity = 0.01;
        var DrawBox = OpenLayers.Class(OpenLayers.Control, {
            initialize: function(options) {
                OpenLayers.Control.prototype.initialize.apply(this, [options]);
                this.handler = new OpenLayers.Handler.Box(
                    this, {done: this.onBoxDrawed}, {keyMask: this.keyMask}
                );
            }
        });
        this.boxControl = new DrawBox();
        this.boxControl.handler.callbacks["done"] = this.onBoxDrawed;
        this.boxControl.scope = this;
        this.map.addControl(this.boxControl);
    },

    onExtentClicked: function(evt) {
        this.boxControl.button = evt;
        this.boxControl.activate();
    },

    onBoxDrawed: function(e) {
        // call this function again with proper scope
        if (this.CLASS_NAME != "RightPanel" && this.scope) {
            this.handler.callbacks['done'].apply(this.scope,arguments);
            return;
        }

         //pro bod
        if(e.x){
            var leftBottom = this.map.getLonLatFromViewPortPx(new OpenLayers.Pixel(e.x-1,e.y+1));
            var rightTop = this.map.getLonLatFromViewPortPx(new OpenLayers.Pixel(e.x+1,e.y-1));;
        }
        // obdelnik
        else{
            var leftBottom = this.map.getLonLatFromViewPortPx(new OpenLayers.Pixel(e.left,e.bottom));
            var rightTop = this.map.getLonLatFromViewPortPx(new OpenLayers.Pixel(e.right,e.top));
        }

        leftBottom.transform(this.map.projection,new OpenLayers.Projection("epsg:4326"));
        rightTop.transform(this.map.projection,new OpenLayers.Projection("epsg:4326"));

        this.setSearchExtent(new OpenLayers.Bounds(leftBottom.lon,leftBottom.lat,rightTop.lon,rightTop.lat));

        this.boxControl.deactivate();
        this.boxControl.button.toggle();
    },

    /**
     * set search extent
     * @param bounds {OpenLayers.Bounds} in WGS84
     */
    setSearchExtent : function(bounds) {
        this.searchExtent = bounds;

        // only one marker per layer
        this.boxes.clearMarkers();

        if (bounds) {
            var bboxStr = new String(Math.round(bounds.left*1000)/1000)+" "+
                new String(Math.round(bounds.bottom*1000)/1000)+" "+
                new String(Math.round(bounds.right*1000)/1000)+" "+
                new String(Math.round(bounds.top*1000)/1000);

            this.extentContainer.update(bboxStr);

            // create and add
            var lb = new OpenLayers.LonLat(bounds.left, bounds.bottom);
            var rt = new OpenLayers.LonLat(bounds.right, bounds.top);

            lb.transform(new OpenLayers.Projection("epsg:4326"),this.map.projection);
            rt.transform(new OpenLayers.Projection("epsg:4326"),this.map.projection);

            bounds =  new OpenLayers.Bounds(lb.lon, lb.lat,rt.lon,rt.lat);
            var box = new OpenLayers.Marker.Box(bounds);
            this.boxes.addMarker(box);

            this.fireEvent('bboxset', bboxStr);
        } else {
            this.extentContainer.update("&nbsp;");
            this.fireEvent('bboxset', null);
        }
    },

    /**
     * get search extetn
     */
    getSearchExtent : function() {
        return this.searchExtent;
    },
    CLASS_NAME: "RightPanel"
});
