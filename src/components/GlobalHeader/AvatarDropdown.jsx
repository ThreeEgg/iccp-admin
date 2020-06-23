import { LogoutOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, Row } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import './index.less';

class AvatarDropdown extends React.Component {
  onMenuClick = event => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'user/logout',
        });
      }
      return;
    }
    router.push(`/account/${key}`);
  };

  modifyPassword = () => {
    router.push(`/system/modifyPassword`);
  };

  render() {
    const {
      userInfo = {
        image: '',
        name: '',
      },
      // menu,
    } = this.props;

    const menuHeaderDropdown = (
      <Menu className="menu" selectedKeys={[]} onClick={this.onMenuClick}>
        {/* {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <SettingOutlined />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />} */}
        {/* <Menu.Item key="password">
          <LogoutOutlined />
          修改密码
        </Menu.Item>
        <Menu.Divider /> */}
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );

    return userInfo && userInfo.name ? (
      <Row>
        <a style={{ color: '#666' }} onClick={this.modifyPassword}>
          修改密码
        </a>
        <HeaderDropdown overlay={menuHeaderDropdown}>
          <span className="action account">
            <Avatar size="small" className="avatar" src={userInfo.image} alt="avatar" />
            <span className="name">{userInfo.name}</span>
          </span>
        </HeaderDropdown>
      </Row>
    ) : (
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    );
  }
}

export default connect(({ user }) => ({
  userInfo: user.userInfo,
}))(AvatarDropdown);
