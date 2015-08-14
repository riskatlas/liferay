<%@ taglib uri="http://displaytag.sf.net" prefix="display"%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet"%>
<%@ taglib uri="http://liferay.com/tld/theme" prefix="liferay-theme" %>
<%@ taglib uri="http://liferay.com/tld/aui" prefix="aui"%>
<%@ taglib uri="http://liferay.com/tld/portlet" prefix="liferay-portlet"%>

<%@ page import="com.liferay.portlet.PortletURLFactoryUtil"%>
<%@ page import="com.liferay.portlet.PortletURLUtil"%>
<%@ page import="com.liferay.portlet.PortletPreferencesFactoryUtil"%>

<%@ page import="com.liferay.portal.kernel.util.StringPool"%>
<%@ page import="com.liferay.portal.kernel.util.Constants"%>
<%@ page import="com.liferay.portal.kernel.util.ParamUtil"%>
<%@ page import="com.liferay.portal.kernel.util.Validator"%>
<%@ page import="com.liferay.portal.model.Role"%>

<%@ page import="javax.portlet.MimeResponse"%>
<%@ page import="javax.portlet.PortletConfig"%>
<%@ page import="javax.portlet.PortletContext"%>
<%@ page import="javax.portlet.PortletException"%>
<%@ page import="javax.portlet.PortletMode"%>
<%@ page import="javax.portlet.PortletPreferences"%>
<%@ page import="javax.portlet.PortletRequest"%>
<%@ page import="javax.portlet.PortletResponse"%>
<%@ page import="javax.portlet.PortletURL"%>
<%@ page import="javax.portlet.ResourceURL"%>
<%@ page import="javax.portlet.UnavailableException"%>
<%@ page import="javax.portlet.ValidatorException"%>
<%@ page import="javax.portlet.WindowState"%>

<%@ page import="java.util.List"%>
<%@ page import="java.net.URI" %>

<%@ page import="org.apache.http.client.utils.URIBuilder" %>


<%@ page import="cz.ccss.mapViewer.*"%>


<liferay-theme:defineObjects />
<portlet:defineObjects />

<%
String iso3lang = themeDisplay.getLocale().getISO3Language().toLowerCase();
if (iso3lang.equals("ces")){
    iso3lang = "cze";
}

String iso2lang = themeDisplay.getLocale().getLanguage();
%>

<script src="/wwwlibs/hslayers/Lang/HSLayers-<%= iso3lang %>.js" type="text/javascript"></script>
<script src="/wwwlibs/ext4/locale/ext-lang-<%= iso2lang %>.js" type="text/javascript"></script>
<script src="/wwwlibs/ext/locale/ext-lang-<%= iso2lang %>.js" type="text/javascript"></script>

<%
    String title = null;

    PortletMode portletMode = liferayPortletRequest.getPortletMode();
    WindowState windowState = liferayPortletRequest.getWindowState();
    PortletPreferences prefs = renderRequest.getPreferences();

    String portletResource = ParamUtil.getString(request, "portletResource");

    if (Validator.isNotNull(portletResource)) {
        prefs = PortletPreferencesFactoryUtil.getPortletSetup(request,
                portletResource);
    }

    List<String> compositions = (List<String>) renderRequest.getAttribute("comps");
    String stmngurl = prefs.getValue("statusmanagerurl", StringPool.BLANK);
%>

<script type="text/javascript">
    function loadCompFromURL(url){

        var cfg = {newlayers: true};

        OpenLayers.Request.GET({
            url: url,
            success: function(r) {
                geoportal.map.loadComposition(r.responseText, cfg);
            },
            failure: function(r) {
            }
        });

    }
    function loadDefaultComp () {
    <%
        if (!compositions.isEmpty()) {
	    	for (String comp : compositions) {
	        URI uri = new URIBuilder(stmngurl)
	        .setParameter("request", "load")
	        .setParameter("project", "erra/map")
	        .setParameter("id", comp)
	        .build();
    %>

        	loadCompFromURL("<%=uri.toString()%>");
    <%
        	}
        }
    %>
    }

</script>

<div id="mapClient"></div>
