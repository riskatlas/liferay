<%@include file="init.jsp"%>

<liferay-theme:defineObjects />
<portlet:defineObjects />
<script src="/wwwlibs/hslayers/Lang/HSLayers-<%= themeDisplay.getLocale().getISO3Country().toLowerCase() %>.js" type="text/javascript"></script>
<script src="catclient-portlet/js/locale/labels-<%= themeDisplay.getLocale().getISO3Country().toLowerCase()%>.js" type="text/javascript"></script>

<div id="portalCatClient"></div>
