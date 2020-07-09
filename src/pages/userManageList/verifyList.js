import React, { Component, createRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { message, Modal } from 'antd';
import * as systemService from '@/services/system';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default class extends Component {
  state = {
    total: 0,
    loading: false,
    visible: false,
    userId: '',
    isVerified: true,
    cancelDisabled: false,
  };

  actionRef = createRef();

  verify = async (userId, isVerified) => {
    this.setState({
      loading: true,
      cancelDisabled: true,
    });
    const result = await systemService.userVerify({ userId, isVerified });

    if (result.code === '0') {
      message.success('操作成功');
      this.setState({
        loading: false,
        cancelDisabled: false,
      });
      this.hideModal();
      this.actionRef.current.reload();
    }
  };

  columns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
    },
    {
      title: '用户昵称',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: '用户邮箱',
      dataIndex: 'email',
    },
    {
      title: '申请状态',
      dataIndex: 'isVerified',
      /* formItemProps: {
        initialValues: { isVerified: 0 }
      }, */
      valueEnum: {
        0: { text: '待审核' },
        1: { text: '已通过' },
        2: { text: '已拒绝' },
      },
    },
    {
      title: '申请时间',
      dataIndex: 'requestTime',
      valueType: 'dateTimeRange',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '提交审核次数',
      dataIndex: 'requestNum',
      hideInSearch: true,
    },
    {
      title: '公司',
      dataIndex: 'company',
      hideInSearch: true,
    },
    {
      title: '职位',
      dataIndex: 'position',
      hideInSearch: true,
    },
    {
      title: '称呼',
      dataIndex: 'callName',
      hideInSearch: true,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      hideInSearch: true,
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      hideInSearch: true,
    },

    {
      title: '创建人',
      dataIndex: 'createId',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'userId',
      valueType: 'option',
      hideInSearch: true,
      render: item => (
        <>
          <a
            style={{ textDecoration: 'underline', marginRight: '10px' }}
            onClick={() => this.verifyConfirm(item, true)}
          >
            通过审核
          </a>
          <a
            style={{ textDecoration: 'underline' }}
            onClick={() => this.verifyConfirm(item, false)}
          >
            拒绝审核
          </a>
        </>
      ),
    },
  ];

  handleVerify = () => {
    const { userId, isVerified } = this.state;
    this.verify(userId, isVerified);
  };

  verifyConfirm = (item, value) => {
    this.showModal();
    this.setState({
      userId: item,
      isVerified: value,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };
  render() {
    const { columns } = this;
    const { cancelDisabled, isVerified, total, loading, visible } = this.state;
    return (
      <PageHeaderWrapper>
        <ProTable
          actionRef={this.actionRef}
          form={{
            initialValues: { isVerified: '0' },
          }}
          columns={columns}
          rowKey="userId"
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
            if (params.requestTime) {
              params.registryDateFrom = params.requestTime[0];
              params.registryDateTo = params.requestTime[1];
              delete params.registryDate;
            }
            return systemService.userVerifyList(params);
          }}
          postData={data => {
            this.setState({
              total: data.pageInfo.totalResults,
            });
            return data.items;
          }}
          options={{ fullScreen: false, reload: true, setting: true }}
        />
        <Modal
          title="操作"
          visible={visible}
          keyboard={false}
          closable={false}
          onOk={this.handleVerify}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
          maskClosable={false}
          okButtonProps={{
            loading: loading,
          }}
          cancelButtonProps={{
            disabled: cancelDisabled,
          }}
        >
          <p>{isVerified ? '通过审核?' : '拒绝审核?'}</p>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
