import React, { Component } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'; 
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/platform'
import {Row,Button,Pagination} from "antd"
import router from 'umi/router';

export class CommonProblems extends Component {

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
      title: '标题',
      dataIndex: 'title',
      hideInSearch:true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '创建人',
      dataIndex: 'createId',
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
          <a style={{textDecoration:"underline",marginRight:"10px"}}>编辑</a>
          <a style={{textDecoration:"underline"}}>刪除</a>
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
      type:'commonQuestion'
    })
    if(code ==="0"){
      this.setState({
        list:items.filter(item=>item.type === "commonQuestion"),
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

  gotoAdd = (type)=>{
    if(type === "commonQuestion"){
      router.push(`/platform/problems/add?type=${type}`)
    }
    
  }

  render() {
    const {columns} = this;
    const {list,currentPage,total} = this.state;
    const type = "commonQuestion"
    return (
      <PageHeaderWrapper>
        <ProTable
          columns={columns}
          dataSource={list}
          pagination={false}
          toolBarRender={() => [
            <Row align='middle'>
              <Button onClick={()=>this.gotoAdd(type)}>新建</Button>
            </Row>
          ]}
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

export default CommonProblems
