package com.ibm.g4i.service;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.PortletConfig;
import javax.portlet.PortletPreferences;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.liferay.portal.kernel.struts.BaseStrutsPortletAction;
import com.liferay.portal.kernel.struts.StrutsPortletAction;
import com.liferay.portal.kernel.util.ParamUtil;

public class CustomLoginAction extends BaseStrutsPortletAction {
    private static final Log LOG = LogFactory.getLog(CustomLoginAction.class);

    @Override
    public void processAction(StrutsPortletAction originalStrutsPortletAction,
            PortletConfig portletConfig, ActionRequest actionRequest,
            ActionResponse actionResponse) throws Exception {

        String coming = ParamUtil.getString(actionRequest, "coming");
        PortletPreferences prefs = actionRequest.getPreferences();
        prefs.setValue("coming", coming);
        prefs.store();
        // This will call the Liferay default Login portlet and authenticate the
        // liferay portal.
        originalStrutsPortletAction.processAction(originalStrutsPortletAction,
                portletConfig, actionRequest, actionResponse);
    }

    @Override
    public String render(StrutsPortletAction originalStrutsPortletAction,
            PortletConfig portletConfig, RenderRequest renderRequest,
            RenderResponse renderResponse) throws Exception {

        return originalStrutsPortletAction.render(originalStrutsPortletAction,
                portletConfig, renderRequest, renderResponse);
    }

}
