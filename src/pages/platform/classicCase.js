import React, { Component, createRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, message, Modal, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import router from 'umi/router';
import * as imService from '@/services/platform';

export class ClassicCase extends Component {
  state = {
    total: 0,
    delVisible: false,
    delId: 0,
  };

  actionRef = createRef();

  goToEdit = (type, data) => {
    router.push({
      pathname: '/platform/case/add',
      query: {
        type,
        data,
      },
    });
  };

  /* getPtIntroduction = async () => {
    const { currentPage } = this.state;
    const {
      code,
      data: {
        items,
        pageNumber,
        pageInfo: { totalResults },
      },
    } = await imService.listPlatformContent({
      pageNum: currentPage,
      pageSize: 10,
      type: 'classicCase'
    });
    if (code === '0') {
      this.setState({
        list: items.filter(item => item.type === 'classicCase'),
        currentPage: pageNumber,
        total: totalResults,
      });
    }
  }; */

  showDelModal = id => {
    this.setState({
      delVisible: true,
      delId: id,
    });
  };

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
      hideInSearch: true,
    },
    {
      title: '简介',
      dataIndex: 'brief',
      hideInSearch: true,
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
      render: (id, data) => (
        <>
          <a
            style={{ textDecoration: 'underline', marginRight: '10px' }}
            onClick={() => this.goToEdit(1, data)}
          >
            编辑
          </a>
          <a style={{ textDecoration: 'underline' }} onClick={() => this.showDelModal(id)}>
            刪除
          </a>
        </>
      ),
    },
  ];

  deleteCase = async () => {
    const { delId } = this.state;
    const { code, msg } = await imService.deleteCommonProblems({
      id: delId,
    });
    if (code === '0') {
      this.setState({
        delVisible: false,
        delId: 0,
      });
      message.success(msg);

      this.actionRef.current.reload();
    }
  };

  cancelDel = () => {
    this.setState({
      delVisible: false,
      delId: 0,
    });
  };

  render() {
    const { columns } = this;
    const { delVisible, total } = this.state;

    return (
      <PageHeaderWrapper>
        <Modal visible={delVisible} onOk={this.deleteCase} onCancel={this.cancelDel}>
          确定删除此案例？
        </Modal>
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
            params.type = 'classicCase';
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
              <Button key="1" shape="round" onClick={() => this.goToEdit(0)}>
                <PlusOutlined />
                新建
              </Button>
            </Row>,
          ]}
        />
      </PageHeaderWrapper>
    );
  }
}

export default ClassicCase;
