import React, { Component } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'; 
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/platform'
import {Row,Button,Pagination, message,Modal } from "antd"
import router from 'umi/router';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export class Provisions extends Component {

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
      // hideInSearch:true,
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
          <a style={{textDecoration:"underline"}} onClick={()=>{this.handleDelete(item)}}>刪除</a>
        </>
      )
    },
  ]

  componentDidMount(){
    this.getPtIntroduction()
  }

  handleDelete = item=>{
    const { confirm } = Modal;
    const that = this
    confirm({
      title: '删除',
      icon: <ExclamationCircleOutlined />,
      content: '确认删除?',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        that.deleteProblems(item)
      },
      onCancel() {
        message.warning('已经取消');
      },
    })
  }

  deleteProblems = async (item)=>{
    const {code,msg} = await imService.deleteCommonProblems({
      id:item
    })
    if(code === "0"){
      message.success(msg)
      this.setState({
        currentPage:1
      })
      this.getPtIntroduction()
    }
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
      type:'clause'
    })
    if(code ==="0"){
      this.setState({
        list:items.filter(item=>item.type === "clause"),
        currentPage:pageNumber,
        total:totalResults,
      })
    }
  }

  gotoAdd = (type)=>{
    if(type === "clause"){
      router.push(`/platform/regulation/add?type=${type}`)
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
    const type = "clause"
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

export default Provisions
