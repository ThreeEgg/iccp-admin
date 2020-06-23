import api from './api';
import request from './request';

export const requestIMId = async ({ guestId }) =>
  request(api.requestIMId, {
    params: {
      guestId,
    },
  });

export const checkFirstChat = async ({ expertAccid, userAccid }) =>
  request(api.checkFirstChat, {
    params: {
      expertAccid,
      userAccid,
    },
  });

export const checkFirstChatForCustomerService = async ({ accid, serviceAccid }) =>
  request(api.checkFirstChatForCustomerService, {
    params: {
      accid,
      serviceAccid,
    },
  });

export const recentChatList = async ({ accid, pageNum, pageSize }) =>
  request(api.recentChatList, {
    params: {
      accid,
      pageNum,
      pageSize,
    },
  });

export const receiveMsg = async ({ from, to }) =>
  request.post(api.receiveMsg, {
    params: {
      fromAccount: from,
      toAccount: to,
    },
  });

export const getCaseInfo = async ({ caseId, clientUserId, expertUserId }) =>
  request(api.getCaseInfo, {
    params: {
      caseId,
      clientUserId,
      expertUserId,
    },
  });

export const saveCaseInfo = async extIccpCase =>
  request.post(api.saveCaseInfo, {
    data: extIccpCase,
  });

export const saveOrder = async ({ clientUserId, expertExplain }) =>
  request.post(api.saveOrder, {
    params: {
      clientUserId,
      expertExplain,
    },
  });

export const historyChatMsg = async ({ chatId, pageNum, pageSize }) =>
  request.post(api.historyChatMsg, {
    params: {
      chatId,
      pageNum,
      pageSize,
    },
  });

export const downloadCaseBatch = async ({ caseId }) =>
  request(api.downloadCaseBatch, {
    params: {
      caseId,
    },
    responseType: 'blob',
  });

export const getTranslate = async ({ msgidClient }) =>
  request.post(api.getTranslate, {
    params: {
      msgidClient,
    },
  });

export const getExpertUserRating = async ({ expertUserId }) =>
  request.post(api.getExpertUserRating, {
    params: {
      expertUserId,
    },
  });

export const saveExpertUserRating = async ({ expertUserId, attitudeRating, skillRating }) =>
  request.post(api.saveExpertUserRating, {
    params: {
      expertUserId,
      attitudeRating,
      skillRating,
    },
  });

export const getChatList = async ({
  pageNum,
  pageSize,
  clientUserName,
  expertUserName,
  firstChatTimeBegin,
  firstChatTimeEnd,
  lastChatTimeBegin,
  lastChatTimeEnd,
}) =>
  request(api.caseUserChatList, {
    params: {
      pageNum,
      pageSize,
      clientUserName,
      expertUserName,
      firstChatTimeBegin,
      firstChatTimeEnd,
      lastChatTimeBegin,
      lastChatTimeEnd,
    },
  });

export const getChatRecord = async ({ chatId, pageNum, pageSize }) =>
  request(api.chatRecord, {
    params: {
      chatId,
      pageNum,
      pageSize,
    },
  });

export const getNoticeList = async ({
  pageNum,
  pageSize,
  clientUserName,
  createTimeBegin,
  createTimeEnd,
  expertUserName,
}) =>
  request(api.caseList, {
    params: {
      pageNum,
      pageSize,
      clientUserName,
      createTimeBegin,
      createTimeEnd,
      expertUserName,
    },
  });
