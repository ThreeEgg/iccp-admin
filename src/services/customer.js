import api from './api';
import request from './request';

export const getDialogList = async ({
  pageNum,
  pageSize,
  clientUserName,
  firstChatTimeBegin,
  firstChatTimeEnd,
  lastChatTimeBegin,
  lastChatTimeEnd,
  serviceUserId,
  userId,
  userType,
}) =>
  request(api.caseChatList, {
    params: {
      pageNum,
      pageSize,
      clientUserName,
      firstChatTimeBegin,
      firstChatTimeEnd,
      lastChatTimeBegin,
      lastChatTimeEnd,
      serviceUserId,
      userId,
      userType,
    },
  });

export const getCustomerAccount = async () => request(api.customerAccount);

export const changeCustomer = async ({ serviceUserId, userId }) =>
  request.post(api.caseChangeCustomerService, {
    params: {
      serviceUserId,
      userId,
    },
  });
