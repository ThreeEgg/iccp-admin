import React, { Component } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'; 
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/role'
import {Row,Pagination} from "antd"

export class roleManage extends Component {

  state = {
    list: [],
    currentPage:1,
    total:0
  }

  columns = [
    {
      title: '角色ID',
      dataIndex: 'id',
      hideInSearch:true,
    },
    {
      title: '角色类型',
      dataIndex: 'roleTypeStr',
    },
    {
      title :'角色名',
      dataIndex :'description'
    },
    {
      title: '关联账号数',
      dataIndex: 'useCount',
      hideInSearch:true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '创建人',
      dataIndex: 'createUserId',
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后修改人',
      dataIndex: 'updateUserId',
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
    this.getRoleInfo()
  }

  getRoleInfo = async ()=>{
    const{currentPage} =this.state
    const{data:{
      items,
      pageNumber,
      pageInfo:{totalResults}
    },code}=await imService.getRoleInfo({
      pageNum:currentPage,
      pageSize:10
    })
    if(code === "0"){
      this.setState({
        list:items,
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
        this.getRoleInfo();
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
        <div style={{background:'#fff'}}>
          <Row style={{padding: '16px '}} justify="end">
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

export default roleManage
