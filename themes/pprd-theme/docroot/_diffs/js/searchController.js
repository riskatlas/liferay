var searchURLOSM = "/php/gazet/index.php";

var onMapSearchFormSubmit = function(theForm) {
    var val = theForm.q.value;
    if (geoportal.map != undefined) {
        parseAddress(val);
    } else theForm.submit();
    return false;
};

var onMetadataSearchFormSubmit = function(theForm) {
    theForm.submit();
};

var parseAddress = function(OSM) {

    geoportal.searchPanel.clear();
    geoportal.searchPanel.maskOn();
    LAYERS.searchLayer.destroyFeatures();
    geoportal.toolsPanel.layout.setActiveItem(geoportal.searchPanel.id);
    geoportal.searchPanel.enable();
    searchOSM(OSM);
    geoportal.searchPanel.maskOff();
    return false;
};

var searchOSM = function(str) {
    OpenLayers.Request.GET({
        url: searchURLOSM,
        async: false,
        params: { format: 'kml', q: str },
        scope: LAYERS.searchLayer,
        success: LAYERS.searchLayer.parse
    });
    return false;
};