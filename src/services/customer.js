import api from './api';
import request from './request';

export const getDialogList = async ({ pageNum,pageSize,clientUserName,firstChatTimeBegin,
  firstChatTimeEnd,lastChatTimeBegin,lastChatTimeEnd,serviceUserId,userId,userType }) => {
  return request(api.caseChatList, {
    params: {
      pageNum,pageSize,clientUserName,firstChatTimeBegin,
  firstChatTimeEnd,lastChatTimeBegin,lastChatTimeEnd,serviceUserId,userId,userType
    },
  });
};