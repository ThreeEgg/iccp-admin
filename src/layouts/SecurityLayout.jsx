import React from 'react';
import { connect } from 'dva';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { getAuthorityToken } from '@/common/authority';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    if (this.props.initAuthority) {
      return;
    }

    // 判断本地登录态
    if (getAuthorityToken()) {
      // 同步取出本地的用户、im信息
      this.props.dispatch({
        type: 'user/save',
        payload: {
          userInfo: localStorage.userInfo ? JSON.parse(localStorage.userInfo) : {},
          imInfo: localStorage.imInfo ? JSON.parse(localStorage.imInfo) : {},
          isLogin: localStorage.isLogin > 0,
        },
      });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, isLogin } = this.props;

    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!isLogin && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`} />;
    }

    return children;
  }
}

export default connect(({ user, loading }) => ({
  isLogin: user.isLogin,
  loading: loading.models.user,
}))(SecurityLayout);
