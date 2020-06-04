import React, { Component } from 'react';
import router from 'umi/router';
import { message, Card, Button, Form, Input } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
import { controls, myUploadFn, validateFn } from '@/utils/const';
import { SearchOutlined, RollbackOutlined } from '@ant-design/icons';
import * as imService from '@/services/platform';

export default class introduction extends Component {
  state = {
    type: '',
    data: '',
    title: '',
    id: '',
    editorState: BraftEditor.createEditorState(null),
  };

  componentWillMount() {
    const { data, type } = this.props.location.query;
    if (type === 'platformIntro') {
      this.setState({
        type,
        data,
        title: '平台介绍编辑',
        id: data.id,
      });
    } else if (type === 'businessIntro') {
      this.setState({
        type,
        data,
        title: '业务介绍编辑',
        id: data.id,
      });
    }
    this.setState({
      editorState: BraftEditor.createEditorState(data.content),
    });
  }

  back = () => {
    router.goBack();
  };

  onFinish = params => {
    this.updateIntroduction({ content: params.content.toHTML() });
  };

  updateIntroduction = async params => {
    const { id } = this.state;
    const { code, msg } = await imService.addPartner({
      id,
      // type,
      ...params,
    });
    if (code === '0') {
      message.success(msg);
      this.back();
    }
  };

  render() {
    const { title, data, editorState } = this.state;
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
          <Form ref={this.formRef} name="classicCase" initialValues={data} onFinish={this.onFinish}>
            <Form.Item
              name="content"
              label="文章详情"
              // validateFirst="true"
              rules={[
                { required: true, message: '这是必填项～' },
                // { type: 'string', min: 1, max: 800, message: '最多输入800个字符' },
              ]}
            >
              <BraftEditor
                ref={this.braftEditor}
                className="my-editor"
                defaultValue={editorState}
                controls={controls}
                placeholder="请输入文章详情"
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
