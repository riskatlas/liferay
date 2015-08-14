<%@ taglib uri="http://java.sun.com/portlet" prefix="portlet"%>
<%@ page import="com.liferay.portal.service.*"%>
<portlet:defineObjects />
<liferay-theme:defineObjects />

<%
    String mapConfig = renderRequest.getPreferences().getValue(
            "mapConfig", "");

    if ((request.getParameter("mapConfig") != null)
            && (!request.getParameter("mapConfig").equals(""))) {
        mapConfig = request.getParameter("mapConfig");
        renderRequest.getPreferences().setValue("mapConfig",
                request.getParameter("mapConfig"));
        renderRequest.getPreferences().store();
    }
%>

<%
    if (renderRequest.getAttribute("errorMessage") != null) {
%>
<font color="red"><b><%=renderRequest.getAttribute("errorMessage")%></b></font>
<%
    } else {
%>
<br>
<%
    }
%>
<form action="<portlet:renderURL />" method="post"
    name="<portlet:namespace />fm">
    <table>
        <tbody>
            <tr>
                <td><b>Config URL: </b></td>
                <td><input name="mapConfig" type="text" size="30"
                    value="<%=mapConfig%>"></td>
            </tr>
            <tr>
                <td></td>
                <td><input class="portlet-form-button" type="button"
                    value="Save"
                    onClick="submitForm(document.<portlet:namespace />fm);"></td>
            </tr>
        </tbody>
    </table>
</form>
