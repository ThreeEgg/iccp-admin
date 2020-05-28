import React, { Component, useState } from 'react'
import { Modal, Form, Input, Select, Upload, Button, message } from "antd"
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import api from "@/services/api"

const EditForm = () => {

  const [visible, setVisible] = useState(false)
  const [data, setData] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const modalShow = (params) => {
    setVisible(true)
    setData(params)
  }

  const modalHide = () => {
    setVisible(false)
  }

  const onFinish = params => {

  }

  const handleChange = () => {

  }

  const beforeUpload = file => {
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

  // render() {
  const uploadUrl = `/api${api.fileUpload}`;

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  const { Option } = Select
  return (
    <Modal
      // title="案件信息表"
      visible={visible}
      onCancel={modalHide}
      footer={null}
    >
      {/* <Form
        // {...layout}
        name="basic"
        onFinish={onFinish}
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
            onChange={handleChange}
          >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>

        </Form.Item>
        <Button key="submit" type="primary" htmlType="submit">
          保存
            </Button>,
            <Button key="back" onClick={modalHide}>
          取消
            </Button>
      </Form> */}
    </Modal>
  )
  // }
}

export default EditForm
