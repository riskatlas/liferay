AdvancedSearch.Map = {};

/**
 * Function: createMap
 * Vrátí objekt typu OpenLayers.Map
 */
AdvancedSearch.Map.createMap =  function(id) {
    OpenLayers.Util.onImageLoadErrorColor = "white";
    OpenLayers.Util.onImageLoadError = function() {
    	this.style.display = "";
    	this.src = OpenLayers.Util.getImagesLocation()+"blank.gif";
    }

    var options = {
            projection: new OpenLayers.Projection("epsg:900913"),
            maxExtent: new OpenLayers.Bounds(-20037508.3427892,-20037508.3427892,20037508.3427892,20037508.3427892),
            units: "m",
	    controls: [],
            maxResolution: 156543.0399,
            numZoomLevels: 19
        };

    var map = new OpenLayers.Map(id, options);

    var osm = new OpenLayers.Layer.OSM("Mapnik");

    map.addControl(new OpenLayers.Control.Navigation({zoomBoxKeyMask: OpenLayers.Handler.MOD_CTRL}));
    map.addControl(new OpenLayers.Control.ArgParser());
    map.addControl(new OpenLayers.Control.Attribution());
    if (window.HSLayers) {
        map.addControl(new HSLayers.Control.PanZoom());
    }
    else {
        map.addControl(new OpenLayers.Control.PanZoom());
    }

    map.addLayer(osm);
    map.zoomToMaxExtent();
    map.zoomTo(AdvancedSearch.Map.defaultZoom);

    return map;
}

/**
 * set this default zoom to something else
 */
AdvancedSearch.Map.defaultZoom = 1;
