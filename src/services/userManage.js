import api from './api';
import request from './request';

export const userList = async ({
  isValid,
  pageNum = 1,
  pageSize = 10,
  registryDateFrom,
  registryDateTo,
  userId,
  email,
}) =>
  request(api.userList, {
    params: {
      isValid,
      pageNum,
      pageSize,
      registryDateFrom,
      registryDateTo,
      userId,
      email,
    },
  });

export const userResetPassword = async ({ userId }) =>
  request(api.userResetPassword, { params: { userId } });

export const userUpdateStatus = async ({ userId, isValid }) =>
  request(api.userUpdateStatus, { params: { userId, isValid } });
