<%@include file="/html/init.jsp"%>

<div class="portlet-msg-info">
	<span class="displaying-article-id-holder "> Layer manager
		configuration page. </span>
</div>

<form action="<liferay-portlet:actionURL portletConfiguration="true" />"
	method="post" name="<portlet:namespace />fm">

	<input name="<portlet:namespace /><%=Constants.CMD%>" type="hidden"
		value="<%=Constants.UPDATE%>" />

	<table class="lfr-table">
		<tr>
			<td>Layman URL</td>
			<td><input width=50 type="text"
				name="<portlet:namespace />layurl" value="<%=layurl%>" /></td>
			<td>http://liferay.local/cgi-bin/layman</td>
		</tr>
		<tr>
			<td>Layman lib URL</td>
			<td><input width=50 type="text"
				name="<portlet:namespace />layliburl" value="<%=layliburl%>" /></td>
			<td>/js/layman/lib/</td>
		</tr>
		<tr>
			<td>Map viewer URL</td>
			<td><input width=50 type="text"
				name="<portlet:namespace />viewerurl" value="<%=viewerurl%>" /></td>
			<td>http://liferay.local/view</td>
		</tr>
		<tr>
			<td>Geoserver URL</td>
			<td><input width=50 type="text"
				name="<portlet:namespace />geosurl" value="<%=geosurl%>" /></td>
			<td>http://liferay.local/geoserver</td>
		</tr>
		<tr>
			<td>Styler URL</td>
			<td><input width=50 type="text"
				name="<portlet:namespace />stylerurl" value="<%=stylerurl%>" /></td>
			<td>http://liferay.local/styler/</td>
		</tr>
		<tr>
			<td>Proj4js URL</td>
			<td><input width=50 type="text"
				name="<portlet:namespace />proj4jsurl" value="<%=proj4jsurl%>" /></td>
			<td>/wwwlibs/proj4js/</td>
		</tr>
		<tr>
			<td>Header divs</td>
			<td><input width=50 type="text"
				name="<portlet:namespace />hdivs" value="<%=hdivs%>" /></td>
			<td>'#banner', '#navigation'</td>
		</tr>
        <tr>
            <td>Default SRID: </td>
            <td><input width=50 type="text"
                name="<portlet:namespace />srid" value="<%=srid%>" /></td>
            <td>EPSG:4326</td>
        </tr>
		<tr>
			<td colspan="2"><input type="button"
				value="<liferay-ui:message key="save" />"
				onClick="submitForm(document.<portlet:namespace />fm);" /></td>
		</tr>
	</table>
</form>