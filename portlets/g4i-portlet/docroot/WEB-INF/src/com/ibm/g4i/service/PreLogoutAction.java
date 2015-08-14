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

public class PreLogoutAction extends Action {

	static final Map<String, User> KEYS = new HashMap<String, User>();
	private static Log LOG = LogFactory.getLog(PreLogoutAction.class);

	public void run(HttpServletRequest request, HttpServletResponse response) throws ActionException {
		try {
			String sessionId = request.getSession().getId();
			LOG.info("Unregistring key "+sessionId);
			PostLoginAction.KEYS.remove(sessionId);
            for (Cookie c : request.getCookies()) {
                if (c.getName().equalsIgnoreCase("phpsessid")) {
                    c.setMaxAge(0);
                    c.setPath(StringPool.SLASH);
                    response.addCookie(c);
                }
            }
		} catch (Exception ex) {
			LOG.error("error unregistering key", ex);
			throw new ActionException(ex);
		}
	}

}
