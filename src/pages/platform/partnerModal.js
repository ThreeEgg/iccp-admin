import React, { Component } from 'react'
import { Modal, Form, Input, Button, Upload, message, Select } from "antd"
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import * as imService from '@/services/platform'
import api from "../../services/api"

export class partnerModal extends Component {

  state = {
    visible: false,
    loading: false,
    imageUrl: '',
    data: '',
    title: ''
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
      /* getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      ); */
      console.log('info', info)
      const { file: { response: { code, data: { webUrl } } } } = info;
      if (code === "0") {
        this.setState({
          imageUrl: webUrl
        })
      }
    }
  };

  modalShow = (type, data) => {
    if (type === "add") {
      this.setState({
        visible: true,
        title: '新增'
      });
    } else if (type === "update") {
      this.setState({
        visible: true,
        title: '编辑',
        data,
        imageUrl: data.image
      });
    }

  }

  handleCancel = () => {
    this.setState({
      visible: false,
      imageUrl: ''
    });
  };

  onFinish = (params) => {
    const { imageUrl } = this.state;
    if (!imageUrl) {
      message.warning('请上传logo');
      return;
    }
    this.addPartner(params)
  }

  addPartner = async (params) => {
    const { imageUrl, data } = this.state;
    const { code, msg } = await imService.addPartner({
      type: 'partner',
      // language: 'zh-CN',
      ...params,
      image: imageUrl,
      id: data.id
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
    const { imageUrl, title, visible, data } = this.state;
    const { Option } = Select
    // const {layout} = this;
    return (
      <Modal
        title={`${title}合作伙伴`}
        visible={visible}
        ref={this.formRef}
        destroyOnClose
        footer={
          null
        }
        closable={false}
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
            rules={[{ required: true, message: '请输入合作方名称' },
            { type: 'string', max: 50, message: `最多输入50个字符` }]}
          >
            <Input placeholder="请输入合作方名称" maxLength={50} />
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
            >
              <Option value="en">英文</Option>
              <Option value="zh-CN">中文</Option>
            </Select>
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
                  uploadUserId: localStorage.userId,
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
