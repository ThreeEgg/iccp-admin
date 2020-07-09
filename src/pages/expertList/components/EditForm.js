import React, { Component } from 'react';
import { Button, Cascader, Form, Input, message, Modal, Select, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import api from '@/services/api';
import * as imService from '@/services/expert';

class EditForm extends Component {
  state = {
    visible: false,
    data: '',
    imageUrl: '',
    loading: false,
    continentList: '',
    countryList: '',
    id: '',
    currentData: '',
  };

  componentDidMount() {
    this.getContinentList();
  }

  getContinentList = async () => {
    const { data, code } = await imService.getContinentList();
    if (code === '0') {
      data.map(item => {
        item.label = item.cn_name;
        item.value = item.id;
        item.isLeaf = false;
      });
      /* data.forEach(item => {
        this.getCountryList(item.id)
      }) */
      this.setState({
        continentList: data,
      });
    }
  };

  getCountryList = async acceptId => {
    const { continentList, id } = this.state;
    // if(!id) return;
    const { data, code } = await imService.getCountryList({
      id: acceptId,
    });
    if (code === '0') {
      data.forEach(item => {
        item.label = item.fullCname;
        item.value = item.countryCode;
      });
      this.setState({
        currentData: data,
      });
    }
  };

  loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // load options lazily
    console.log('selectedOptions', selectedOptions);
    await this.getCountryList(selectedOptions[0].id);
    targetOption.loading = false;
    const { currentData } = this.state;
    targetOption.children = currentData;
    this.setState({
      continentList: [...this.state.continentList],
    });
  };

  onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    this.getCountryList(value[0]);
    /* this.setState(
      {
        id: value[0],
      },
      () => {

      },
    ); */
  };

  modalShow = data => {
    this.setState({
      visible: true,
      data,
    });
  };

  modalHide = () => {
    this.setState({
      visible: false,
      data: '',
      imageUrl: '',
    });
  };

  // FIXME:
  onFinish = params => {
    const { imageUrl } = this.state;
    if (!imageUrl) {
      message.warning('请上传头像');
      return;
    }
    this.addExpert(params);
  };

  addExpert = async params => {
    const { imageUrl } = this.state;
    console.log('params', params, imageUrl);
    const countryCode = params.countryCode[1];
    delete params.countryCode;
    delete params.image;
    const { code, msg } = await imService.addExpert({
      image: imageUrl,
      countryCode,
      ...params,
    });
    if (code === '0') {
      message.success(msg);
      this.modalHide();
      const { reloadCurrent } = this.props
      reloadCurrent && reloadCurrent.reload()
    }
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
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
          loading: false,
        });
      }
    }
  };

  beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('Image must smaller than 5MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  render() {
    const uploadUrl = `/api${api.fileUpload}`;

    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { Option } = Select;
    const { visible, continentList, data, imageUrl, countryList, options } = this.state;
    return (
      <Modal title="新建" visible={visible} onCancel={this.modalHide}
        destroyOnClose
        okButtonProps={{
          form: 'expertForm',
          htmlType: 'submit',
        }}
      >
        <Form name="expertForm" onFinish={this.onFinish} initialValues={data}>
          <Form.Item
            label="专家ID"
            name="userId"
            rules={[
              { required: true, message: '请输入专家ID' },
              { type: 'string', max: 50, message: `最多输入50个字符` },
            ]}
          >
            <Input placeholder="请输入专家ID" maxLength={50} />
          </Form.Item>
          <Form.Item
            label="专家名称"
            name="name"
            rules={[
              { required: true, message: '请输入专家名称' },
              { type: 'string', max: 50, message: `最多输入50个字符` },
            ]}
          >
            <Input placeholder="请输入专家名称" maxLength={50} />
          </Form.Item>
          <Form.Item
            label="专家邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'string', max: 50, message: `最多输入50个字符` },
              {
                pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                message: '请输入正确的邮箱',
              },
            ]}
          >
            <Input placeholder="请输入邮箱" maxLength={50} />
          </Form.Item>
          <Form.Item label="专家头像" name="image" rules={[{ required: true, message: '' }]}>
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
            label="专家国籍"
            name="countryCode"
            rules={[
              { required: true, message: '请选择国籍' },
              { pattern: /[A-Za-z]/, message: '请选择到国籍' },
            ]}
          >
            {/* <Select
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
            </Select> */}
            <Cascader
              options={continentList}
              loadData={this.loadData}
              onChange={this.onChange}
              showSearch
              changeOnSelect
            />
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
        </Form>
      </Modal>
    );
  }
}

export default EditForm;
