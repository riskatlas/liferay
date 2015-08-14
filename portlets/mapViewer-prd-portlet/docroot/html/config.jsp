<%@ taglib uri="http://displaytag.sf.net" prefix="display"%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet"%>

<%@ taglib uri="http://liferay.com/tld/aui" prefix="aui"%>
<%@ taglib uri="http://liferay.com/tld/portlet" prefix="liferay-portlet"%>
<%@ taglib uri="http://liferay.com/tld/ui" prefix="liferay-ui" %>

<%@ page import="com.liferay.portlet.PortletURLFactoryUtil"%>
<%@ page import="com.liferay.portlet.PortletURLUtil"%>
<%@ page import="com.liferay.portlet.PortletPreferencesFactoryUtil"%>

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

<%@ page import="cz.ccss.mapViewer.*"%>

<portlet:defineObjects />

<%
    String title = null;
    Boolean selected = false;

    PortletMode portletMode = liferayPortletRequest.getPortletMode();
    WindowState windowState = liferayPortletRequest.getWindowState();
    PortletPreferences prefs = renderRequest.getPreferences();

    String portletResource = ParamUtil.getString(request, "portletResource");

    if (Validator.isNotNull(portletResource)) {
        prefs = PortletPreferencesFactoryUtil.getPortletSetup(request,
                portletResource);
    }

    List<Role> roles = (List<Role>) renderRequest.getAttribute("roles");
    List<Composition> compositions = (List<Composition>) renderRequest
            .getAttribute("compositions");
    String stmngurl = prefs.getValue("statusmanagerurl", StringPool.BLANK);
    Boolean disabled = false;
    if (stmngurl.isEmpty()) disabled = true;
%>

<liferay-portlet:actionURL portletConfiguration="true"
    var="configurationURL" />

<aui:form action="<%=configurationURL%>" method="post" name="fm">
    <aui:input name="<%=Constants.CMD%>" type="hidden"
        value="<%=Constants.UPDATE%>" />


    <aui:input name="statusmanagerurl" type="text" first="true"
        label="StatusManager URL: "
        value='<%=stmngurl%>'
        inlineLabel="left" size='50' />

    <%
        if (disabled) {
    %>
            <liferay-ui:message key="You must setup StatusManager URL first !" />
            <div class="portlet-msg-info">
                <span class="displaying-article-id-holder "> You must setup StatusManager URL first ! </span>
            </div>
    <%
        }
    %>

    <aui:fieldset>
        <aui:select disabled = '<%= disabled %>' name="defaultComp" label="Default composition" inlineLabel="left">
            <aui:option></aui:option>
            <%
                for (Composition comp : compositions) {
                    if (prefs.getValue("defaultComp", StringPool.BLANK).equals(comp.getId())) {
                        selected = true;
                    } else {
                        selected = false;
                    }
            %>
                <aui:option value="<%=comp.getId() %>" selected='<%= selected %>'><%=comp.getTitle()%></aui:option>
            <%
                }
            %>

        </aui:select>
    </aui:fieldset>
    <aui:fieldset label="Roles">
        <%
        %>
        <%

            for (Role role : roles) {
                if (role.getTitle().isEmpty()) {
                    title = role.getName();
                } else {
                    title = role.getTitle();
                }
        %>
        <!-- TODO: Fix translation  -->
        <!-- TODO: Select title instead of name -->
        <aui:select disabled = '<%= disabled %>' name="<%=String.valueOf(role.getRoleId())%>"
            label="<%=role.getName()%>" inlineLabel="left">
            <aui:option></aui:option>
            <%
                if (compositions != null) {
                    for (Composition comp : compositions) {
                        if (prefs.getValue(String.valueOf(role.getRoleId()), StringPool.BLANK).equals(comp.getId())){
                            selected = true;
                        } else {
                            selected = false;
                        }
            %>
                <aui:option value="<%=comp.getId() %>" selected='<%= selected %>'><%=comp.getTitle()%></aui:option>
            <%
                    }
                }
            %>

        </aui:select>
        <%
            }
        %>
    </aui:fieldset>

    <aui:button-row>
        <aui:button type="submit" />
    </aui:button-row>
</aui:form>
