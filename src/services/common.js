/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-27 17:29:30
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-04-04 15:22:18
 * @FilePath: \PC端-前端\src\services\common.js
 */
import api from './api';
import request from './request';

/**
 *
 * @param {*} file File类型
 */
export const fileUpload = async ({ clientUserId, expertUserId, file, fileName, type = 0 }) => {
  const form = new FormData();
  form.append('file', file, fileName);

  let userInfo = window.localStorage.getItem('userInfo');
  if (!userInfo) {
    throw new Error('userInfo not exist');
  }
  userInfo = JSON.parse(userInfo);
  const uploadUserId = userInfo.userId;

  return request.post(api.fileUpload, {
    params: {
      clientUserId,
      expertUserId,
      type,
      uploadUserId,
    },
    data: form,
  });
};

export const getServiceList = async () => {
  return request(api.getServiceList);
};
