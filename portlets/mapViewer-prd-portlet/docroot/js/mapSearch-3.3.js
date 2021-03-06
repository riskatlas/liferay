var searchURL = "/php/gazet/index.php";

String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
};

String.prototype.normalizeSpace = function() {
    return this.replace(/^\s*|\s(?=\s)|\s*$/g, "");
};

/**
 * Po submitnuti formulare se jenom zparseruje adresa, formular se neodesle
 * @function
 * @param DOMElement theForm
 * @return Boolean vzdy false
 */
var parseAddress = function(q) {

    //var q = theForm.anytext.value.trim().toLowerCase();
    geoportal.infoPanel.clear();
    geoportal.infoPanel.maskOn();
    if (typeof LAYERS === 'undefined') {
        searchLayer.destroyFeatures();
    } else {
        LAYERS.searchLayer.destroyFeatures();
    }
    geoportal.infoPanel.clear();
    searchGazet(q);
    geoportal.toolsPanel.layout.setActiveItem(geoportal.infoPanel.id);
    return false;
};

/**
 * Vyledava v gazeteeru
 * @function
 * @param {String} str co se ma vyhledat
 */
var searchGazet = function(str) {
    if (typeof LAYERS === 'undefined') {
      OpenLayers.Request.GET({
        url: searchURL,
        async: false,
        params: { format: 'kml', q: str },
        scope: searchLayer,
        success: searchLayer.parse
      });
    } else {
      OpenLayers.Request.GET({
        url: searchURL,
        async: false,
        params: { format: 'kml', q: str },
        scope: LAYERS.searchLayer,
        success: LAYERS.searchLayer.parse
      });
    }
};

