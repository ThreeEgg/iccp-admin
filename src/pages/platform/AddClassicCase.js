import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Form, Input, message, Radio, Select, Upload } from 'antd';
import { controls, myUploadFn, validateFn } from '@/utils/const';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
import { RollbackOutlined } from '@ant-design/icons';
import router from 'umi/router';
import * as imService from '@/services/platform';
import { unescape } from 'lodash';
import api from '@/services/api';
import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined';
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined';

const { TextArea } = Input;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export class AddClassicCase extends Component {
  state = {
    title: '',
    editorState: BraftEditor.createEditorState(null),
    id: '',
    loading: false,
    imageUrl: '',
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
        imageUrl: data.image,
        editorState: BraftEditor.createEditorState(unescape(unescape(data.content))),
      });
    }
  }

  onFinish = params => {
    if (params.content.toHTML) {
      params.content = params.content.toHTML();
    }
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
    // 图片字段预处理
    if (params.image) {
      // 如果是本地上传的，则进行处理
      if (params.image.file) {
        params.image = params.image.file.response.data.webUrl;
      }
    }
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

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('Image must smaller than 10MB!');
    }
    return isJpgOrPng && isLt10M;
  };

  render() {
    const { title, data, editorState, imageUrl } = this.state;
    const { Option } = Select;

    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">上传</div>
      </div>
    );

    const uploadUrl = `/api${api.fileUpload}`;

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
              <Input placeholder="请输入标题" />
            </Form.Item>
            <Form.Item
              label="语言"
              name="language"
              rules={[{ required: true, message: '请选择语言' }]}
            >
              <Radio.Group>
                <Radio value="en">英文</Radio>
                <Radio value="zh_CN">中文</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="brief"
              label="简介"
              validateFirst="true"
              rules={[{ type: 'string', min: 1, max: 400, message: '最多输入400个字符' }]}
            >
              <TextArea placeholder="请输入简介" />
            </Form.Item>
            <Form.Item name="image" label="简介配图">
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={uploadUrl}
                headers={{ 'x-auth-token': localStorage.adminAccessToken }}
                data={{
                  uploadUserId: localStorage.userId,
                  type: 0,
                }}
                beforeUpload={this.beforeUpload}
                onChange={this.handleChange}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
            <Form.Item
              name="content"
              label="详情"
              rules={[{ required: true, message: '这是必填项～' }]}
            >
              <BraftEditor
                className="my-editor"
                controls={controls}
                placeholder="请输入详情"
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
