import React, { Component, createRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import * as expertService from '@/services/expert';
import moment from 'moment';

export default class extends Component {
  state = {
    total: 0,
  };

  actionRef = createRef();

  columns = [
    {
      title: '专家名称',
      dataIndex: 'name',
    },
    {
      title: '专家ID',
      dataIndex: 'expertUserId',
    },
    {
      title: '举报内容',
      dataIndex: 'contentType',
      valueEnum: {
        article: { text: '文章' },
        activity: { text: '动态' },
        case: { text: '经典案例' },
      },
    },
    {
      title: '举报人账号',
      dataIndex: 'reportUserId',
    },
    {
      title: '举报时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      valueType: 'dateTimeRange',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '展示状态',
      dataIndex: 'isValid',
      valueEnum: {
        0: { text: '已删除' },
        1: { text: '正常' },
      },
    },
    {
      title: '操作',
      dataIndex: 'expertUserId',
      valueType: 'option',
      hideInSearch: true,
      render: (item, data) => [
        <a
          style={{ textDecoration: 'underline', marginRight: '10px' }}
          href={`/professor?id=${item}&tabName=${
            data.contentType === 'case' ? 'caseExample' : data.contentType
          }`}
          target="_blank"
        >
          查看
        </a>,
      ],
    },
  ];

  render() {
    const { columns } = this;
    const { list, currentPage, total } = this.state;
    const type = 'clause';
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
            if (params.expertUserId) {
              params.expertId = params.expertUserId;
              delete params.expertUserId;
            }
            if (params.name) {
              params.expertName = params.name;
              delete params.name;
            }
            if (!params.reportUserId) {
              delete params.reportUserId;
            }
            return expertService.expertIllegalReport(params);
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
