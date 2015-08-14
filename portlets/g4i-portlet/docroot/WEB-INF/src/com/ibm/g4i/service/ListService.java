package com.ibm.g4i.service;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;

/*import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;*/

import com.liferay.portal.kernel.exception.SystemException;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.service.RoleLocalServiceUtil;
import com.liferay.portal.model.Role;

@Path("/list")
public class ListService {

	@Context 
	private HttpServletRequest req;

	//private static final Log LOG = LogFactory.getLog(SSOService.class);

	@GET
	@Path("/roles/{locale}")
	@Produces("application/json; charset=UTF-8")
	public String roles(@PathParam("locale") String locale) throws Exception {
		JSONObject json = JSONFactoryUtil.createJSONObject();
		try {
			json = getListRoles(json, locale);
						
		} catch (Exception ex) {
			json.put("resultCode", "11");
			json.put("resultMessage", ex.getMessage().replace("\"", "'"));
		}

		return json.toString();
	}
		
	protected JSONObject getListRoles(JSONObject json, String locale) throws SystemException {
		int count = RoleLocalServiceUtil.getRolesCount();
		json.put("RoleCount", count);
	
		JSONArray roles = JSONFactoryUtil.createJSONArray();
		for (Role r : RoleLocalServiceUtil.getRoles(0, count)) {
			JSONObject role = JSONFactoryUtil.createJSONObject();
			
			role.put("roleName", r.getName());
			role.put("roleTitle", r.getTitle(locale));
			roles.put(role);
		}
		json.put("roles", roles);
		return json;
	}

	protected JSONObject getInvalidResponse(JSONObject json, String message) {
		json.put("resultCode", "1");
		json.put("resultMessage", message);
		return json;
	}
}
