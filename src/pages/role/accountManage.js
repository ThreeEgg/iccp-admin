import React, { Component, createRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/system';
import { Row, Pagination, Button, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import AccountModal from './AccountModal';

export class AccountManage extends Component {
  state = {
    total: 0,
  };

  actionRef = createRef();

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
      valueType: 'dateTimeRange',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '创建人',
      dataIndex: 'createdId',
    },
    {
      title: '最后修改人',
      dataIndex: 'updateUserName',
      hideInTable: true,
    },
    {
      title: '最后登录时间',
      dataIndex: 'updateTime',
      valueType: 'dateTimeRange',
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
            onClick={() => this.modalShow('update', data)}
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

  resetPassword = async userId => {
    const { code, msg } = await imService.resetAccountPassword({
      userId,
    });
    if (code === '0') {
      message.success(msg);
      this.actionRef.current.reload();
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
      this.actionRef.current.reload();
    }
  };

  /* getAccountList = async () => {
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
  }; */

  modalShow = (type, data) => {
    this.accountManage.modalShow(type, data);
  };

  render() {
    const { columns } = this;
    const { list, currentPage, total } = this.state;
    return (
      <PageHeaderWrapper>
        <ProTable
          rowKey="id"
          columns={columns}
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
              params.createTimeBegin = params.createTime[0];
              params.createTimeEnd = params.createTime[1];
              delete params.createTime;
            }
            if (params.updateTime) {
              params.updateTimeBegin = params.updateTime[0];
              params.updateTimeEnd = params.updateTime[1];
              delete params.updateTime;
            }
            return imService.getAccountList(params);
          }}
          postData={data => {
            this.setState({
              total: data.pageInfo.totalResults,
            });
            return data.items;
          }}
          toolBarRender={() => [
            <Row align="middle">
              <Button onClick={() => this.modalShow('add')}>新建</Button>
            </Row>,
          ]}
        />
        <AccountModal
          ref={el => {
            this.accountManage = el;
          }}
          getAccountList={this.actionRef}
        />
      </PageHeaderWrapper>
    );
  }
}

export default AccountManage;
