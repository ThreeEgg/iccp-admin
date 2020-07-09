import React, { Component, createRef } from 'react';
import { getParameter } from '@/utils/const.js';
import { Button, Card, Form, Input, message, Radio } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import router from 'umi/router';
import { RollbackOutlined } from '@ant-design/icons';
import * as imService from '@/services/platform';

export class NewAdd extends Component {
  state = {
    label: [],
    data: '',
  };

  actionRef = createRef();

  componentWillMount() {
    const { type, data } = this.props.location.query;
    let label = [];
    switch (type) {
      case 'commonQuestion':
        label = ['常见问题标题', '常见问题详情'];
        break;
      case 'clause':
        label = ['条款规定标题', '条款规定详情'];
        break;
      case 'helpCenter':
        label = ['帮助中心标题', '帮助中心详情'];
        break;
      default:
        break;
    }
    this.setState({
      label,
      data: data || '',
      title: data ? '编辑页面' : '新增页面',
    });
    if (data) {
      this.setState({
        title: '编辑页面',
        data,
      });
    } else {
      this.setState({
        title: '新增页面',
      });
    }
  }

  onFinish = params => {
    const type = getParameter('type');
    const supportedType = ['commonQuestion', 'clause', 'helpCenter'];
    if (supportedType.indexOf(type) > -1) {
      this.add(params);
    }
  };

  add = async params => {
    const { type, data } = this.props.location.query;

    const body = {
      type,
      ...params,
      image: '',
      id: data ? data.id : null,
    };

    if (data) {
      delete body.language;
      delete body.type;
    }

    const { msg, code } = await imService.addPartner(body);
    if (code === '0') {
      message.success(msg);
      this.actionRef.current.resetFields();
      this.back();
    }
  };

  back = () => {
    router.goBack();
  };

  render() {
    const { label, title, data } = this.state;

    return (
      <PageHeaderWrapper
        title={title}
        extra={[
          <Button shape="round" icon={<RollbackOutlined />} onClick={this.back}>
            返回
          </Button>,
        ]}
      >
        <Card>
          <Form name="basic" onFinish={this.onFinish} ref={this.actionRef} initialValues={data}>
            <Form.Item
              label={label[0]}
              name="title"
              rules={[
                { required: true, message: `请输入${label[0]}` },
                { type: 'string', max: 100, message: `最多输入100个字符` },
              ]}
            >
              <Input placeholder="最多输入100个字符" maxLength={100} allowClear />
            </Form.Item>
            <Form.Item
              label={label[0]}
              name="language"
              rules={[{ required: true, message: `请选择内容的语言` }]}
            >
              <Radio.Group disabled={!!data}>
                <Radio value="en">英文</Radio>
                <Radio value="zh_CN">中文</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="content"
              label={label[1]}
              rules={[
                { required: true, message: `请输入${label[1]}` },
                { type: 'string', max: 2000, message: `最多输入2000个字符` },
              ]}
            >
              <Input.TextArea
                placeholder="最多输入2000个字符"
                maxLength={2000}
                allowClear
                autoSize={{ minRows: 10 }}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" key="newAddBtn" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default NewAdd;
