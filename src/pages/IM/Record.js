import React, { Component } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/im'
import { getParameter } from "@/utils/const.js"
import { Row, Pagination } from "antd"

export class Record extends Component {

  state = {
    list: [],
    currentPage: 1,
    total: 0,
  }

  columns = [
    {
      title: '通话类型',
      dataIndex: 'eventType',
      hideInSearch: true,
    },
    {
      title: '用户ID',
      dataIndex: 'userIdTo',
      hideInSearch: true,
    },
    {
      title: '用户昵称',
      dataIndex: 'uToName',
      hideInSearch: true,
    },
    {
      title: '专家ID',
      dataIndex: 'userIdFrom',
      hideInSearch: true,
    },
    {
      title: '专家名称',
      dataIndex: 'uToName',
      hideInSearch: true,
    },
    {
      title: '通话状态',
      dataIndex: 'type',
      hideInSearch: true,
    },
    {
      title: '通话时间',
      dataIndex: 'clientUserId',
      hideInSearch: true,
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '通话时长',
      dataIndex: 'duration',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'id',
      hideInSearch: true,
      valueType: 'option',
      render: item => (
        <div>
          下载
        </div>
      )
    },
  ]

  componentDidMount() {
    this.getChatRecord()
  }

  getChatRecord = async () => {

    // console.log("props",this.props)

    const { currentPage } = this.state
    const { data: {
      items,
      pageNumber,
      pageInfo: { totalResults }
    }, code } = await imService.getChatRecord({
      chatId: getParameter('chatId'),
      pageNum: currentPage,
      pageSize: 10
    })
    this.setState({
      list: items
    })
    if (code === "0") {
      this.setState({
        list: items,
        currentPage: pageNumber,
        total: totalResults,
      })
    }
  }

  handleTableChange = pagination => {
    this.setState(
      {
        currentPage: pagination,
      },
      () => {
        this.getChatRecord();
      },
    );
  };

  render() {
    const { columns } = this
    const { list, currentPage, total } = this.state
    return (
      <PageHeaderWrapper>
        <ProTable
          rowKey="id"
          columns={columns}
          dataSource={list}
          search={false}
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

export default Record
