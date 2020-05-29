import React, { Component } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/customer'
import router from 'umi/router';
import { message, Modal, Form, Select, Button } from "antd"

export class DialogList extends Component {

  state = {
    total: 0,
    customerList: '',
    visible: false,
    userId: ''
  }

  columns = [
    {
      title: '客户类型',
      dataIndex: 'userType',
      valueEnum: {
        user: { text: '用户' },
        expert: { text: '专家' },
        guest: { text: '游客' },
      },
    },
    {
      title: '客户ID',
      dataIndex: 'userId',
    },
    {
      title: '客户名称',
      dataIndex: 'clientUserName',
    },
    {
      title: '聊天创建时间',
      dataIndex: 'firstChatTime',
      valueType: 'dateTimeRange',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后聊天时间',
      dataIndex: 'lastChatTime',
      valueType: 'dateTimeRange',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '当前客服ID',
      dataIndex: 'serviceUserId',
      hideInSearch: true,
    },
    {
      title: '当前客服',
      dataIndex: 'serviceUserName',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'userId',
      valueType: 'option',
      hideInSearch: true,
      render: item => (
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "5px" }}>
            <a onClick={() => { this.gotoChatDetail(item) }}>查看聊天详情</a>
          </div>
          <div style={{ marginRight: "5px" }}>
            <a onClick={() => { this.changeCustom(item) }}>更换客服</a>
          </div>
        </div>
      )
    },
  ]


  /* getDialogList = async () => {
    const { currentPage } = this.state;
    const { data: {
      items,
      pageNumber,
      pageInfo: { totalResults }
    }, code } = await imService.getDialogList({
      pageNum: currentPage,
      pageSize: 10
    })
    if (code === "0") {
      this.setState({
        list: items,
        currentPage: pageNumber,
        total: totalResults,
      })
    }
  } */

  componentDidMount() {
    this.getCustomerList()
  }

  getCustomerList = async () => {
    const { code, data } = await imService.getCustomerAccount()
    if (code === "0") {
      this.setState({
        customerList: data
      })
    }
  }

  gotoChatDetail = item => {
    message.warning("查看聊天详情")
  }

  changeCustom = userId => {
    this.setState({
      visible: true,
      userId
    })
  }

  /* handleTableChange = pagination => {
    this.setState(
      {
        currentPage: pagination,
      },
      () => {
        this.getDialogList();
      },
    );
  }; */

  handleCancel = () => {
    this.setState({ visible: false })
  }

  onFinish = async params => {
    const { userId } = this.state;
    const { code, msg } = await imService.changeCustomer({
      ...params, userId
    })
    if (code === "0") {
      message.success(msg)
      this.handleCancel()
    }
  }

  render() {
    const { columns } = this;
    const { customerList, total, visible } = this.state;
    const { Option } = Select;
    return (
      <PageHeaderWrapper>
        <ProTable
          rowKey="id"
          columns={columns}
          // headerTitle="聊天列表"
          pagination={{
            defaultCurrent: 1,
            total,
            showQuickJumper: true,
            showLessItems: true,
            showSizeChanger: true,
          }}
          request={params => {
            params.pageNum = params.current;
            delete params.current;
            if (params.firstChatTime) {
              params.firstChatTimeBegin = params.firstChatTime[0];
              params.firstChatTimeEnd = params.firstChatTime[1];
              delete params.firstChatTime;
            }
            if (params.lastChatTime) {
              params.lastChatTimeBegin = params.lastChatTime[0];
              params.lastChatTimeEnd = params.lastChatTime[1];
              delete params.lastChatTime;
            }
            return imService.getDialogList(params)
          }}
          postData={data => {
            this.setState({
              total: data.pageInfo.totalResults,
            })
            return data.items;
          }}

        />
        <Modal
          title="更换客服"
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
          destroyOnClose
        >
          <Form
            onFinish={this.onFinish}
            name="basic"
          >
            <Form.Item
              label="更换客服"
              name="serviceUserId"
              rules={[{ required: true, message: '请选择客服' }]}
            >
              <Select style={{ width: '100%', }}>
                {
                  customerList && customerList.map(item => (
                    <Option key={item.userId} value={item.userId}>{item.name}</Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Button key="submit" type="primary" htmlType="submit">
              保存
            </Button>
          </Form>
        </Modal>
      </PageHeaderWrapper >
    )
  }
}

export default DialogList
