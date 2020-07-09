import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/im';
import router from 'umi/router';
import { connect } from 'dva';
import { Modal } from 'antd';
import NoticeModal from './NoticeModal';

export class CaseNotice extends Component {
  state = {
    list: [],
    currentPage: 1,
    total: 0,
    visible: false,
    data: '',
  };

  checkExportNotes = item => {
    Modal.info({
      title: '专家说明',
      content: (
        <div>
          <p>{item}</p>
        </div>
      ),
      onOk() {},
    });
  };

  /* componentDidMount() {
    this.getNoticeList()
  } */

  gotoChatDetail = item => {
    router.push(`/chat/im`);
  };

  checkCaseInfo = caseId => {
    // message.warning('查看案件信息表')
    this.getCaseInfo(caseId);
  };

  /* gotoChat = (item, chatItem) => {
    // 发起会话
    console.log("chatItem", chatItem, this.props)
    return;
    props.dispatch({
      type: 'im/initSession',
      serviceAccid: props.imInfo.accid,
      userAccid: chatItem.userImId,
      to: chatItem.userImId,
    });
    router.push('/chat/im');
  }; */

  columns = [
    {
      title: '通知时间',
      dataIndex: 'createTime',
      // hideInSearch:true,
      valueType: 'dateTimeRange',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '专家名称',
      dataIndex: 'expertUserName',
    },
    {
      title: '用户名称',
      dataIndex: 'clientUserName',
    },
    {
      title: '专家说明',
      dataIndex: 'expertExplain',
      hideInSearch: true,
      valueType: 'option',
      render: item => (
        <>
          <a
            style={{ textDecoration: 'underline' }}
            onClick={() => {
              this.checkExportNotes(item);
            }}
          >
            查看
          </a>
        </>
      ),
    },
    {
      title: '操作',
      dataIndex: 'caseId',
      hideInSearch: true,
      valueType: 'option',
      render: (item, data) => (
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: '5px' }}>
            <a
              style={{ textDecoration: 'underline' }}
              onClick={() => {
                this.gotoChatDetail(item, data);
              }}
            >
              查看聊天详情
            </a>
          </div>
          <div style={{ marginRight: '5px' }}>
            <a
              style={{ textDecoration: 'underline' }}
              onClick={() => {
                this.checkCaseInfo(item);
              }}
            >
              查看案件信息表
            </a>
          </div>
        </div>
      ),
    },
  ];

  getCaseInfo = async caseId => {
    const { data, code } = await imService.getCaseInfo({
      caseId,
    });
    if (code === '0') {
      this.setState({
        visible: true,
        data,
      });
    }
  };

  modalHide = () => {
    this.setState({
      visible: false,
    });
  };

  getNoticeList = async () => {
    const { currentPage } = this.state;
    const {
      data: {
        items,
        pageNumber,
        pageInfo: { totalResults },
      },
      code,
    } = await imService.getNoticeList({
      pageNum: currentPage,
      pageSize: 10,
    });
    if (code === '0') {
      this.setState({
        list: items,
        currentPage: pageNumber,
        total: totalResults,
      });
    }
  };

  render() {
    const { columns } = this;
    const { data, visible, total } = this.state;
    return (
      <PageHeaderWrapper>
        <ProTable
          rowKey="id"
          columns={columns}
          // headerTitle="聊天列表"
          // dataSource={list}
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
            return imService.getNoticeList(params);
          }}
          postData={data => {
            this.setState({
              total: data.pageInfo.totalResults,
            });
            return data.items;
          }}
          options={{ fullScreen: false, reload: true, setting: true }}
        />
        {/* <div style={{ backgroundColor: '#FFF' }}>
          <Row style={{ padding: '16px 16px' }} justify="end">
            <Pagination
              onChange={this.handleTableChange}
              showSizeChanger={false}
              total={total}
              current={currentPage}
            />
          </Row>
        </div> */}
        <NoticeModal visible={visible} data={data} modalHide={this.modalHide} />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ im, imInfo }) => ({ im, imInfo }))(CaseNotice);
// export default CaseNotice;
