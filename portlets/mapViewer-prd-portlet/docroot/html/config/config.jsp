<%@include file="/html/init.jsp"%>

<div class="portlet-msg-info">
    <span class="displaying-article-id-holder "> ERRA MapViewer
        configuration page. </span>
</div>

<form action="<liferay-portlet:actionURL portletConfiguration="true" />"
    method="post" name="<portlet:namespace />fm">
    <aui:input name="<%=Constants.CMD%>" type="hidden"
        value="<%=Constants.UPDATE%>" />


    <aui:input name="statusmanagerurl" type="text" first="true"
        label="StatusManager URL: " value='<%=stmngurl%>'
        inlineLabel="left" size='50' />

    <%
        if (disabled) {
    %>
    <div class="portlet-msg-info">
        <span class="displaying-article-id-holder "> You must
            setup StatusManager URL first ! </span>
    </div>
    <%
        } else {
    %>

    <aui:fieldset>
        <aui:select disabled='<%=disabled%>' name="defaultComp"
            label="Default composition" inlineLabel="left">
            <aui:option></aui:option>
            <%
            if (compositions != null) {

                for (Composition comp : compositions) {
                    if (prefs.getValue("defaultComp", StringPool.BLANK)
                            .equals(comp.getId())) {
                        selected = true;
                    } else {
                        selected = false;
                    }
                %>
                <aui:option value="<%=comp.getId()%>"
                    selected='<%=selected%>'><%=comp.getTitle()%></aui:option>
            <%
                }
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
        <aui:select disabled='<%=disabled%>'
            name="<%=String.valueOf(role.getRoleId())%>"
            label="<%=role.getName()%>" inlineLabel="left">
            <aui:option></aui:option>
            <%
                if (compositions != null) {
                    for (Composition comp : compositions) {
                        if (prefs.getValue(
                                String.valueOf(role.getRoleId()),
                                StringPool.BLANK).equals(
                                comp.getId())) {
                            selected = true;
                        } else {
                            selected = false;
                        }
            %>
            <aui:option value="<%=comp.getId()%>"
                selected='<%=selected%>'><%=comp.getTitle()%></aui:option>
            <%
                    }
                }
            %>

        </aui:select>
        <%
            }
        %>
    </aui:fieldset>
    <%
        }
    %>
    <aui:button-row>
        <aui:button name="saveButton" type="submit" value="save" />

        <aui:button name="cancelButton" type="button" value="cancel" />
    </aui:button-row>
</form>
