import api from './api';
import request from './request';

export const getPlatformContent = async ({ id }) => {
  return request(api.getPlatformContent, {
    params: {
      id,
    },
  });
};

export const deletePlatformContent = async ({ id }) => {
  return request(api.deletePlatformContent, {
    params: {
      id,
    },
  });
};

export const listPlatformContent = async ({ languageId, type, pageNum, pageSize }) => {
  return request(api.listPlatformContent, {
    params: {
      type, // platformIntro-平台介绍 businessIntro-业务介绍 classicCase-经典案例 partner-合作伙伴 clause- 条款规定 commonQuestion-常见问题 registryAggreement-注册协议
      languageId,
      pageNum,
      pageSize,
    },
  });
};

export const updatePlatformContent = async ({ id, content }) => {
  return request.post(api.updatePlatformContent, {
    params: {
      id,
      content,
    },
  });
};
