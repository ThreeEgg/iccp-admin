import React, { Component } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'; 
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/system'
import {Row,Pagination,Button,Modal} from "antd"
import AccountModal from "./AccountModal"

export class AccountManage extends Component {

  state = {
    list: [],
    currentPage:1,
    total:0,
    account:''
  }

  columns = [
    {
      title: '账号ID',
      dataIndex: 'userId',
      hideInSearch:true,
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '创建人',
      dataIndex: 'createdId',
    },
    {
      title: '最后登录时间',
      dataIndex: 'updateTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: 'userId',
      valueType: 'option',
      hideInSearch:true,
      render: (item,data) =>(
        <>
          <a style={{textDecoration:"underline",marginRight:"10px"}} onClick={()=>this.modalShow('update',item,data)}>编辑</a>
          <a style={{textDecoration:"underline",marginRight:"10px"}}>重置密码</a>
          <a style={{textDecoration:"underline"}}>刪除</a>
        </>
      )
    },
  ]

  componentDidMount(){
    this.getAccountList()
  }

  getAccountList = async ()=>{
    const{currentPage} =this.state
    const{data:{
      items,
      pageNumber,
      pageInfo:{totalResults}
    },code}=await imService.getAccountList({
      pageNum:currentPage,
      pageSize:10
    })
    if(code === "0"){
      this.setState({
        list:items,
        currentPage:pageNumber,
        total:totalResults,
        account:items[0].userId
      })
    }
  }

  handleTableChange = pagination => {
    this.setState(
      {
        currentPage: pagination,
      },
      () => {
        this.getAccountList();
      },
    );
  };

  modalShow = (type,account,data)=>{
    this.accountManage.modalShow(type,account,data)
  }

  render() {
    const {columns} = this;
    const {list,currentPage,total,account} = this.state;
    return (
      <PageHeaderWrapper>
        <ProTable
          columns={columns}
          dataSource={list}
          pagination={false}
          toolBarRender={() => [
            <Row align='middle'>
              <Button onClick={()=>this.modalShow('add',account)}>新建</Button>
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
        <AccountModal ref={ el=>{this.accountManage = el}}/>
      </PageHeaderWrapper>
    )
  }
}

export default AccountManage
