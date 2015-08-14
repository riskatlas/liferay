package com.ibm.g4i.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.exception.SystemException;
import com.liferay.portal.model.Organization;
import com.liferay.portal.model.Role;
import com.liferay.portal.model.User;
import com.liferay.portal.model.UserGroup;
import com.liferay.portal.service.RoleLocalServiceUtil;
import com.liferay.portal.service.UserLocalServiceUtil;

public class Token {

    private Date createDate;
    private long companyId;
    private long userId;
    private List<Role> roles;
    private List<Role> orgRoles;
    private List<UserGroup> groups;
    private List<Organization> organizations;

    private long updateTime;

    public Token(long companyId, long userId) throws SystemException,
            PortalException {
        this.createDate = new Date();
        this.companyId = companyId;
        this.userId = userId;
        this.setOrganizations(this.getUser().getOrganizations());
        this.setUpdateTime(this.getUser().getModifiedDate().getTime());
        if (this.getOrganizations().isEmpty()) {
            this.setRoles(this.getUser().getRoles());
        } else {
            List<Role> userRoles = new ArrayList<Role>();
            userRoles.addAll(this.getUser().getRoles());
            for (Organization org : this.getOrganizations()) {
                userRoles.addAll(RoleLocalServiceUtil.getGroupRoles(org
                        .getGroupId()));
            }
            this.setRoles(userRoles);
        }
        this.setGroups(this.getUser().getUserGroups());
    }

    public Date getCreateDate() {
        return createDate;
    }

    public User getUser() throws PortalException, SystemException {
        return UserLocalServiceUtil.getUserById(companyId, userId);
    }

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public List<Role> getOrgRoles() {
        return orgRoles;
    }

    public void setOrgRoles(List<Role> orgRoles) {
        this.orgRoles = orgRoles;
    }

    public List<UserGroup> getGroups() {
        return groups;
    }

    public void setGroups(List<UserGroup> groups) {
        this.groups = groups;
    }

    public long getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(long updateTime) {
        this.updateTime = updateTime;
    }

    public void updateToken() throws SystemException, PortalException {
        this.setOrganizations(this.getUser().getOrganizations());
        if (this.getOrganizations().isEmpty()) {
            this.setRoles(this.getUser().getRoles());
        } else {
            List<Role> userRoles = new ArrayList<Role>();
            userRoles.addAll(this.getUser().getRoles());
            for (Organization org : this.getOrganizations()) {
                userRoles.addAll(RoleLocalServiceUtil.getGroupRoles(org
                        .getGroupId()));
            }
            this.setRoles(userRoles);
        }

        this.setGroups(this.getUser().getUserGroups());
        this.setUpdateTime(this.getUser().getModifiedDate().getTime());
    }

    public List<Organization> getOrganizations() {
        return organizations;
    }

    public void setOrganizations(List<Organization> organizations) {
        this.organizations = organizations;
    }
}
