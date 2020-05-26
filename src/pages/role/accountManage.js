import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/system';
import { Row, Pagination, Button, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import AccountModal from './AccountModal';

export class AccountManage extends Component {
  state = {
    list: [],
    currentPage: 1,
    total: 0,
    account: '',
  };

  columns = [
    {
      title: '账号ID',
      dataIndex: 'userId',
      hideInSearch: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '创建人',
      dataIndex: 'createdId',
    },
    {
      title: '最后登录时间',
      dataIndex: 'updateTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: 'userId',
      valueType: 'option',
      hideInSearch: true,
      render: (item, data) => (
        <>
          <a
            style={{ textDecoration: 'underline', marginRight: '10px' }}
            onClick={() => this.modalShow('update', item, data)}
          >
            编辑
          </a>
          <a
            style={{ textDecoration: 'underline', marginRight: '10px' }}
            onClick={() => this.modalConfirm(item)}
          >
            重置密码
          </a>
          <a style={{ textDecoration: 'underline' }} onClick={() => this.deleteConfirm(item)}>
            刪除
          </a>
        </>
      ),
    },
  ];

  componentDidMount() {
    this.getAccountList();
  }

  resetCurrentPage = () => {
    this.setState({
      currentPage: 1,
    });
  };

  resetPassword = async userId => {
    const { code, msg } = await imService.resetAccountPassword({
      userId,
    });
    if (code === '0') {
      message.success(msg);
    }
  };

  modalConfirm = userId => {
    const { confirm } = Modal;
    const that = this;
    confirm({
      title: '重置密码',
      icon: <ExclamationCircleOutlined />,
      content: `确认将用户 '${userId}' 密码重置为 'CRM123456' `,
      onOk() {
        that.resetPassword(userId);
      },
      onCancel() {
        message.warning('已取消');
      },
    });
  };

  deleteConfirm = userId => {
    const { confirm } = Modal;
    const that = this;
    confirm({
      title: '删除操作',
      icon: <ExclamationCircleOutlined />,
      content: `确认将用户 '${userId}' 删除？ `,
      onOk() {
        that.deleteAccount(userId);
      },
      onCancel() {
        message.warning('已取消');
      },
    });
  };

  deleteAccount = async userId => {
    const { code, msg } = await imService.deleteAccount({
      userId,
    });
    if (code === '0') {
      message.success(msg);
      this.setState({
        currentPage: 1,
      });
      this.getAccountList();
    }
  };

  getAccountList = async () => {
    const { currentPage } = this.state;
    const {
      data: {
        items,
        pageNumber,
        pageInfo: { totalResults },
      },
      code,
    } = await imService.getAccountList({
      pageNum: currentPage,
      pageSize: 10,
    });
    if (code === '0') {
      this.setState({
        list: items,
        currentPage: pageNumber,
        total: totalResults,
        account: items[0].userId,
      });
    }
  };

  handleTableChange = pagination => {
    this.setState(
      {
        currentPage: pagination,
      },
      () => {
        this.getAccountList();
      },
    );
  };

  modalShow = (type, account, data) => {
    this.accountManage.modalShow(type, account, data);
  };

  render() {
    const { columns } = this;
    const { list, currentPage, total, account } = this.state;
    return (
      <PageHeaderWrapper>
        <ProTable
          rowKey="id"
          columns={columns}
          dataSource={list}
          pagination={false}
          toolBarRender={() => [
            <Row align="middle">
              <Button onClick={() => this.modalShow('add', account)}>新建</Button>
            </Row>,
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
        <AccountModal
          ref={el => {
            this.accountManage = el;
          }}
          getAccountList={this.getAccountList}
          resetCurrentPage={this.resetCurrentPage}
        />
      </PageHeaderWrapper>
    );
  }
}

export default AccountManage;
