import React, { Component, createRef } from 'react';
import { getParameter } from '@/utils/const.js';
import { Button, Form, Input, message } from 'antd';
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
    if (type === 'commonQuestion') {
      // 常见问题
      this.setState({
        label: ['常见问题标题', '常见问题详情'],
      });
    } else if (type === 'clause') {
      // 条款规定
      this.setState({
        label: ['条款规定标题', '条款规定详情'],
      });
    }
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
    if (getParameter('type') === 'commonQuestion') {
      this.addCommonProblems(params);
    } else if (getParameter('type') === 'clause') {
      this.addClause(params);
    }
  };

  addCommonProblems = async params => {
    const { title, content } = params;
    const { msg, code } = await imService.addPartner({
      type: 'commonQuestion',
      language: 'zh_CN',
      title,
      content,
      id: '',
      image: '',
    });
    if (code === '0') {
      message.success(msg);
      this.actionRef.current.resetFields();
      this.back();
    }
  };

  addClause = async params => {
    const { msg, code } = await imService.addPartner({
      type: 'clause',
      language: 'zh_CN',
      ...params,
      id: '',
      image: '',
    });
    if (code === '0') {
      message.success(msg);
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
        <Form name="basic" onFinish={this.onFinish} ref={this.actionRef} initialValues={data}>
          <Form.Item
            label={label[0]}
            name="title"
            rules={[
              { required: true, message: `请输入${label[0]}` },
              { type: 'string', max: 100, message: `最多输入100个字符` },
            ]}
          >
            <Input placeholder="最多输入100个字符" maxLength={100} />
          </Form.Item>
          <Form.Item
            name="content"
            label={label[1]}
            rules={[
              { required: true, message: `请输入${label[1]}` },
              { type: 'string', max: 2000, message: `最多输入2000个字符` },
            ]}
          >
            <Input.TextArea placeholder="最多输入2000个字符" maxLength={2000} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </PageHeaderWrapper>
    );
  }
}

export default NewAdd;
