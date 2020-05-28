import React, { Component, useState } from 'react'
import { Modal, Descriptions, Form, Input, Select, Upload, Button, message } from "antd"
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import api from "@/services/api"
import * as imService from '@/services/expert'

class EditForm extends Component {

  state = {
    visible: false,
    data: '',
    imageUrl: '',
    loading: false,
    continentList: '',
    countryList: ''
  }

  componentDidMount() {
    this.getContinentList()
  }

  getContinentList = async () => {
    const { data, code } = await imService.getContinentList()
    if (code === "0") {
      this.setState({
        continentList: data
      })
      this.getCountryList()
    }
  }

  getCountryList = async () => {
    const { data, code } = await imService.getCountryList({
      id: 1
    })
    if (code === "0") {
      this.setState({
        countryList: data
      })
    }
  }

  modalShow = (data) => {
    this.setState({
      visible: true,
      data
    })
  }

  modalHide = () => {
    this.setState({
      visible: false,
      data: ''
    })
  }

  onFinish = params => {
    const { imageUrl } = this.state;
    if (!imageUrl) {
      message.warning('请上传头像');
      return;
    }
    this.addExpert(params)
  }

  addExpert = async (params) => {
    const { imageUrl } = this.state;
    const { code, msg } = await imService.addExpert({
      // language: 'zh-CN',
      ...params,
      image: imageUrl,
    })
    if (code === "0") {
      message.success(msg)
      this.modalHide()
    }
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      const { file: { response: { code, data: { webUrl } } } } = info;
      if (code === "0") {
        this.setState({
          imageUrl: webUrl
        })
      }
    }
  };

  beforeUpload = file => {
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

  render() {
    const uploadUrl = `/api${api.fileUpload}`;

    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { Option } = Select
    const { visible, data, imageUrl, countryList } = this.state;
    return (
      <Modal
        // title="案件信息表"
        visible={visible}
        onCancel={this.modalHide}
        footer={null}
      >
        <Form
          // {...layout}
          name="basic"
          onFinish={this.onFinish}
          initialValues={data}
        >
          <Form.Item
            label="专家ID"
            name="userId"
            rules={[{ required: true, message: '请输入专家ID' },
            { type: 'string', max: 50, message: `最多输入50个字符` }]}
          >
            <Input placeholder="请输入专家ID" maxLength={50} />
          </Form.Item>

          <Form.Item
            label="专家姓名"
            name="name"
            rules={[{ required: true, message: '请输入专家名称' },
            { type: 'string', max: 50, message: `最多输入50个字符` }]}
          >
            <Input placeholder="请输入专家名称" maxLength={50} />
          </Form.Item>

          <Form.Item
            label="专家邮箱"
            name="email"
            rules={[{ required: true, message: '请输入邮箱' },
            { type: 'string', max: 50, message: `最多输入50个字符` },
            { pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, message: '请输入正确的邮箱' }
            ]}
          >
            <Input placeholder="请输入邮箱" maxLength={50} />
          </Form.Item>

          <Form.Item label="专家头像">
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
              beforeUpload={this.beforeUpload}
              onChange={this.handleChange}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>

          </Form.Item>

          <Form.Item
            label="专家国籍"
            name="countryCode"
            rules={[{ required: true, message: '请选择国籍' }]}
          >
            <Select
              style={{
                width: '100%',
              }}
            >{
                countryList && countryList.map(item => (
                  <Option key={item.id} value={item.countryCode}>{item.fullCname}</Option>
                ))
              }
              <Option value="en">英文</Option>
              <Option value="zh-CN">中文</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="所属公司"
            name="companyName"
            rules={[{ type: 'string', max: 50, message: `最多输入50个字符` }]}
          >
            <Input placeholder="请输入所属公司" maxLength={50} />
          </Form.Item>

          <Form.Item
            label="职务"
            name="position"
            rules={[{ type: 'string', max: 50, message: `最多输入50个字符` }]}
          >
            <Input placeholder="请输入职务" maxLength={50} />
          </Form.Item>

          <Button key="submit" type="primary" htmlType="submit">
            保存
            </Button>,
            <Button key="back" onClick={this.modalHide}>
            取消
            </Button>
        </Form>
      </Modal>
    )
  }
}

export default EditForm
