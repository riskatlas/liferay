<%@include file="init.jsp"%>

<div class="portlet-msg-info">
    <span class="displaying-article-id-holder "> <%= LanguageUtil.get(pageContext,"remote-content-url-configuration") %></span>
</div>

<liferay-portlet:actionURL portletConfiguration="true"
    var="configurationURL" />
    
<aui:form action="<%=configurationURL%>" method="post" name="fm">
    <aui:fieldset>

        <aui:input name="<%=Constants.CMD%>" type="hidden"
            value="<%=Constants.UPDATE%>" />
    
    
        <aui:input name="remoteContentURL" type="text" first="true"
            label='<%= LanguageUtil.get(pageContext,"remote-content-url") %>' value='<%=remoteContentURL%>'
            inlineLabel="left" size='50' />
    
        <aui:input name="paramsURL" type="text"
            label='<%= LanguageUtil.get(pageContext,"params-remote-content-url") %>' value='<%=paramsURL%>'
            inlineLabel="left" size='50' />
    </aui:fieldset>
    <aui:button-row>
        <aui:button name="saveButton" type="submit" value='<%= LanguageUtil.get(pageContext,"save") %>' />

        <aui:button name="cancelButton" type="button" value='<%= LanguageUtil.get(pageContext,"cancel") %>' />
    </aui:button-row>
</aui:form>
