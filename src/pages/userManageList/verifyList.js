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
      // hideInSearch:true,
    },
    {
      title: '用户邮箱',
      dataIndex: 'email',
    },
    {
      title: '申请状态',
      dataIndex: 'isValid',
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '提交审核次数',
      dataIndex: 'chatCount',
    },
    {
      title: '公司',
      dataIndex: 'id',
    },
    {
      title: '职位',
      dataIndex: 'id',
    },
    {
      title: '称呼',
      dataIndex: 'id',
    },
    {
      title: '性别',
      dataIndex: 'id',
    },
    {
      title: '联系方式',
      dataIndex: 'id',
    },

    {
      title: '创建人',
      dataIndex: 'createId',
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
            if (params.registryDate) {
              params.registryDateFrom = params.registryDate[0];
              params.registryDateTo = params.registryDate[1];
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
