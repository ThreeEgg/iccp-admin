import React, { Component, createRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { message, Modal } from 'antd';
import * as systemService from '@/services/system';
import router from 'umi/router';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default class extends Component {
  state = {
    total: 0,
  };

  actionRef = createRef();

  handleDelete = item => {
    const { confirm } = Modal;
    const that = this;
    confirm({
      title: '删除',
      icon: <ExclamationCircleOutlined />,
      content: '确认删除?',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        that.deleteProblems(item);
      },
      onCancel() {
        message.warning('已经取消');
      },
    });
  };

  deleteProblems = async item => {
    // const { code, msg } = await systemService.deleteCommonProblems({
    //   id: item,
    // });
    // if (code === '0') {
    //   message.success(msg);
    //   this.actionRef.current.reload();
    // }
  };

  gotoAdd = (type, data) => {
    if (type === 'clause') {
      router.push({
        pathname: `/platform/problems/add`,
        query: {
          data,
          type,
        },
      });
    }
  };

  /* getPtIntroduction = async () => {
    const { currentPage } = this.state
    const { data: {
      items,
      pageNumber,
      pageInfo: { totalResults }
    }, code } = await systemService.listPlatformContent({
      pageNum: currentPage,
      pageSize: 10,
      type: 'clause'
    })
    if (code === "0") {
      this.setState({
        list: items.filter(item => item.type === "clause"),
        currentPage: pageNumber,
        total: totalResults,
      })
    }
  } */

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
      dataIndex: 'id',
      valueType: 'option',
      hideInSearch: true,
      render: (item, data) => (
        <>
          <a
            style={{ textDecoration: 'underline', marginRight: '10px' }}
            onClick={() => this.gotoAdd('clause', data)}
          >
            通过审核
          </a>
          <a
            style={{ textDecoration: 'underline' }}
            onClick={() => {
              this.handleDelete(item);
            }}
          >
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
