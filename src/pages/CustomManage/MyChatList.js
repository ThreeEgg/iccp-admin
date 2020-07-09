import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/customer';
import router from 'umi/router';
import { connect } from 'dva';

export class MyChatList extends Component {
  state = {
    total: 0,
  };

  gotoChat = (item, chatItem) => {
    // 发起会话
    // console.log(chatItem, this.props);
    // this.props.dispatch({
    //   type: 'im/initSession',
    //   serviceAccid: this.props.im.userUID,
    //   userAccid: chatItem.userImId,
    //   to: chatItem.userImId,
    // });
    router.push('/customService/im/');
  };

  columns = [
    {
      title: '客户类型',
      dataIndex: 'userType',
      valueEnum: {
        user: { text: '用户' },
        expert: { text: '专家' },
        guest: { text: '游客' },
      },
    },
    {
      title: '客户ID',
      dataIndex: 'userId',
    },
    {
      title: '客户名称',
      dataIndex: 'clientUserName',
    },
    {
      title: '聊天创建时间',
      dataIndex: 'firstChatTime',
      valueType: 'dateTimeRange',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后聊天时间',
      dataIndex: 'lastChatTime',
      valueType: 'dateTimeRange',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: 'userImId',
      valueType: 'option',
      hideInSearch: true,
      render: (item, data) => (
        <>
          <a style={{ textDecoration: 'underline' }} onClick={() => this.gotoChat(item, data)}>
            聊天
          </a>
        </>
      ),
    },
  ];

  render() {
    const { columns } = this;
    const { total } = this.state;
    return (
      <PageHeaderWrapper>
        <ProTable
          rowKey="id"
          columns={columns}
          // headerTitle="聊天列表"
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
            if (params.firstChatTime) {
              params.firstChatTimeBegin = params.firstChatTime[0];
              params.firstChatTimeEnd = params.firstChatTime[1];
              delete params.firstChatTime;
            }
            if (params.lastChatTime) {
              params.lastChatTimeBegin = params.lastChatTime[0];
              params.lastChatTimeEnd = params.lastChatTime[1];
              delete params.lastChatTime;
            }
            params.serviceUserId = localStorage.userId;
            return imService.getDialogList(params);
          }}
          postData={data => {
            this.setState({
              total: data.pageInfo.totalResults,
            });
            return data.items;
          }}
          options={{ fullScreen: false, reload: true, setting: true }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ im }) => ({
  im,
}))(MyChatList);
