package cz.ccss.layman;

import com.liferay.portal.kernel.portlet.ConfigurationAction;
import com.liferay.portal.kernel.servlet.SessionMessages;
import com.liferay.portal.kernel.util.Constants;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portlet.PortletPreferencesFactoryUtil;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.PortletConfig;
import javax.portlet.PortletPreferences;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

public class ConfigurationActionImpl implements ConfigurationAction {
	public void processAction(PortletConfig portletConfig,
			ActionRequest actionRequest, ActionResponse actionResponse)
			throws Exception {

		String cmd = ParamUtil.getString(actionRequest, Constants.CMD);

		if (!cmd.equals(Constants.UPDATE)) {
			return;
		}

		String layurl = ParamUtil.getString(actionRequest, "layurl");
		String layliburl = ParamUtil.getString(actionRequest, "layliburl");
		String geosurl = ParamUtil.getString(actionRequest, "geosurl");
		String viewerurl = ParamUtil.getString(actionRequest, "viewerurl");
		String stylerurl = ParamUtil.getString(actionRequest, "stylerurl");
		String proj4jsurl = ParamUtil.getString(actionRequest, "proj4jsurl");
		String hdivs = ParamUtil.getString(actionRequest, "hdivs");
		String srid = ParamUtil.getString(actionRequest, "srid");

		String portletResource = ParamUtil.getString(actionRequest,
				"portletResource");
		PortletPreferences preferences = PortletPreferencesFactoryUtil
				.getPortletSetup(actionRequest, portletResource);

		preferences.setValue("layurl", layurl);
		preferences.setValue("layliburl", layliburl);
		preferences.setValue("geosurl", geosurl);
		preferences.setValue("viewerurl", viewerurl);
		preferences.setValue("stylerurl", stylerurl);
		preferences.setValue("proj4jsurl", proj4jsurl);
		preferences.setValue("hdivs", hdivs);
		preferences.setValue("srid", srid);

		preferences.store();

		SessionMessages.add(actionRequest, portletConfig.getPortletName()
				+ ".doConfigure");
	}

	public String render(PortletConfig portletConfig,
			RenderRequest renderRequest, RenderResponse renderResponse)
			throws Exception {

		return "/html/config.jsp";
	}
}
