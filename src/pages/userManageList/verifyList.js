import React, { Component, createRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { message } from 'antd';
import * as systemService from '@/services/system';

export default class extends Component {
  state = {
    total: 0,
  };

  actionRef = createRef();

  verify = async (userId, isVerified) => {
    const result = await systemService.userVerify({ userId, isVerified });

    if (result.code === '0') {
      message.success('操作成功');
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
      hideInSearch: true,
    },
    {
      title: '申请状态',
      dataIndex: 'isVerified',
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
            onClick={() => this.verify(item, true)}
          >
            通过审核
          </a>
          <a style={{ textDecoration: 'underline' }} onClick={() => this.verify(item, false)}>
            拒绝审核
          </a>
        </>
      ),
    },
  ];

  render() {
    const { columns } = this;
    const { list, currentPage, total } = this.state;
    return (
      <PageHeaderWrapper>
        <ProTable
          columns={columns}
          rowKey="id"
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
        />
      </PageHeaderWrapper>
    );
  }
}
