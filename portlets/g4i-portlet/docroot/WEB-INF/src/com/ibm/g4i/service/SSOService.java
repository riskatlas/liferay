package com.ibm.g4i.service;

import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.net.util.SubnetUtils;
import org.apache.commons.net.util.SubnetUtils.SubnetInfo;

import sun.net.util.IPAddressUtil;

import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.exception.SystemException;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.model.UserGroup;
import com.liferay.portal.model.Role;
import com.liferay.portal.model.User;
import com.liferay.portal.util.PortalUtil;

@Path("/sso")
public class SSOService {

    @Context
    private HttpServletRequest req;

    private static final Log LOG = LogFactory.getLog(SSOService.class);

    @GET
    @Path("/validate/{key}")
    @Produces("application/json; charset=UTF-8")
    public String validate(@PathParam("key") String key) throws Exception {
        JSONObject json = JSONFactoryUtil.createJSONObject();
        String sessID = null;

        try {
            String ip = req.getRemoteAddr();
            SubnetInfo subnet = (new SubnetUtils("10.0.0.0", "255.0.0.0"))
                    .getInfo();

            sessID = key;

            if (IPAddressUtil.isIPv4LiteralAddress(ip)) {
                if ((!ip.equalsIgnoreCase("127.0.0.1")) && !(subnet.isInRange(ip))) {
                    for (Cookie c : req.getCookies()) {
                        if (c.getName().equalsIgnoreCase("jsessionid")) {
                            sessID = c.getValue();
                        }
                    }
                }
            }

            if ((sessID != null) && (sessID.equalsIgnoreCase(key))) {
                Token token = PostLoginAction.KEYS.get(key);
                if (token != null) {
                    HttpSession session = req.getSession();
                    if (session == null) {
                        LOG.info("Token " + key + " has already expired.");
                        PostLoginAction.KEYS.remove(key);
                        json = getExpiredResponse(json, "Token " + key
                                + " has already expired.");
                    } else {
                        long diff = System.currentTimeMillis()
                                - session.getLastAccessedTime();
                        if (diff > (session.getMaxInactiveInterval() * 1000)) {
                            LOG.info("Token " + key + " has already expired.");
                            PostLoginAction.KEYS.remove(key);
                            json = getExpiredResponse(json, "Token " + key
                                    + " has already expired.");
                        } else {
                            if (token.getUpdateTime() < token.getUser()
                                    .getModifiedDate().getTime()) {
                                token.updateToken();
                            }

                            LOG.info("Token " + key + " is valid.");
                            json = getValidResponse(json,
                                    session.getMaxInactiveInterval(),
                                    token.getUser(), token.getRoles(),
                                    token.getGroups());
                        }
                    }
                } else {
                    LOG.info("Invalid token: " + key);
                    json = getInvalidResponse(json, "Token " + key
                            + " is not valid.");
                }
            } else {
                LOG.info(key + "not allowed");
                json = getInvalidResponse(json, "403: Token " + key
                        + " is not allowed. ");
            }
        } catch (Exception ex) {
            json.put("resultCode", "11");
            ex.printStackTrace();
            if (ex.getMessage() != null) {
                json.put("resultMessage", ex.getMessage().replace("\"", "'"));
            }
        }

        return json.toString();
    }

    protected JSONObject getValidResponse(JSONObject json, int leaseInterval,
            User user, List<Role> userRoles, List<UserGroup> userGroups)
            throws SystemException, PortalException {
        json.put("resultCode", "0");
        json.put("leaseInterval", leaseInterval);

        JSONObject userInfo = JSONFactoryUtil.createJSONObject();
        userInfo.put("userId", user.getUserId());
        userInfo.put("screenName", user.getScreenName());
        userInfo.put("firstName", user.getFirstName());
        userInfo.put("lastName", user.getLastName());
        userInfo.put("email", user.getEmailAddress());
        userInfo.put("language", user.getLocale().getLanguage());
        userInfo.put("lastUpdated", user.getModifiedDate().getTime());

        JSONArray roles = JSONFactoryUtil.createJSONArray();
        for (Role r : userRoles) {
            if (!PortalUtil.isSystemRole(r.getName())) {
                JSONObject role = JSONFactoryUtil.createJSONObject();
                role.put("roleName", r.getName().toLowerCase());
                role.put("roleTitle", r.getTitle(user.getLocale()));
                roles.put(role);
            }
        }
        userInfo.put("roles", roles);
        JSONArray groups = JSONFactoryUtil.createJSONArray();
        for (UserGroup g : userGroups) {
            if (!PortalUtil.isSystemGroup(g.getName())) {
                JSONObject group = JSONFactoryUtil.createJSONObject();
                group.put("name", g.getName());
                group.put("code", g.getUserGroupId());
                groups.put(group);
            }
        }
        userInfo.put("groups", groups);
        json.put("userInfo", userInfo);
        return json;
    }

    protected JSONObject getInvalidResponse(JSONObject json, String message) {
        json.put("resultCode", "1");
        json.put("resultMessage", message);
        return json;
    }

    protected JSONObject getExpiredResponse(JSONObject json, String message) {
        json.put("resultCode", "2");
        json.put("resultMessage", message);
        return json;
    }
}
