import React, { Component } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'; 
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/im'
import router from 'umi/router';
import {Row,Pagination, message} from "antd"

export class chatList extends Component {
  state = {
    list: [],
    currentPage:1,
    total:0,
  }

  columns = [
    {
      title: '用户ID',
      dataIndex: 'clientUserId',
      hideInSearch:true,
    },
    {
      title: '用户昵称',
      dataIndex: 'clientUserName',
    },
    {
      title: '专家ID',
      dataIndex: 'expertUserId',
      hideInSearch:true,
    },
    {
      title: '专家名称',
      dataIndex: 'expertUserName',
    },
    {
      title: '聊天创建时间',
      dataIndex: 'firstChatTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后聊天时间',
      dataIndex: 'lastChatTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: 'chatId',
      valueType: 'option',
      hideInSearch:true,
      render: item =>(
        <div style={{display:"flex"}}>
          <div style={{marginRight:"5px" }}>
            <a onClick={()=>{this.gotoChatDetail(item)}}>查看聊天详情</a>
          </div>
          <div style={{marginRight:"5px" }}>
            <a  onClick={()=>{this.checkCaseInfo(item)}}>查看案件信息表</a>
          </div>
          <div style={{marginRight:"5px" }}>  
            <a style={{textDecoration:"underline"}} onClick={()=>{this.checkChatRecord(item)}}>查看通话记录</a>
          </div>
        </div>
      )
    },
  ]

  

  componentDidMount(){
    this.getChatList()
  }

  gotoChatDetail = (item)=>{    // 跳转到聊天详情
    // console.log(item)
    router.push(`/im/list/chatDetail?chatId=${item}`)
  }

  checkCaseInfo = item =>{  // 查看案件信息表
    message.warning('查看案件信息表')
  }

  checkChatRecord = item => {   // 跳转通话记录
    router.push(`/im/list/record?chatId=${item}`)
  }

  getChatList = async ()=>{
    const{currentPage} =this.state
    const{data:{
      items,
      pageNumber,
      pageInfo:{totalResults}
    },code}=await imService.getChatList({
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
        this.getChatList();
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
          // headerTitle="聊天列表"
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

export default chatList
