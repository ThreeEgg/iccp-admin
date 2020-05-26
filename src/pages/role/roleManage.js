import React, { Component } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/role'
import { Row, Pagination, Button, message, Modal } from "antd"
import { ExclamationCircleOutlined } from '@ant-design/icons';
import RoleAddUpdate from "./RoleAddUpdate"

export class roleManage extends Component {

  state = {
    list: [],
    currentPage: 1,
    total: 0
  }

  columns = [
    {
      title: '角色ID',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '角色类型',
      dataIndex: 'roleTypeStr',
    },
    {
      title: '角色名',
      dataIndex: 'description'
    },
    {
      title: '关联账号数',
      dataIndex: 'useCount',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '创建人',
      dataIndex: 'createUserId',
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后修改人',
      dataIndex: 'updateUserId',
    },
    {
      title: '操作',
      dataIndex: 'id',
      valueType: 'option',
      hideInSearch: true,
      render: (item, data) => (
        <>
          <a style={{ textDecoration: "underline", marginRight: "10px" }} onClick={() => { this.roleModalShow('update', data) }}>编辑</a>
          <a style={{ textDecoration: "underline" }} onClick={() => { this.handleDelete(item) }}>刪除</a>
        </>
      )
    },
  ]

  componentDidMount() {
    this.getRoleInfo()
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
        that.deleteRole(item)
      },
      onCancel() {
        message.warning('已经取消');
      },
    })
  }

  deleteRole = async (item) => {
    const { code, msg } = await imService.deleteRole({
      id: item
    })
    if (code === "0") {
      message.success(msg)
      this.getRoleInfo()
    }
  }

  /* addRole = async () => {  // 添加新角色
    message.warning('现在是写死的，写好表单后修改')
    const { code, msg } = await imService.addRole({
      description: '角色名称',
      roleType: 'service'
    })
    if (code === "0") {
      message.success(msg)
      this.getRoleInfo()
    }
  } */

  getRoleInfo = async () => {
    const { currentPage } = this.state
    const { data: {
      items,
      pageNumber,
      pageInfo: { totalResults }
    }, code } = await imService.getRoleInfo({
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

  }

  handleTableChange = pagination => {
    this.setState(
      {
        currentPage: pagination,
      },
      () => {
        this.getRoleInfo();
      },
    );
  };

  roleModalShow = (type, data) => {
    this.roleAddUpdate.modalShow(type, data)
  }

  render() {
    const { columns } = this;
    const { list, currentPage, total } = this.state;
    return (
      <PageHeaderWrapper>
        <ProTable
          rowKey="id"
          columns={columns}
          dataSource={list}
          pagination={false}
          rowKey="id"
          toolBarRender={() => [
            <Row align='middle'>
              <Button onClick={() => this.roleModalShow("add")}>新建</Button>
            </Row>
          ]}
        />
        <div style={{ background: '#fff' }}>
          <Row style={{ padding: '16px ' }} justify="end">
            <Pagination
              onChange={this.handleTableChange}
              showSizeChanger={false}
              total={total}
              current={currentPage}
            />
          </Row>
        </div>
        <RoleAddUpdate ref={el => { this.roleAddUpdate = el }} getRoleInfo={this.getRoleInfo} />
      </PageHeaderWrapper>
    )
  }
}

export default roleManage
