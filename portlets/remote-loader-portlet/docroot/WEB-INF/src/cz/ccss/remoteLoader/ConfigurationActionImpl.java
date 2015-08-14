package cz.ccss.remoteLoader;

import com.liferay.portal.kernel.portlet.ConfigurationAction;
import com.liferay.portal.kernel.servlet.SessionMessages;
import com.liferay.portal.kernel.util.Constants;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portlet.PortletPreferencesFactoryUtil;

/*import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;*/

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.PortletConfig;
import javax.portlet.PortletPreferences;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

public class ConfigurationActionImpl implements ConfigurationAction {
//    private static final Log LOG = LogFactory.getLog(ConfigurationAction.class);
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

        String remoteContentURL = ParamUtil.getString(actionRequest,
                "remoteContentURL");
        preferences.setValue("remoteContentURL", remoteContentURL);

        String paramsURL = ParamUtil.getString(actionRequest,
                "paramsURL");
        preferences.setValue("paramsURL", paramsURL);

        preferences.store();

        SessionMessages.add(actionRequest, portletConfig.getPortletName()
                + ".doConfigure");
    }

    public String render(PortletConfig portletConfig,
            RenderRequest renderRequest, RenderResponse renderResponse)
            throws Exception {
        return "/config.jsp";
    }
}
