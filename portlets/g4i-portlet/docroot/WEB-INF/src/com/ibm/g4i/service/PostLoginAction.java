package com.ibm.g4i.service;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.liferay.portal.kernel.events.Action;
import com.liferay.portal.kernel.events.ActionException;
import com.liferay.portal.kernel.util.StringPool;
import com.liferay.portal.model.User;
import com.liferay.portal.service.UserLocalServiceUtil;
import com.liferay.portal.util.PortalUtil;

public class PostLoginAction extends Action {

    static final Map<String, Token> KEYS = new HashMap<String, Token>();
    private static Log LOG = LogFactory.getLog(PostLoginAction.class);

    public void run(HttpServletRequest request, HttpServletResponse response)
            throws ActionException {

        try {
            long companyId = PortalUtil.getCompanyId(request);
            long userId = PortalUtil.getUserId(request);
            User user = UserLocalServiceUtil.getUserById(companyId, userId);
            LOG.info("Registring key " + request.getSession().getId() + " for "
                    + user.getScreenName());
            KEYS.put(request.getSession().getId(), new Token(companyId, userId));
            LOG.debug(KEYS);
            for (Cookie c : request.getCookies()) {
                if (c.getName().equalsIgnoreCase("phpsessid")) {
                    c.setMaxAge(0);
                    c.setPath(StringPool.SLASH);
                    response.addCookie(c);
                }
            }            
        } catch (Exception ex) {
            LOG.error("error registering key", ex);
            throw new ActionException(ex);
        }
    }

}
