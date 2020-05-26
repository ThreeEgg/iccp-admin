import React, { Component } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/platform'
import { Button, Row, Pagination, message, Modal } from "antd"
import { ExclamationCircleOutlined } from '@ant-design/icons';
import PartnerModal from "./partnerModal"

export class Partner extends Component {

  state = {
    list: [],
    currentPage: 1,
    total: 0
  }

  columns = [
    {
      title: '语言',
      dataIndex: 'language',
      // hideInSearch:true,
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
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '创建人',
      dataIndex: 'createId',
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
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
      render: item => (
        <>
          <a style={{ textDecoration: "underline", marginRight: "10px" }}>编辑</a>
          <a style={{ textDecoration: "underline" }} onClick={() => { this.handleDelete(item) }}>刪除</a>
        </>
      )
    },
  ]

  componentDidMount() {
    this.getPtIntroduction()
  }

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
      this.setState({
        currentPage: 1
      })
      this.getPtIntroduction()
    }
  }

  getPtIntroduction = async () => {
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

  }

  handleTableChange = pagination => {
    this.setState(
      {
        currentPage: pagination,
      },
      () => {
        this.getPtIntroduction();
      },
    );
  };

  modalShow = () => {
    this.partnerModal.modalShow()
  }

  render() {
    const { columns } = this;
    const { list, currentPage, total } = this.state;
    return (
      <PageHeaderWrapper>
        <ProTable
          columns={columns}
          dataSource={list}
          rowKey="id"
          pagination={false}
          toolBarRender={() => [
            <Row align='middle'>
              <Button onClick={this.modalShow}>新建</Button>
            </Row>
          ]}
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
        <PartnerModal ref={el => { this.partnerModal = el }} />
      </PageHeaderWrapper>
    )
  }
}

export default Partner
