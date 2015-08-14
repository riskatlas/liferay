
<%@include file="/html/init.jsp"%>
<script>
Ext4.Loader.setConfig({
    enabled: true,
    paths: {"HSRS":'<%=layliburl%>'}
});

Ext4.require([ "Ext4.tree.*", 'HSRS.*' ]);

var lm;

HSRS.IMAGE_LOCATION = "<%=layliburl%>/imgs/";
HSRS.STYLERURL = "<%=stylerurl%>/?wms=<%=geosurl%>/{workspace}/ows/{workspace}&wmslayer={layerData.name}";
HSRS.VIEWURL = "<%=viewerurl%>/?wms=<%=geosurl%>/{workspace}/ows/{workspace}&wmslayers={layerData.name}";


var init = function() {
    Proj4js.libPath = "<%=proj4jsurl%>";

    // Languages, save to cookie
    HS.setLang("<%= iso3lang %>", true);

    var headerHeight = 0;

    var northDIV = [<%=hdivs%>];

    for (idiv = 0; idiv < northDIV.length; idiv++) {
        if (Ext4.select(northDIV[idiv]).getCount() > 0) {
            headerHeight += Ext4.select(northDIV[idiv]).elements[0].clientHeight
        }
    }
    var windowHeight = document.body.parentNode.clientHeight;

    var mapHeight = windowHeight - headerHeight - 175;

    lm = Ext4.create("HSRS.LayerManager",{
        url: "<%=layurl%>/layman",
        height : mapHeight,
        srid: "<%=srid%>",
        renderTo : "data"
        });

};
<%=init%>
    
</script>

<%=divdata%>
