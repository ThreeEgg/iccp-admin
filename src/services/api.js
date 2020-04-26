import config from '../config';

export default {
  baseUrl: config.baseUrl,
  //用户管理
  registry: '/user/registry',
  getRegistryAgreement: '/user/registry-agreement',
  login: '/user/login',
  logout: '/user/logout',
  getUserInfo: '/user/userinfo',
  modifyPassword: '/user/password/update',
  modifyUserName: '/user/name/update',
  resetPassword: '/user/reset-passwd',
  requestEmailForResetPassword: '/user/request-passwd-reset',

  //专家管理
  getExpertList: '/expert/list',
  getExpertHomePage: '/expert/index',
  getExpertRating: '/expert/rating',
  getExpertUserRating: '/expert/user-rating/get',
  saveExpertUserRating: '/expert/user-rating/update',
  getExpertIndividualIntroduce: '/expert/introduction',
  saveExpertIndividualIntroduce: '/expert/introduction/update',
  getExpertActivityList: '/expert/activity/list',
  getExpertActivityById: '/expert/activity/get',
  saveExpertActivity: '/expert/activity/create',
  deleteExpertActivity: '/expert/activity/delete',
  getExpertArticleList: '/expert/article/list',
  getExpertArticleById: '/expert/article/get',
  saveExpertArticle: '/expert/article/update',
  deleteExpertArticle: '/expert/article/delete',
  getAllServiceTagList: '/expert/service/list',
  getServiceTagList: '/expert/service/list',
  saveServiceTagList: '/expert/service/update',
  getExpertInformation: '/expert/information',
  saveExpertInformation: '/expert/information/update',
  getExpertScheduleByGreenwich: '/expert/schedule',
  saveExpertSchedule: '/expert/schedule/update',

  //聊天管理
  requestIMId: '/im/request-imid',
  checkFirstChat: '/im/check-welcome',
  checkFirstChatForCustomerService: '/im/check-welcome-service',
  recentChatList: '/im/recent-chat',
  receiveMsg: '/im/receiveMsg',
  getCaseInfo: '/case/get',
  saveCaseInfo: '/case/update',
  saveOrder: '/order/create',
  historyChatMsg: '/im/chat-history',
  getTranslate: '/support/translate',
  downloadCaseBatch: '/support/downloadBatch',

  // 平台内容管理
  getPlatformContent: '/platform/get',
  deletePlatformContent: '/platform/delete',
  listPlatformContent: '/platform/list',
  updatePlatformContent: '/platform/update',

  // 其他
  getServiceList: '/service/list',
  fileUpload: '/support/upload',
  getContinentList: '/system/continent/list',
  getCountryList: '/system/country/list',

  // 后台管理
  getChatList: '/system/chatlist/list',
};
