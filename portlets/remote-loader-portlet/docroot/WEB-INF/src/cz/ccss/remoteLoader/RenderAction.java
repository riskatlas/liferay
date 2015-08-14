package cz.ccss.remoteLoader;

import java.io.IOException;

import javax.portlet.PortletException;
import javax.portlet.PortletPreferences;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

import javax.servlet.http.HttpServletRequest;

import org.apache.http.client.utils.URIBuilder;

import com.liferay.portal.kernel.util.StringPool;
import com.liferay.portal.util.PortalUtil;
import com.liferay.util.bridges.mvc.MVCPortlet;

public class RenderAction extends MVCPortlet {
    // private static final Log LOG = LogFactory
    // .getLog(ConfigurationActionImpl.class);

    public void doView(RenderRequest renderRequest,
            RenderResponse renderResponse) throws IOException, PortletException {
        String value;
        HttpServletRequest request = PortalUtil.getHttpServletRequest(renderRequest);
        URIBuilder builder = new URIBuilder();
        
        PortletPreferences prefs = renderRequest.getPreferences();
        String remoteContentURL = prefs.getValue(String.valueOf("remoteContentURL"), StringPool.BLANK);
        String paramsURL = prefs.getValue(String.valueOf("paramsURL"), StringPool.BLANK);
        String[] params = null;

        if (paramsURL.indexOf(',') > 0) {
            params = paramsURL.split(",");
        } else if (paramsURL.length() > 0)
        {
            params = new String[1];
            params[0] = paramsURL;
        }
        builder.setPath(remoteContentURL);
        if (params != null) {
            for (int i=0; i < params.length; i++) {
                String param = params[i];
                 value = PortalUtil.getOriginalServletRequest(request).getParameter(param);
                 if (value != null && !value.isEmpty()) {
                     builder.addParameter(param, value);
                 }
            }
        }

        renderRequest.setAttribute("param", builder.toString());

        super.doView(renderRequest, renderResponse);
    }
}
