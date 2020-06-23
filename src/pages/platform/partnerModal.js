import React, { Component } from 'react';
import { Form, Input, message, Modal, Radio, Select, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import * as imService from '@/services/platform';
import api from '../../services/api';

export class partnerModal extends Component {
  state = {
    visible: false,
    loading: false,
    imageUrl: '',
    data: {
      language: 'en',
    },
    title: '',
  };

  layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      /* getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      ); */
      console.log('info', info);
      const {
        file: {
          response: {
            code,
            data: { webUrl },
          },
        },
      } = info;
      if (code === '0') {
        this.setState({
          imageUrl: webUrl,
        });
      }
    }
  };

  modalShow = (type, data) => {
    if (type === 'add') {
      this.setState({
        visible: true,
        title: '新增',
      });
    } else if (type === 'update') {
      this.setState({
        visible: true,
        title: '编辑',
        data,
        imageUrl: data.image,
      });
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      imageUrl: '',
      data: {
        language: 'en',
      },
      loading: false,
    });
  };

  onFinish = params => {
    const { imageUrl } = this.state;
    if (!imageUrl) {
      message.warning('请上传logo');
      return;
    }
    this.addPartner(params);
  };

  addPartner = async params => {
    const { imageUrl, data } = this.state;
    if (!data) {
      params.type = 'partner';
      params.id = '';
    } else {
      delete params.language;
      params.id = data.id;
    }
    const { code, msg } = await imService.addPartner({
      // language: 'zh-CN',
      ...params,
      image: imageUrl,
    });
    if (code === '0') {
      message.success(msg);
      this.handleCancel();
      this.props.getList();
    }
  };

  render() {
    const uploadUrl = `/api${api.fileUpload}`;
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl, title, visible, data } = this.state;
    const { Option } = Select;
    // const {layout} = this;
    return (
      <Modal
        title={`${title}合作伙伴`}
        visible={visible}
        ref={this.formRef}
        destroyOnClose
        closable={false}
        okText={'保存'}
        okButtonProps={{
          form: 'basic',
          htmlType: 'submit',
        }}
        onCancel={this.handleCancel}
      >
        <Form
          // {...layout}
          name="basic"
          onFinish={this.onFinish}
          initialValues={data}
        >
          <Form.Item
            label="合作方"
            name="title"
            rules={[
              { required: true, message: '请输入合作方名称' },
              { type: 'string', max: 50, message: `最多输入50个字符` },
            ]}
          >
            <Input placeholder="请输入合作方名称" maxLength={50} />
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
            label="logo"
            name="image"
            rules={[{ required: true, message: '' }]}
            help="logo宽高比例建议2:1"
          >
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
              beforeUpload={beforeUpload}
              onChange={this.handleChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

export default partnerModal;
