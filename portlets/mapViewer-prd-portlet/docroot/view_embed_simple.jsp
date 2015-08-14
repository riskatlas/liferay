<%@page import="java.util.Enumeration"%>
<%@page import="java.util.ResourceBundle"%>
<%@page import="com.liferay.portal.util.PortalUtil"%>
<%@page import="com.liferay.portal.theme.ThemeDisplay"%>
<%@ taglib uri="http://java.sun.com/portlet" prefix="portlet"%>
<%@ taglib uri="http://liferay.com/tld/ui" prefix="liferay-ui"%>
<%@ taglib uri="http://liferay.com/tld/theme" prefix="liferay-theme"%>

<%@ page import="java.text.MessageFormat"%>

<liferay-theme:defineObjects />
<portlet:defineObjects />
<div id="embed_portlet">

<script type="text/javascript">
var embed = new HSLayersEmbed()
;embed.initialize({baseUrl: "http://"+document.domain, scriptPath: "/wwwlibs/embed-3.5/embed.php",mapId: "map",height: "<%= renderRequest.getPreferences().getValue("height", "300") %>px",width: "<%= renderRequest.getPreferences().getValue("width", "300") %>px",type: "simple",permalink: "<%= renderRequest.getPreferences().getValue("permalink", "") %>" });
embed.display();
</script>
</div>
