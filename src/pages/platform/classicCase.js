import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Modal, message, Row, Button, Pagination } from 'antd';
import { SearchOutlined, RetweetOutlined, PlusOutlined, FireOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import router from 'umi/router';
import * as platService from '@/services/platform';

export class ClassicCase extends Component {
  state = {
    list: [],
    currentPage: 1,
    total: 0,
    delVisible: false,
    delId: 0,
  };

  columns = [
    {
      title: '语言',
      dataIndex: 'language',
      // hideInSearch:true,
    },
    {
      title: '标题',
      dataIndex: 'title',
      // hideInSearch:true,
    },
    {
      title: '简介',
      dataIndex: 'content',
      // hideInSearch:true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '创建人',
      dataIndex: 'id',
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后修改人',
      dataIndex: 'id',
    },
    {
      title: '操作',
      dataIndex: 'id',
      valueType: 'option',
      hideInSearch: true,
      render: (id, record) => (
        <>
          <a
            style={{ textDecoration: 'underline', marginRight: '10px' }}
            onClick={() => this.goToEdit(1, id)}
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

  componentDidMount() {
    this.getPtIntroduction();
  }

  getPtIntroduction = async () => {
    const { currentPage } = this.state;
    const {
      code,
      data: {
        items,
        pageNumber,
        pageInfo: { totalResults },
      },
    } = await platService.listPlatformContent({
      pageNum: currentPage,
      pageSize: 10,
    });
    if (code === '0') {
      this.setState({
        list: items.filter(item => item.type === 'classicCase'),
        currentPage: pageNumber,
        total: totalResults,
      });
    }
  };

  goToEdit = (type, id) => {
    router.push(`/platform/case/add?type=${type}&id=${id}`);
  };

  showDelModal = id => {
    this.setState({
      delVisible: true,
      delId: id,
    });
  };

  deleteCase = async () => {
    const { delId } = this.state;
    const { code } = await platService.deletePlatformContent({});
    if (code === 0) {
      message.info('删除成功');
    }
  };

  cancelDel = () => {
    this.setState({
      delVisible: false,
      delId: 0,
    });
  };

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

  render() {
    const { columns } = this;
    const { list, delVisible, currentPage, total } = this.state;

    return (
      <PageHeaderWrapper>
        <Modal visible={delVisible} onOk={this.deleteCase} onCancel={this.cancelDel}>
          确定删除此案例？
        </Modal>
        <ProTable
          headerTitle="经典案例"
          columns={columns}
          dataSource={list}
          toolBarRender={() => [
            <Row align="middle">
              <Button key="1" shape="round" onClick={() => this.goToEdit(0)}>
                <PlusOutlined />
                新建
              </Button>
            </Row>,
          ]}
          pagination={false}
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
      </PageHeaderWrapper>
    );
  }
}

export default ClassicCase;
