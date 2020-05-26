import React, { Component } from 'react'
import { Modal, Form, Input, Button, Upload, message } from "antd"
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import * as imService from '@/services/platform'
import api from "../../services/api"

export class partnerModal extends Component {

  state = {
    visible: false,
    loading: false,
    imageUrl: ''
  }


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
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  modalShow = () => {
    this.setState({
      visible: true,
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  onFinish = (params) => {
    const { imageUrl } = this.state;
    if (!imageUrl) {
      message.warning('请上传头像');
      return;
    }
    this.addPartner(params)
  }

  addPartner = async (params) => {
    const { imageUrl } = this.state;
    const { data } = await imService.addPartner({
      type: 'partner',
      language: 'zh-CN',
      ...params,
      image: ''
    })
    console.log(data)
    /* this.setState({
      list:items
    }) */
  }

  render() {
    const uploadUrl = `/api${api.fileUpload}`;
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;
    const { visible } = this.state;
    // const {layout} = this;
    return (
      <Modal
        title="合作伙伴"
        visible={visible}
        ref={this.formRef}
        footer={
          null
        }
        closable={false}
      >
        <Form
          // {...layout}
          name="basic"
          onFinish={this.onFinish}
        >
          <Form.Item
            label="合作方"
            name="title"
            rules={[{ required: true, message: '请输入专家名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Upload
              name="file"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action={uploadUrl}
              headers={
                { 'x-auth-token': localStorage.accessToken }
              }
              data={
                {
                  uploadUserId: 'admin',
                  type: 0
                }
              }
              beforeUpload={beforeUpload}
              onChange={this.handleChange}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>

          </Form.Item>
          <Button key="submit" type="primary" htmlType="submit">
            保存
            </Button>,
            <Button key="back" onClick={this.handleCancel}>
            取消
            </Button>
        </Form>
      </Modal>
    )
  }
}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
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

export default partnerModal
