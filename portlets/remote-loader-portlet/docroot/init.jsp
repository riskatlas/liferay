<%@ taglib uri="http://displaytag.sf.net" prefix="display"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet"%>
<%@ taglib uri="http://liferay.com/tld/theme" prefix="liferay-theme" %>
<%@ taglib uri="http://liferay.com/tld/aui" prefix="aui"%>
<%@ taglib uri="http://liferay.com/tld/portlet" prefix="liferay-portlet"%>
<%@ taglib uri="http://liferay.com/tld/ui" prefix="liferay-ui"%>

<%@ page import="com.liferay.portlet.PortletPreferencesFactoryUtil"%>
<%@ page import="javax.portlet.PortletPreferences"%>
<%@ page import="com.liferay.portal.kernel.util.StringPool"%>
<%@ page import="com.liferay.portal.kernel.util.Constants"%>
<%@ page import="com.liferay.portal.kernel.util.ParamUtil"%>
<%@ page import="com.liferay.portal.kernel.util.Validator"%>
<%@ page import="com.liferay.portal.kernel.language.LanguageUtil" %>

<%@ page import="cz.ccss.remoteLoader.*"%>

<liferay-theme:defineObjects />
<portlet:defineObjects />

<%
    // PortletMode portletMode = liferayPortletRequest.getPortletMode();
    // WindowState windowState = liferayPortletRequest.getWindowState();
    PortletPreferences prefs = renderRequest.getPreferences();

    String param = (String)renderRequest.getAttribute("param");
    String portletResource = ParamUtil.getString(request,
            "portletResource");

    if (Validator.isNotNull(portletResource)) {
        prefs = PortletPreferencesFactoryUtil.getPortletSetup(request,
                portletResource);
    }

    String remoteContentURL = prefs.getValue("remoteContentURL",
            StringPool.BLANK);
    String paramsURL = prefs.getValue("paramsURL",
            StringPool.BLANK);
    Boolean disabled = false;
    if (remoteContentURL.isEmpty())
        disabled = true;
%>

