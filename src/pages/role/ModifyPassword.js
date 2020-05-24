import React, { Component, createRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Form, Input, message } from 'antd';
import * as userService from '@/services/user';

export class ModifyPassword extends Component {
  state = {};

  formRef = createRef();

  componentDidMount() {}

  onSubmit = fieldsValue => {
    const oldPassword = fieldsValue.old;
    const confirmPassword = fieldsValue.confirm;
    this.modifyPassword({ newPassword: confirmPassword, oldPassword });
  };

  modifyPassword = async (data = {}) => {
    const { success, message: errorMsg } = await userService.modifyPassword(data);
    if (success) {
      message.success('修改成功');
      this.setState({});
    }
  };

  render() {
    const formProps = {
      layout: 'horizontal',
      labelCol: { span: 6 },
      wrapperCol: { span: 13 },
      colon: true,
    };

    return (
      <PageHeaderWrapper title="修改密码">
        <Card style={{ padding: ' 20px 15%' }}>
          <Form
            {...formProps}
            ref={this.formRef}
            name="form-intelligent"
            onFinish={this.onSubmit}
            style={{ overflow: 'scroll' }}
          >
            {/* 原密码 */}
            <Form.Item
              name="old"
              label="原密码"
              validateFirst="true"
              rules={[
                { required: true, message: '亲，这是必填项～' },
                { type: 'string', min: 1, max: 40, message: '请输入1-40个字符' },
                {
                  pattern: new RegExp(/^[0-9a-zA-Z_]{1,}$/, 'g'),
                  message: '密码只允许包含数字、字母和下划线',
                },
              ]}
            >
              <Input.Password style={{ marginBottom: 12 }} placeholder="请输入原密码" />
            </Form.Item>
            {/* 新密码 */}
            <Form.Item
              name="new"
              label="新密码"
              validateFirst="true"
              rules={[
                { required: true, message: '亲，这是必填项～' },
                { type: 'string', min: 1, max: 40, message: '请输入1-40个字符' },
                {
                  pattern: new RegExp(/^[0-9a-zA-Z_]{1,}$/, 'g'),
                  message: '密码只允许包含数字、字母和下划线',
                },
                // { pattern: new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{1,}$/, "g"), message: '密码必须包含数字、字母' },
              ]}
              // hasFeedback
            >
              <Input.Password style={{ marginBottom: 12 }} placeholder="请输入新密码" />
            </Form.Item>
            {/* 确认密码 */}
            <Form.Item
              name="confirm"
              label="确认密码"
              validateFirst="true"
              rules={[
                { required: true, message: '亲，这是必填项～' },
                { type: 'string', min: 1, max: 40, message: '请输入1-40个字符' },
                {
                  pattern: new RegExp(/^[0-9a-zA-Z_]{1,}$/, 'g'),
                  message: '名称只允许包含数字、字母和下划线',
                },
                // { pattern: new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{1,}$/, "g"), message: '密码必须包含数字、字母' },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('new') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('两次密码输入必须相同！');
                  },
                }),
              ]}
            >
              <Input.Password style={{ marginBottom: 12 }} placeholder="确认新密码" />
            </Form.Item>

            {/* 按钮 */}
            <div style={{ textAlign: 'center' }}>
              <Button
                htmlType="submit"
                style={{ marginBottom: 12, width: '15%' }}
                type="primary"
                shape="round"
              >
                修改
              </Button>
            </div>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ModifyPassword;
