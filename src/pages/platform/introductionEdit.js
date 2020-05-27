import React, { Component } from 'react'
import router from 'umi/router';
import { message, Card, Button, Form, Input } from "antd"
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
import { controls, myUploadFn, validateFn } from '@/utils/const';
import { SearchOutlined, RollbackOutlined } from '@ant-design/icons';
import * as imService from '@/services/platform'

export default class introduction extends Component {

  state = {
    type: '',
    data: '',
    title: '',
    id: ''
  }

  componentWillMount() {
    console.log(this.props.location.query)

    const { data, type } = this.props.location.query;
    message.success(`传过来了${data.content}`)
    if (type === "platformIntro") {
      this.setState({
        type, data,
        title: '平台介绍编辑',
        id: data.id
      })
    } else if (type === "businessIntro") {
      this.setState({
        type, data,
        title: '业务介绍编辑',
        id: data.id
      })

    }
  }

  back = () => {
    router.goBack();
  };

  onFinish = params => {
    console.log(params.content.toHTML());
    this.updateIntroduction({ content: params.content.toHTML() });
  }

  updateIntroduction = async (params) => {
    const { data, type, id } = this.state;
    const { code, msg } = await imService.addPartner({
      id,
      // type,
      ...params
    })
    if (code === "0") {
      message.success(msg)
      this.back()
    }
  }

  render() {
    const { title, data: { content }, data } = this.state;
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
          <Form ref={this.formRef} name="classicCase" initialValues={data} onFinish={this.onFinish} >
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
    )
  }
}


