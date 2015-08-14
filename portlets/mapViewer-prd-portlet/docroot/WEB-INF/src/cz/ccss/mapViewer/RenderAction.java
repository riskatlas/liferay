package cz.ccss.mapViewer;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;

import javax.portlet.PortletException;
import javax.portlet.PortletPreferences;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

//import org.apache.commons.logging.Log;
//import org.apache.commons.logging.LogFactory;

import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.exception.SystemException;
import com.liferay.portal.kernel.util.StringPool;
import com.liferay.portal.model.Role;
import com.liferay.portal.model.User;
import com.liferay.portal.service.UserServiceUtil;
import com.liferay.util.bridges.mvc.MVCPortlet;

public class RenderAction extends MVCPortlet {
    // private static final Log LOG = LogFactory
    // .getLog(ConfigurationActionImpl.class);

    public void doView(RenderRequest renderRequest,
            RenderResponse renderResponse) throws IOException, PortletException {

        PortletPreferences prefs = renderRequest.getPreferences();
        HashSet<String> hs = new HashSet<String>();
        ArrayList<String> comps = new ArrayList<String>();
        User user = null;
        try {
            if (renderRequest.getRemoteUser() != null) {
                user = UserServiceUtil.getUserById(Long.parseLong(renderRequest
                        .getRemoteUser()));
            }
        } catch (NumberFormatException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (PortalException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (SystemException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        if (user != null) {
            try {
                for (Role role : user.getRoles()) {
                    String compId = prefs.getValue(
                            String.valueOf(role.getRoleId()), StringPool.BLANK);
                    if (!compId.isEmpty()) {
                        hs.add(compId);
                    }

                }
                comps.addAll(hs);
            } catch (SystemException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        } else {
            comps.add(prefs.getValue("defaultComp", StringPool.BLANK));
        }
        renderRequest.setAttribute("comps", comps);
        super.doView(renderRequest, renderResponse);
    }
}
