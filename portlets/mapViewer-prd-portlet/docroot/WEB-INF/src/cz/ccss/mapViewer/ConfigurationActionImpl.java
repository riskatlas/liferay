package cz.ccss.mapViewer;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import com.liferay.portal.kernel.portlet.ConfigurationAction;
import com.liferay.portal.kernel.servlet.SessionMessages;
import com.liferay.portal.kernel.util.Constants;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.StringPool;
import com.liferay.portal.model.Role;
import com.liferay.portal.service.RoleLocalServiceUtil;
import com.liferay.portal.util.PortalUtil;
import com.liferay.portlet.PortletPreferencesFactoryUtil;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

import com.liferay.portal.kernel.exception.SystemException;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.PortletConfig;
import javax.portlet.PortletPreferences;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.servlet.http.Cookie;

public class ConfigurationActionImpl implements ConfigurationAction {
    private static final Log LOG = LogFactory.getLog(ConfigurationAction.class);
    public void processAction(PortletConfig portletConfig,
            ActionRequest actionRequest, ActionResponse actionResponse)
            throws Exception {

        String cmd = ParamUtil.getString(actionRequest, Constants.CMD);

        if (!cmd.equals(Constants.UPDATE)) {
            return;
        }

        String portletResource = ParamUtil.getString(actionRequest,
                "portletResource");
        PortletPreferences preferences = PortletPreferencesFactoryUtil
                .getPortletSetup(actionRequest, portletResource);

        String paramValue = null;

        String statusmanagerurl = ParamUtil.getString(actionRequest,
                "statusmanagerurl");
        preferences.setValue("statusmanagerurl", statusmanagerurl);

        String defaultComp = ParamUtil.getString(actionRequest, "defaultComp");
        preferences.setValue("defaultComp", defaultComp);

        for (Role role : this.getRoles()) {
            paramValue = ParamUtil.getString(actionRequest,
                    String.valueOf(role.getRoleId()));
            preferences.setValue(String.valueOf(role.getRoleId()), paramValue);
        }

        preferences.store();

        SessionMessages.add(actionRequest, portletConfig.getPortletName()
                + ".doConfigure");
    }

    public String render(PortletConfig portletConfig,
            RenderRequest renderRequest, RenderResponse renderResponse)
            throws Exception {
        String sessID = null;
        for (Cookie cookie : renderRequest.getCookies()){
            if (cookie.getName().equalsIgnoreCase("jsessionid")){
                sessID = cookie.getValue();
            }

        }
        DefaultHttpClient client = new DefaultHttpClient();
        String stmng = renderRequest.getPreferences().getValue("statusmanagerurl", StringPool.BLANK);

        if (!stmng.isEmpty()){
            URI uri = new URIBuilder(stmng)
                .setParameter("request", "list")
                .setParameter("project", "erra/map")
                .setHost(renderRequest.getServerName())
                .setScheme("http")
                .build();
            LOG.info("URI: " + uri);
            HttpGet compReq = new HttpGet(uri);
            LOG.info(compReq);
            compReq.setHeader("Cookie", "JSESSIONID=" + sessID);
            HttpResponse compResp = client.execute(compReq);
            HttpEntity compEnt = compResp.getEntity();

            List<Composition> compositions = new ArrayList<Composition>();
            JSONObject json = JSONFactoryUtil.createJSONObject(EntityUtils.toString(compEnt));
            JSONArray array = json.getJSONArray("results");
            for (int i=0; i<array.length();i++){
                JSONObject jsoncomp = array.getJSONObject(i);
                Composition comp = new Composition();
                comp.setId(jsoncomp.getString("id"));
                comp.setTitle(jsoncomp.getString("title"));
                comp.setAbs(jsoncomp.getString("abstract"));
                compositions.add(comp);
            }
            renderRequest.setAttribute("compositions", compositions);
        }
        renderRequest.setAttribute("roles", this.getRoles());
        return "/html/config/config.jsp";
    }

    private List<Role> getRoles() throws SystemException {
        int count = RoleLocalServiceUtil.getRolesCount();
        List<Role> roles = new ArrayList<Role>();
        for (Role role : RoleLocalServiceUtil.getRoles(0, count)) {
            if (!PortalUtil.isSystemRole(role.getName())){
                if (role.getType() == 1) {
                    roles.add(role);
                }
            }
        }
        return roles;
    }
}
