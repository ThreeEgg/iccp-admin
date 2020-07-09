import { Dropdown } from 'antd';
import React from 'react';
import classNames from 'classnames';
import './index.less';

const HeaderDropdown = ({ overlayClassName: cls, ...restProps }) => (
  <Dropdown
    overlayStyle={{ height: 'auto', overflow: 'initial' }}
    overlayClassName={classNames('container', cls)}
    {...restProps}
  />
);

export default HeaderDropdown;
