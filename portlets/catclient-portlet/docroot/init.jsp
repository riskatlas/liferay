<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet"%>
<%@ taglib uri="http://liferay.com/tld/theme" prefix="liferay-theme" %>
<%@ taglib uri="http://liferay.com/tld/portlet" prefix="liferay-portlet"%>
<%@ taglib uri="http://liferay.com/tld/ui" prefix="liferay-ui"%>

<%@ page import="com.liferay.portlet.PortletURLFactoryUtil"%>
<%@ page import="com.liferay.portlet.PortletURLUtil"%>
<%@ page import="com.liferay.portlet.PortletPreferencesFactoryUtil"%>

<%@ page import="com.liferay.portal.kernel.language.LanguageUtil" %>
<%@ page import="com.liferay.portal.kernel.util.StringPool"%>
<%@ page import="com.liferay.portal.kernel.util.Constants"%>
<%@ page import="com.liferay.portal.kernel.util.ParamUtil"%>
<%@ page import="com.liferay.portal.kernel.util.Validator"%>
<%@ page import="com.liferay.portal.model.Role"%>

<%@page import="com.liferay.portal.service.RoleLocalServiceUtil"%>

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

<liferay-theme:defineObjects />
<portlet:defineObjects />

<%
    PortletMode portletMode = liferayPortletRequest.getPortletMode();
    WindowState windowState = liferayPortletRequest.getWindowState();
    PortletPreferences prefs = renderRequest.getPreferences();

    String portletResource = ParamUtil.getString(request,
            "portletResource");

    if (Validator.isNotNull(portletResource)) {
        prefs = PortletPreferencesFactoryUtil.getPortletSetup(request,
                portletResource);
    }
%>
