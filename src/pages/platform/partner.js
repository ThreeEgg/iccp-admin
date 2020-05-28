import React, { Component, createRef } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/platform'
import { Button, Row, Pagination, message, Modal } from "antd"
import { ExclamationCircleOutlined } from '@ant-design/icons';
import PartnerModal from "./partnerModal"

export class Partner extends Component {

  state = {
    total: 0
  }

  actionRef = createRef();

  columns = [
    {
      title: '语言',
      dataIndex: 'language',
      // hideInSearch:true,
      valueEnum: {
        en: { text: '英文' },
        'zh-CN': { text: '中文' },
      },
    },
    {
      title: '合作方名称',
      dataIndex: 'title',
      hideInSearch: true
    },
    {
      title: '合作方logo',
      dataIndex: 'image',
      hideInSearch: true,
      valueType: 'option',
      render: item => (
        <>
          <img src={item} alt="合作方logo" />
        </>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '创建人',
      dataIndex: 'createId',
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
      valueType: 'dateTimeRange',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后修改人',
      dataIndex: 'updateId',
    },
    {
      title: '操作',
      dataIndex: 'id',
      valueType: 'option',
      hideInSearch: true,
      render: (item, data) => (
        <>
          <a style={{ textDecoration: "underline", marginRight: "10px" }} onClick={() => { this.modalShow('update', data) }}>编辑</a>
          <a style={{ textDecoration: "underline" }} onClick={() => { this.handleDelete(item) }}>刪除</a>
        </>
      )
    },
  ]

  handleDelete = item => {
    const { confirm } = Modal;
    const that = this
    confirm({
      title: '删除',
      icon: <ExclamationCircleOutlined />,
      content: '确认删除?',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        that.deleteProblems(item)
      },
      onCancel() {
        message.warning('已经取消');
      },
    })
  }

  deleteProblems = async (item) => {
    const { code, msg } = await imService.deleteCommonProblems({
      id: item
    })
    if (code === "0") {
      message.success(msg)
      this.actionRef.current.reload();
    }
  }

  /* getPtIntroduction = async () => {
    const { currentPage } = this.state
    const { data: {
      items,
      pageNumber,
      pageInfo: { totalResults }
    }, code } = await imService.listPlatformContent({
      pageNum: currentPage,
      pageSize: 10,
      type: 'partner'
    })
    if (code === "0") {
      this.setState({
        list: items,
        currentPage: pageNumber,
        total: totalResults,
      })
    }
  } */


  modalShow = (type, data) => {

    this.partnerModal.modalShow(type, data)
  }

  render() {
    const { columns } = this;
    const { list, currentPage, total } = this.state;
    return (
      <PageHeaderWrapper>
        <ProTable
          columns={columns}
          rowKey="id"
          actionRef={this.actionRef}
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
              params.createDateFrom = params.createTime[0];
              params.createDateTo = params.createTime[1];
              delete params.createTime;
            }
            if (params.updateTime) {
              params.updateDateFrom = params.updateTime[0];
              params.updateDateTo = params.updateTime[1];
              delete params.updateTime;
            }
            params.type = 'partner'
            return imService.listPlatformContent(params)
          }}
          postData={data => {
            this.setState({
              total: data.pageInfo.totalResults,
            })
            return data.items;
          }}
          toolBarRender={() => [
            <Row align='middle'>
              <Button onClick={() => this.modalShow("add")}>新建</Button>
            </Row>
          ]}
        />
        <PartnerModal ref={el => { this.partnerModal = el }} />
      </PageHeaderWrapper>
    )
  }
}

export default Partner
