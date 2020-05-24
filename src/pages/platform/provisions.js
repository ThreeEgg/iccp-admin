import React, { Component } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'; 
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/platform'
import {Row,Button} from "antd"
import router from 'umi/router';

export class Provisions extends Component {

  state = {
    list: [],
    currentPage:1
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
      dataIndex: 'id',
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后修改人',
      dataIndex: 'id',
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
    const{data:{items}}=await imService.listPlatformContent({
      pageNum:currentPage,
      pageSize:10
    })
    this.setState({
      list:items.filter(item=>{
        return item.type === "clause"
      })
    })
  }

  gotoAdd = (type)=>{
    console.log(type);
    if(type === "clause"){
      router.push(`/platform/regulation/add?type=${type}`)
    }
    
  }

  render() {
    const {columns} = this;
    const {list} = this.state;
    const type = "clause"
    return (
      <PageHeaderWrapper>
        <ProTable
          columns={columns}
          dataSource={list}
          toolBarRender={() => [
            <Row align='middle'>
              <Button onClick={()=>this.gotoAdd(type)}>新建</Button>
            </Row>
          ]}
        />
      </PageHeaderWrapper>
    )
  }
}

export default Provisions
