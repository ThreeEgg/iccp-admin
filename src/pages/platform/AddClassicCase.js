import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Form, Input, message, Select } from 'antd';
import { controls, myUploadFn, validateFn } from '@/utils/const';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
import { RollbackOutlined } from '@ant-design/icons';
import router from 'umi/router';
import * as imService from '@/services/platform';
import { unescape } from 'lodash';

export class AddClassicCase extends Component {
  state = {
    title: '',
    editorState: BraftEditor.createEditorState(null),
    id: '',
  };

  componentWillMount() {
    // getParameter('type')  1是编辑,0是新增
    const { data, type } = this.props.location.query;
    if (type === 0) {
      this.setState({
        data,
        title: '新增案例',
        id: '',
      });
    } else if (type === 1) {
      this.setState({
        data,
        title: '编辑案例',
        id: data.id,
        editorState: BraftEditor.createEditorState(unescape(unescape(data.content))),
      });
    }
  }

  onFinish = params => {
    params.content = params.content.toHTML();
    this.updateCase(params);
  };

  updateCase = async params => {
    const { id } = this.state;
    console.log(id, params);
    if (id) {
      delete params.language;
    } else {
      params.type = 'classicCase';
    }
    console.log(params);
    const { code, msg } = await imService.addPartner({
      id,
      ...params,
    });
    if (code === '0') {
      message.success(msg);
      this.back();
      this.setState({
        id: '',
      });
    }
  };

  back = () => {
    router.goBack();
  };

  render() {
    const { title, data, editorState, id } = this.state;
    const { Option } = Select;

    // const { TextArea } = Input;

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
          <Form initialValues={data} ref={this.formRef} name="classicCase" onFinish={this.onFinish}>
            <Form.Item
              name="title"
              label="标题"
              rules={[
                { required: true, message: '这是必填项～' },
                { type: 'string', min: 1, max: 50, message: '最多输入50个字符' },
              ]}
            >
              <Input placeholder="请输入文章标题" />
            </Form.Item>
            <Form.Item
              label="语言"
              name="language"
              rules={[{ required: true, message: '请选择语言' }]}
            >
              <Select
                style={{
                  width: '100%',
                }}
                disabled={id ? true : false}
              >
                <Option value="en">英文</Option>
                <Option value="zh_CN">中文</Option>
              </Select>
            </Form.Item>
            {/* <Form.Item
              name="brief"
              label="简介"
              validateFirst="true"
              rules={[
                { required: true, message: '这是必填项～' },
                { type: 'string', min: 1, max: 400, message: '最多输入400个字符' },
              ]}
            >
              <TextArea placeholder="请输入文章简介" />
            </Form.Item> */}
            <Form.Item
              name="content"
              label="文章详情"
              rules={[{ required: true, message: '这是必填项～' }]}
            >
              <BraftEditor
                className="my-editor"
                controls={controls}
                placeholder="请输入文章详情"
                defaultValue={editorState}
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
