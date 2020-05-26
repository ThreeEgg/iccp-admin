import React, { Component } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/customer'
import router from 'umi/router';
import { Row, Pagination, message } from "antd"


export class MyChatList extends Component {

  state = {
    list: [],
    currentPage: 1,
    total: 0
  }

  columns = [
    {
      title: '客户类型',
      dataIndex: 'userType',
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
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后聊天时间',
      dataIndex: 'lastChatTime',
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
      dataIndex: 'chatId',
      valueType: 'option',
      hideInSearch: true,
      render: item => (
        <>
          <a style={{ textDecoration: 'underline' }}>聊天</a>
        </>
      )
    },
  ]

  componentDidMount() {
    this.getMyChatList()
  }

  getMyChatList = async () => {
    const { currentPage } = this.state
    const { data: {
      items,
      pageNumber,
      pageInfo: { totalResults }
    }, code } = await imService.getDialogList({
      pageNum: currentPage,
      pageSize: 10,
      serviceUserId: localStorage.userId
    })
    if (code === "0") {
      this.setState({
        list: items,
        currentPage: pageNumber,
        total: totalResults,
      })
    }
  }

  render() {
    const { columns } = this;
    const { list, currentPage, total } = this.state;
    return (
      <PageHeaderWrapper>
        <ProTable
          rowKey="id"
          columns={columns}
          // headerTitle="聊天列表"
          dataSource={list}
          pagination={false}
        />
        <div style={{ backgroundColor: '#FFF' }}>
          <Row style={{ padding: '16px 16px' }} justify="end">
            <Pagination
              onChange={this.handleTableChange}
              showSizeChanger={false}
              total={total}
              current={currentPage}
            />
          </Row>
        </div>
      </PageHeaderWrapper>
    )
  }
}

export default MyChatList
