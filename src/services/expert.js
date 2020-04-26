import api from './api';
import request from './request';

export const getCountryList = async ({ id }) => {
  return request(api.getCountryList, {
    params: { id },
  });
};

export const getExpertList = async ({ countryCode, serviceTagIdList = [] }) => {
  return request(api.getExpertList, {
    params: {
      countryCode,
      serviceTagIdList,
    },
  });
};

export const getExpertIndividualIntroduce = async ({ userId }) => {
  return request(api.getExpertIndividualIntroduce, {
    params: {
      userId,
    },
  });
};

export const saveExpertIndividualIntroduce = async ({ introduction }) => {
  return request.post(api.saveExpertIndividualIntroduce, {
    data: introduction,
  });
};

export const getExpertActivityList = async ({ pageNum, pageSize, userId }) => {
  return request(api.getExpertActivityList, {
    params: {
      pageNum,
      pageSize,
      userId,
    },
  });
};

export const getExpertActivityById = async ({ articleId }) => {
  return request(api.getExpertActivityById, {
    params: {
      articleId,
    },
  });
};

export const saveExpertActivity = async ({ activity }) => {
  return request.post(api.saveExpertActivity, {
    data: activity,
  });
};

export const deleteExpertActivity = async ({ id }) => {
  return request(api.deleteExpertActivity, {
    params: {
      id,
    },
  });
};

export const getExpertArticleById = async ({ id }) => {
  return request(api.getExpertArticleById, {
    params: {
      id,
    },
  });
};

export const saveExpertArticle = async ({ article, brief, title, id }) => {
  return request.post(api.saveExpertArticle, {
    data: {
      article,
      brief,
      title,
      id,
    },
  });
};

export const deleteExpertArticle = async ({ id }) => {
  return request(api.deleteExpertArticle, {
    params: {
      id,
    },
  });
};

export const getAllServiceTagList = async ({ userId }) => {
  return request(api.getAllServiceTagList, {
    params: {
      userId,
    },
  });
};

export const saveServiceTagList = async ({ serviceIdStr }) => {
  return request.post(api.saveServiceTagList, {
    params: {
      serviceIdStr,
    },
  });
};

export const getExpertInformation = async ({ userId }) => {
  return request(api.getExpertInformation, {
    params: {
      userId,
    },
  });
};

export const saveExpertInformation = async ({ content }) => {
  return request.post(api.saveExpertInformation, {
    data: content,
  });
};

export const getExpertScheduleByGreenwich = async ({ timeZone, userId }) => {
  return request(api.getExpertScheduleByGreenwich, {
    params: {
      timeZone,
      userId,
    },
  });
};

export const saveExpertSchedule = async ({ schedule, startTime, timeZone, userId }) => {
  return request.post(api.saveExpertSchedule, {
    data: {
      // 日程表字符串
      schedule,
      userId,
      timeZone,
      // 开始时间，单位为秒
      startTime,
    },
  });
};
