import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/platform';
import { Row, Pagination } from 'antd';
import router from 'umi/router';

export class BusinessIntroduction extends Component {
  state = {
    total: 0,
  };

  columns = [
    {
      title: '语言',
      dataIndex: 'language',
      // hideInSearch:true,
      valueEnum: {
        en: { text: '英文' },
        'zh-CN': { text: '中文' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      hideInTable: true,
      valueType: 'dateTimeRange',
    },
    {
      title: '创建人',
      dataIndex: 'createId',
      hideInTable: true,
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
            style={{ textDecoration: 'underline' }}
            onClick={() => {
              this.gotoEdit('businessIntro', data);
            }}
          >
            编辑
          </a>
        </>
      ),
    },
  ];

  gotoEdit = (type, data) => {
    // router.push(`/platform/introduction/edit?chatId=${type}`)
    router.push({
      pathname: '/platform/business/edit',
      query: {
        type,
        data,
      },
    });
  };

  /* getPtIntroduction = async ()=>{
    const{currentPage} =this.state
    const{data:{
      items,
      pageNumber,
      pageInfo:{totalResults}
    },code}=await imService.listPlatformContent({
      pageNum:currentPage,
      pageSize:10,
      type:'businessIntro'
    })
    if(code === "0"){
      this.setState({
        list:items.filter(item=> item.type === "businessIntro"),
        currentPage:pageNumber,
        total:totalResults,
      })
    }
  } */

  render() {
    const { columns } = this;
    const { list, currentPage, total } = this.state;
    return (
      <PageHeaderWrapper>
        <ProTable
          columns={columns}
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
            params.type = 'businessIntro';
            return imService.listPlatformContent(params);
          }}
          postData={data => {
            this.setState({
              total: data.pageInfo.totalResults,
            });
            return data.items;
          }}
          rowKey="id"
        />
      </PageHeaderWrapper>
    );
  }
}

export default BusinessIntroduction;
