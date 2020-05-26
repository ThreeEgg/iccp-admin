import api from './api';
import request from './request';

export const getRoleInfo = async ({ pageNum, pageSize, createTimeBegin, createTimeEnd, createUserName, description, roleType,
  updateTimeBegin, updateTimeEnd, updateUserName }) => request(api.roleList, {
    params: {
      pageNum, pageSize, createTimeBegin, createTimeEnd, createUserName, description, roleType,
      updateTimeBegin, updateTimeEnd, updateUserName
    }
  })

export const addRole = async ({ id, description, permissionIds, roleType }) =>
  request.post(api.roleUpdate, {
    params: {
      id, description, permissionIds, roleType
    },
  });

export const deleteRole = async ({ id }) =>
  request(api.roleDelete, {
    params: {
      id
    }
  })
export const getRoleLimit = async (id) =>
  request(api.roleGet, {
    params: {
      id
    }
  })

