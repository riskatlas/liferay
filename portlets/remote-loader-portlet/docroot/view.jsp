<%@include file="init.jsp"%>

<c:choose>
    <c:when test="<%= !disabled %>">
        <c:import var="data" charEncoding="UTF-8" url="<%=param%>" />
        ${data}
    </c:when>
</c:choose>