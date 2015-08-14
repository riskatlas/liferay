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
<script type='text/javascript' src='<%= renderRequest.getPreferences().getValue("mapConfig", "/js/map/mapConfig.js") %>'></script>

<div id="mapClient"></div>

