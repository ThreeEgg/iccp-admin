import router from 'umi/router';
import { message } from 'antd';
import { stringify } from 'querystring';
import * as userService from '@/services/user';
import { setAuthority, updateAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

export default {
  namespace: 'user',
  state: {
    initAuthority: false,
    userInfo: {},
    imInfo: {},
    isLogin: false,
    currentAuthority: 'admin',
    isService: false,
  },
  effects: {
    *updateUserInfo({ userInfo }, { put, call }) {
      let newUserInfo = userInfo;
      let update = false;
      if (!userInfo) {
        update = true;
        const res = yield call(userService.getUserInfo);

        if (res.code === '0') {
          newUserInfo = res.data;
        } else {
          return;
        }
      }
      const { baseInfo, imInfo, roles, accessToken } = newUserInfo;

      const isService = !!roles.find(role => role.roleType === 'service');

      if (!update) {
        setAuthority({
          userInfo: baseInfo,
          imInfo,
          accessToken,
          isLogin: 1,
          platform: 'admin',
          userId: baseInfo.userId,
          isService: isService ? 1 : 0,
        });
      } else {
        updateAuthority({
          userInfo: baseInfo,
          imInfo,
          accessToken,
          isLogin: 1,
          platform: 'admin',
          userId: baseInfo.userId,
          isService: isService ? 1 : 0,
        });
      }

      yield put({
        type: 'save',
        payload: {
          accessToken,
          userInfo: baseInfo,
          imInfo,
          roles,
          isService,
          isLogin: true,
        },
      });
    },
    *login({ payload }, { put, call }) {
      const { password, platform = 'admin', userName } = payload;
      const res = yield call(userService.login, { password, platform, userName });

      if (res.code === '0') {
        message.success('登录成功');

        yield put({
          type: 'updateUserInfo',
          userInfo: res.data,
        });

        router.replace('/');
      }
    },

    *logout(_, { put }) {
      // FIXME: 2020.4.1 wph 无法异步登出
      // userService.logout();

      localStorage.removeItem('userInfo');
      localStorage.removeItem('imInfo');
      localStorage.removeItem('isLogin');
      localStorage.removeItem('adminAccessToken');

      // Cookie.remove('userId');
      // Cookie.remove('token');

      yield put({
        type: 'save',
        payload: {
          userInfo: {},
          imInfo: {},
          isLogin: false,
        },
      });

      const { redirect } = getPageQuery(); // Note: There may be security issues, please note

      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },

    *register({ payload }, { call }) {
      const { email, password } = payload;
      const res = yield call(userService.registry, { email, password });

      if (res.code === '0') {
        message.success('注册成功');

        router.replace('/login');
      }
    },

    *requestEmailForResetPassword({ payload }, { call }) {
      const { email, callback } = payload;
      const res = yield call(userService.requestEmailForResetPassword, { email });

      if (res.code === '0') {
        message.success('找回密码的连接已发送至邮箱账号，请前往邮箱找回密码。');

        callback && callback();
      }
    },

    *resetPassword({ payload }, { call }) {
      const { newPassword, verifyCode } = payload;
      const res = yield call(userService.resetPassword, { newPassword, verifyCode });

      if (res.code === '0') {
        message.success('密码修改成功');

        if (localStorage.platform === 'expert') {
          return router.replace('/expert/home');
        }
        router.replace('/');
      }
    },

    *modifyPassword({ payload }, { call }) {
      const { newPassword, oldPassword } = payload;
      const res = yield call(userService.modifyPassword, { newPassword, oldPassword });

      if (res.code === '0') {
        message.success('密码修改成功');

        if (localStorage.platform === 'expert') {
          return router.replace('/expert/home');
        }
        router.replace('/');
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
