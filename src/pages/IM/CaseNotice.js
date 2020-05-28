import React, { Component, useState } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable from "@ant-design/pro-table";
import moment from "moment"
import * as imService from "@/services/im"
import router from "umi/router";
import { Row, Pagination, message, Modal, } from "antd"
import NoticeModal from "./NoticeModal"

export class CaseNotice extends Component {

  state = {
    list: [],
    currentPage: 1,
    total: 0,
  }

  columns = [
    {
      title: '通知时间',
      dataIndex: 'createTime',
      // hideInSearch:true,
      valueType: 'dateTimeRange',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '专家名称',
      dataIndex: 'expertUserName',
    },
    {
      title: '用户名称',
      dataIndex: 'clientUserName',
    },
    {
      title: '专家说明',
      dataIndex: 'expertExplain',
      hideInSearch: true,
      valueType: 'option',
      render: (item) => (
        <>
          <a style={{ textDecoration: 'underline' }} onClick={() => { this.checkExportNotes(item) }}>查看</a>
        </>
      )
    },
    {
      title: '操作',
      dataIndex: 'caseId',
      hideInSearch: true,
      valueType: 'option',
      render: (item) => (
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "5px" }}>
            <a style={{ textDecoration: 'underline' }} onClick={() => { this.gotoChatDetail(item) }}>查看聊天详情</a>
          </div>
          <div style={{ marginRight: "5px" }}>
            <a style={{ textDecoration: 'underline' }} onClick={() => { this.checkCaseInfo(item) }}>查看案件信息表</a>
          </div>
        </div>
      )
    }
  ]

  /* componentDidMount() {
    this.getNoticeList()
  } */

  checkExportNotes = item => {
    Modal.info({
      title: '专家详情',
      content: (
        <div>
          <p>{item}</p>
        </div>
      ),
      onOk() { },
    });
  }

  gotoChatDetail = (item) => {
    router.push(`/im/list/chatDetail?chatId=${item}`)
  }

  checkCaseInfo = caseId => {
    // message.warning('查看案件信息表')
    this.getCaseInfo(caseId)
  }

  getCaseInfo = async (caseId) => {
    const { data, code } = await imService.getCaseInfo({
      caseId
    })
    if (code === "0") {
      this.noticeModalInfo.modalShow(data)
    }
  }

  getNoticeList = async () => {
    const { currentPage } = this.state
    const { data: {
      items,
      pageNumber,
      pageInfo: { totalResults }
    }, code } = await imService.getNoticeList({
      pageNum: currentPage,
      pageSize: 10,

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
          // dataSource={list}
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
            if (params.createTime) {
              params.createTimeBegin = params.createTime[0];
              params.createTimeEnd = params.createTime[1];
              delete params.createTime;
            }
            return imService.getNoticeList(params)
          }}
          postData={data => {
            this.setState({
              total: data.pageInfo.totalResults,
            })
            return data.items;
          }}
        />
        {/* <div style={{ backgroundColor: '#FFF' }}>
          <Row style={{ padding: '16px 16px' }} justify="end">
            <Pagination
              onChange={this.handleTableChange}
              showSizeChanger={false}
              total={total}
              current={currentPage}
            />
          </Row>
        </div> */}
        <NoticeModal ref={el => { this.noticeModalInfo = el }} />
      </PageHeaderWrapper>

    )
  }
}

export default CaseNotice
