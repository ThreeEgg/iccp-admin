import React, { Component } from 'react';
import { Modal, Form, Input, Button, Select, message } from 'antd';
import * as imService from '@/services/system';

export default class AccountModal extends Component {
  state = {
    visible: false,
    title: '',
    isAdd: true,
    roleList: [],
    data: '',
  };

  componentDidMount() {
    this.getRoleList();
  }

  getRoleList = async () => {
    const {
      data: { roleList },
      code,
    } = await imService.getRoleList();
    if (code === '0') {
      this.setState({
        roleList,
      });
    }
  };

  modalShow = (type, data) => {
    if (type === 'add') {
      this.setState({
        visible: true,
        title: '新增账号',
        isAdd: true,
      });
    } else if (type === 'update') {
      this.setState({
        visible: true,
        title: '编辑账号',
        isAdd: false,
        data,
      });
    }
  };

  modalHidden = () => {
    this.setState({
      visible: false,
      data: '',
    });
  };

  onFinish = params => {
    this.addAccount(params);
  };

  addAccount = async params => {
    // 新增和更新账户
    const { data, isAdd } = this.state;
    const userId = isAdd ? '' : data.userId;
    const { code, msg } = await imService.addAccount({
      ...params,
      userId,
    });
    if (code === '0') {
      message.success(msg);
      this.props.getAccountList.current.reload();
      this.modalHidden();
    }
  };

  render() {
    const { Option } = Select;
    const { title, visible, account, isAdd, roleList, data } = this.state;
    return (
      <Modal
        title={title}
        visible={visible}
        onCancel={this.modalHidden}
        okButtonProps={{
          form: 'accountForm',
          htmlType: 'submit',
        }}
        destroyOnClose
      >
        <Form name="accountForm" onFinish={this.onFinish} initialValues={data}>
          {!isAdd && (
            <Form.Item
              label="账号"
              name="userId"
              rules={[{ required: true, message: `请选择角色` }]}
            >
              <Input disabled placeholder={account} />
            </Form.Item>
          )}
          <Form.Item
            name="roleName"
            label="请选择角色"
            rules={[{ required: true, message: `请选择角色` }]}
          >
            {/* <Input.Group > */}
            <Select placeholder="请选择角色" style={{ width: '80%' }}>
              {roleList.map(item => (
                <Option value={item.roleName} key={item.id}>
                  {item.description}
                </Option>
              ))}
            </Select>
            {/* </Input.Group> */}
          </Form.Item>
          <Form.Item
            label="名称"
            name="name"
            rules={[
              { required: true, message: `请输入名称` },
              { type: 'string', max: 20, message: '最多输入20个字符' },
            ]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
