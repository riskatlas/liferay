Ext.namespace("GeoExt.widgets.map");
GeoExt.widgets.map.MapPanel = Ext.extend(Ext.Panel, {
    initComponent: function () {
        var defConfig = {
            plain: true,
            border: false
        };
        Ext.applyIf(this, defConfig);
        GeoExt.widgets.map.MapPanel.superclass.initComponent.call(this);
    },
    onRender: function () {
        GeoExt.widgets.map.MapPanel.superclass.onRender.apply(this, arguments);
        this.map = new OpenLayers.Map(this.body.dom, this.mapOptions);
    },
    afterRender: function () {
        var size = this.ownerCt.getSize();
        Ext.applyIf(this, size);
        GeoExt.widgets.map.MapPanel.superclass.afterRender.call(this);
        if (this.controls instanceof Array) {
            this.addControls(this.controls);
        }
        if (this.layers instanceof Array) {
            this.addLayers(this.layers);
            if (this.center) {
                var location = new OpenLayers.LonLat(center[0], center[1]);
                var zoom;
                if (this.resolution) {
                    zoom = this.map.getZoomForResolution(this.resolution);
                }
                this.map.setCenter(location, zoom);
            } else {
                this.map.zoomToMaxExtent();
            }
        }
        this.ownerCt.on({
            "move": this.updateMapSize,
            scope: this
        });
    },
    updateMapSize: function () {
        if (this.map) {
            this.map.updateSize();
        }
    },
    onResize: function (w, h) {
        this.updateMapSize();
        GeoExt.widgets.map.MapPanel.superclass.onResize.call(this, w, h);
    },
    setSize: function (width, height, animate) {
        this.updateMapSize();
        GeoExt.widgets.map.MapPanel.superclass.setSize.call(this, width, height, animate);
    },
    getCenter: function () {
        return this.map.getCenter();
    },
    getZoom: function () {
        return this.map.getZoom();
    },
    getResolution: function () {
        return this.map.getResolution();
    },
    getExtent: function () {
        return this.map.getExtent();
    },
    addControls: function (controls) {
        for (var i = 0, len = controls.length; i < len; ++i) {
            this.map.addControl(controls[i]);
        }
    },
    addLayers: function (layers) {
        this.map.addLayers(layers);
    }
});
Ext.reg('gx_mappanel', GeoExt.widgets.map.MapPanel);
