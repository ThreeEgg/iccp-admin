import api from './api';
import request from './request';

export const caseChatList = async params =>
  request(api.getChatList, {
    params,
  });

export const getAccountList = async ({
  pageNum,
  pageSize,
  createTimeBegin,
  createTimeEnd,
  createUserName,
  name,
  updateTimeBegin,
  updateTimeEnd,
  updateUserName,
}) => {
  return request(api.accountList, {
    params: {
      pageNum,
      pageSize,
      createTimeBegin,
      createTimeEnd,
      createUserName,
      name,
      updateTimeBegin,
      updateTimeEnd,
      updateUserName,
    },
  });
};

export const getStaticsInfo = async params =>
  request(api.staticsInfo, {
    params,
  });

export const getRoleList = async userId =>
  request(api.accountRoleList, {
    params: {
      userId,
    },
  });

export const addAccount = async ({ name, roleName, userId }) => {
  return request.post(api.accountUpdate, {
    params: {
      name,
      roleName,
      userId,
    },
  });
};
export const resetAccountPassword = async ({ userId }) =>
  request(api.resetAccountPassword, {
    params: {
      userId,
    },
  });

export const deleteAccount = async ({ userId }) =>
  request(api.deleteAccount, {
    params: {
      userId,
    },
  });

export const userVerifyList = async ({
  isVerified,
  pageNum = 1,
  pageSize = 10,
  registryDateFrom,
  registryDateTo,
  userId,
}) =>
  request(api.userVerifyList, {
    params: {
      isVerified,
      pageNum,
      pageSize,
      registryDateFrom,
      registryDateTo,
      userId,
    },
  });

export const userVerify = async ({ userId, isVerified }) =>
  request(api.userVerify, {
    params: {
      userId,
      isVerified,
    },
  });
