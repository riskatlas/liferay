<%@ taglib uri="http://java.sun.com/portlet" prefix="portlet"%>

<%@ taglib uri="http://liferay.com/tld/portlet" prefix="liferay-portlet"%>
<%@ taglib uri="http://liferay.com/tld/security"
	prefix="liferay-security"%>
<%@ taglib uri="http://liferay.com/tld/theme" prefix="liferay-theme"%>
<%@ taglib uri="http://liferay.com/tld/ui" prefix="liferay-ui"%>
<%@ taglib uri="http://liferay.com/tld/util" prefix="liferay-util"%>

<%@ page import="com.liferay.portal.kernel.util.Constants"%>
<%@ page import="com.liferay.portal.kernel.util.GetterUtil"%>
<%@ page import="com.liferay.portal.kernel.util.ParamUtil"%>
<%@ page import="com.liferay.portal.kernel.util.StringPool"%>
<%@ page import="com.liferay.portal.kernel.util.Validator"%>
<%@ page import="com.liferay.portal.util.PortalUtil"%>
<%@ page import="com.liferay.portlet.PortletPreferencesFactoryUtil"%>
<%@ page import="javax.portlet.PortletPreferences"%>
<%@ page import="javax.portlet.WindowState"%>
<%@ page import="javax.portlet.PortletURL"%>
<%@ page import="javax.portlet.ActionRequest"%>
<%@ page import="javax.portlet.PortletPreferences"%>

<%@ page import="com.liferay.portal.kernel.language.LanguageUtil"%>
<%@ page import="com.liferay.portal.security.permission.ActionKeys"%>

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
<script src="/js/layman/lib/lang/layman-<%= iso3lang %>.js" type="text/javascript"></script>
<%
	String currentURL = PortalUtil.getCurrentURL(request);

	PortletPreferences preferences = renderRequest.getPreferences();

	String portletResource = ParamUtil.getString(request,
	"portletResource");

	if (Validator.isNotNull(portletResource)) {
		preferences = PortletPreferencesFactoryUtil.getPortletSetup(
		request, portletResource);
	}

	String layurl = preferences.getValue("layurl", StringPool.BLANK);
	String layliburl = preferences.getValue("layliburl",
			StringPool.BLANK);
	String geosurl = preferences.getValue("geosurl", StringPool.BLANK);
	String viewerurl = preferences.getValue("viewerurl",
			StringPool.BLANK);
	String stylerurl = preferences.getValue("stylerurl",
			StringPool.BLANK);
	String proj4jsurl = preferences.getValue("proj4jsurl",
			StringPool.BLANK);
	String hdivs = preferences.getValue("hdivs", StringPool.BLANK);
    String srid = preferences.getValue("srid", StringPool.BLANK);
	String divdata = StringPool.BLANK;
	String init = StringPool.BLANK;
	
	if (!layurl.equals(StringPool.BLANK)) {
		divdata = "<div id='data'></div>";
		init = "window.addEventListener ? window.addEventListener('load', init, false)";
		init += ": window.attachEvent('onload', init);";
	} else {
		divdata = "<div class='portlet-msg-info'>";
		divdata += "<span class='displaying-article-id-holder '>";
		divdata += "You must setup Layer manager first !</span></div>";
	}
%>

