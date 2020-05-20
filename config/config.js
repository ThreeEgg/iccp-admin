import slash from 'slash2';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import themePluginConfig from './themePluginConfig';
import proxy from './proxy';
import webpackPlugin from './plugin.config';

const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { REACT_APP_ENV } = process.env;
const plugins = [
  ['umi-plugin-antd-icon-config', {}],
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];
export default {
  plugins,
  hash: false,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/expert/list',
            }, // {
            //   path: '/admin',
            //   name: 'admin',
            //   icon: 'crown',
            //   component: './Admin',
            //   authority: ['admin'],
            //   routes: [
            //     {
            //       path: '/admin/sub-page',
            //       name: 'sub-page',
            //       icon: 'smile',
            //       component: './Welcome',
            //       authority: ['admin'],
            //     },
            //   ],
            // },
            // {
            //   name: 'list.table-list',
            //   icon: 'table',
            //   path: '/list',
            //   component: './ListTableList',
            // },
            {
              name: '专家管理',
              path: '/expert',
              routes: [
                {
                  name: '专家列表',
                  path: '/expert/list',
                  component: './expertList',
                  authority: ['admin'],
                },
              ],
            },
            {
              name: '用户管理',
              path: '/user',
              routes: [
                {
                  name: '用户列表',
                  path: '/user/list',
                  component: './CustomerServiceList',
                  authority: ['admin'],
                },
              ],
            },
            {
              name: '聊天管理',
              path: '/im',
              routes: [
                {
                  name: '案件通知',
                  path: '/im/case',
                  component: './CustomerServiceList',
                  authority: ['admin'],
                },
                {
                  name: '聊天列表',
                  path: '/im/list',
                  component: './CustomerServiceList',
                  authority: ['admin'],
                },
              ],
            },
            {
              name: '客服管理',
              path: '/customService',
              routes: [
                {
                  name: '全部对话列表',
                  path: '/customService/list',
                  component: './CustomerServiceList',
                  authority: ['admin'],
                },
                {
                  name: '我的对话',
                  path: '/customService/myChatList',
                  component: './CustomerServiceList',
                  authority: ['admin'],
                },
              ],
            },
            {
              name: '聊天',
              path: '/chat',
              routes: [
                {
                  name: '聊天记录',
                  path: '/chat/history',
                  component: './History',
                  // authority: ['admin'],
                },
                {
                  name: '全部对话',
                  path: '/chat/im',
                  component: './IM',
                  // authority: ['admin'],
                },
              ],
            },
            {
              name: '平台内容管理',
              path: '/platform',
              routes: [
                {
                  name: '平台介绍',
                  path: '/platform/introduction',
                  component: './CustomerServiceList',
                  authority: ['admin'],
                },
                {
                  name: '业务介绍',
                  path: '/platform/business',
                  component: './CustomerServiceList',
                  authority: ['admin'],
                },
                {
                  name: '常见问题',
                  path: '/platform/problems',
                  component: './CustomerServiceList',
                  authority: ['admin'],
                },
                {
                  name: '合作伙伴',
                  path: '/platform/cooperation',
                  component: './CustomerServiceList',
                  authority: ['admin'],
                },
                {
                  name: '条款规定',
                  path: '/platform/regulation',
                  component: './CustomerServiceList',
                  authority: ['admin'],
                },
                {
                  name: '经典案例',
                  path: '/platform/case',
                  component: './CustomerServiceList',
                  authority: ['admin'],
                },
              ],
            },
            {
              name: '系统管理',
              path: '/system',
              routes: [
                {
                  name: '角色管理',
                  path: '/system/role',
                  component: './History',
                  // authority: ['admin'],
                },
                {
                  name: '账号管理',
                  path: '/system/account',
                  component: './History',
                  // authority: ['admin'],
                },
                {
                  name: '数据统计',
                  path: '/system/statistic',
                  component: './History',
                  // authority: ['admin'],
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  define: {
    REACT_APP_ENV: REACT_APP_ENV || false,
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: false,
  cssLoaderOptions: {
    modules: false,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/admin',
  },
  base: '/admin/',
  publicPath: '/admin/',
  proxy: proxy[REACT_APP_ENV || 'dev'],
  chainWebpack: webpackPlugin,
  base: '/admin',
  treeShaking: true,
  disableCSSModules: true,
};
