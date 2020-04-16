import api from './api';
import request from './request';

export const getChatList = async params => {
  return request(api.getChatList, {
    params,
  });
};
