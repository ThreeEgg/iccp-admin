import React, { Component } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'; 
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/platform'
import {Row,Pagination} from "antd"

export class PlatformIntroduction extends Component {

  state = {
    list: [],
    currentPage:1,
    total:0
  }
  
  columns = [
    {
      title: '语言',
      dataIndex: 'language',
      // hideInSearch:true,
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
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
      hideInSearch:true,
      render: item =>(
        <>
          <a style={{textDecoration:"underline"}}>编辑</a>
        </>
      )
    },
  ]

  componentDidMount(){
    this.getPtIntroduction()
  }


  getPtIntroduction = async ()=>{
    const{currentPage} =this.state
    const{data:{
      items,
      pageNumber,
      pageInfo:{totalResults}
    },code}=await imService.listPlatformContent({
      pageNum:currentPage,
      pageSize:10,
      type:'platformIntro'
    })
    if(code === "0"){
      this.setState({
        list:items.filter(item=>item.type === "platformIntro"),
        currentPage:pageNumber,
        total:totalResults,
      })
    }
    
  }

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
    const {columns} = this;
    const {list,currentPage,total} = this.state;
    return (
      <PageHeaderWrapper>
        <ProTable
          columns={columns}
          dataSource={list}
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
    )
  }
}

export default PlatformIntroduction
