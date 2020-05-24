import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Form, Input } from 'antd';
import { controls, myUploadFn, validateFn } from '@/utils/const';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
import { SearchOutlined, RollbackOutlined } from '@ant-design/icons';
import router from 'umi/router';
import { getParameter } from '@/utils/const';

export class AddClassicCase extends Component {
  state = {};

  componentDidMount() {
    // getParameter('type')  1是编辑,0是新增
  }

  back = () => {
    router.goBack();
  };

  render() {
    const title = Number(getParameter('type')) === 1 ? '编辑案例' : '新增案例';

    const formProps = {
      layout: 'vertical',
      initialValues: {
        assign: 1,
        type: 1,
      },
    };

    const { TextArea } = Input;

    return (
      <PageHeaderWrapper
        title={title}
        extra={[
          <Button shape="round" icon={<RollbackOutlined />} onClick={this.back}>
            返回
          </Button>,
        ]}
      >
        <Card style={{ padding: ' 8px 10%' }}>
          <Form {...formProps} ref={this.formRef} name="classicCase" onFinish={this.onFinish}>
            <Form.Item
              name="title"
              label="标题"
              validateFirst="true"
              rules={[
                { required: true, message: '这是必填项～' },
                { type: 'string', min: 1, max: 50, message: '最多输入50个字符' },
              ]}
            >
              <Input placeholder="请输入文章标题" />
            </Form.Item>
            <Form.Item
              name="brief"
              label="简介"
              validateFirst="true"
              rules={[
                { required: true, message: '这是必填项～' },
                { type: 'string', min: 1, max: 400, message: '最多输入400个字符' },
              ]}
            >
              <TextArea placeholder="请输入文章简介" />
            </Form.Item>
            <Form.Item
              name="content"
              label="文章详情"
              validateFirst="true"
              rules={[
                { required: true, message: '这是必填项～' },
                { type: 'string', min: 1, max: 400, message: '最多输入400个字符' },
              ]}
            >
              <BraftEditor
                className="my-editor"
                controls={controls}
                placeholder="请输入文章详情"
                media={{
                  uploadFn: myUploadFn,
                  validateFn,
                }}
              />
            </Form.Item>
            <Form.Item style={{ textAlign: 'center' }}>
              <Button style={{ width: '88px' }} shape="round" type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AddClassicCase;
