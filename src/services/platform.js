import api from './api';
import request from './request';

export const getPlatformContent = async ({ id }) =>
  request(api.platformGet, {
    params: {
      id,
    },
  });

export const deletePlatformContent = async ({ id }) =>
  request(api.platformDelete, {
    params: {
      id,
    },
  });

export const deleteCommonProblems = async (
  { id }, // 删除常见问题
) =>
  request.post(api.platformDelete, {
    params: {
      id,
    },
  });

export const listPlatformContent = async ({
  pageNum,
  pageSize,
  createDateFrom,
  createDateTo,
  founderId,
  language,
  modifierId,
  type,
  updateDateFrom,
  updateDateTo,
}) =>
  request(api.platformList, {
    params: {
      type, // platformIntro-平台介绍 businessIntro-业务介绍 classicCase-经典案例 partner-合作伙伴 clause- 条款规定 commonQuestion-常见问题 registryAggreement-注册协议
      pageNum,
      pageSize,
      createDateFrom,
      createDateTo,
      founderId,
      language,
      modifierId,
      updateDateFrom,
      updateDateTo,
    },
  });

export const updatePlatformContent = async ({ id, content }) =>
  request.post(api.platformUpdate, {
    params: {
      id,
      content,
    },
  });

export const addPartner = async ({ type, language, id, image, title, content }) =>
  request.post(api.platformUpdate, {
    data: {
      type,
      language,
      id,
      image,
      title,
      content,
    },
  });
