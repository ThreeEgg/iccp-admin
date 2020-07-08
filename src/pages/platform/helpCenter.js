import React, { Component, createRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/platform';
import { Button, message, Modal, Row } from 'antd';
import router from 'umi/router';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export class HelpCenter extends Component {
  state = {
    total: 0,
  };

  actionRef = createRef();

  handleDelete = item => {
    const { confirm } = Modal;
    confirm({
      title: '删除',
      icon: <ExclamationCircleOutlined />,
      content: '确认删除?',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        that.delete(item);
      },
      onCancel: () => {
        message.warning('已经取消');
      },
    });
  };

  delete = async item => {
    const { code, msg } = await imService.deleteCommonProblems({
      id: item,
    });
    if (code === '0') {
      message.success(msg);
      this.actionRef.current.reload();
    }
  };

  gotoAdd = (type, data) => {
    if (type === 'helpCenter') {
      router.push({
        pathname: `/platform/helpCenter/add`,
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
    }, code } = await imService.listPlatformContent({
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
      title: '语言',
      dataIndex: 'language',
      // hideInSearch:true,
      valueEnum: {
        en: { text: '英文' },
        zh_CN: { text: '中文' },
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      // hideInSearch:true,
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
          <a
            style={{ textDecoration: 'underline', marginRight: '10px' }}
            onClick={() => this.gotoAdd('helpCenter', data)}
          >
            编辑
          </a>
          <a
            style={{ textDecoration: 'underline' }}
            onClick={() => {
              this.handleDelete(item);
            }}
          >
            刪除
          </a>
        </>
      ),
    },
  ];

  render() {
    const { columns } = this;
    const { list, currentPage, total } = this.state;
    const type = 'helpCenter';
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
            params.type = 'helpCenter';
            return imService.listPlatformContent(params);
          }}
          postData={data => {
            this.setState({
              total: data.pageInfo.totalResults,
            });
            return data.items;
          }}
          toolBarRender={() => [
            <Row align="middle">
              <Button onClick={() => this.gotoAdd(type)}>新建</Button>
            </Row>,
          ]}
          options={
            { fullScreen: false, reload: true, setting: true }
          }
        />
      </PageHeaderWrapper>
    );
  }
}

export default HelpCenter;
