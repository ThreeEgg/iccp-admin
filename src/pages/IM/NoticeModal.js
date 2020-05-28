import React, { Component } from 'react'
import { Modal, Descriptions, Form, Input } from "antd"


class NoticeModal extends Component {

  state = {
    visible: false,
    data: ''
  }

  modalShow = (data) => {
    this.setState({
      visible: true,
      data
    })
  }

  modalHide = () => {
    this.setState({
      visible: false,
    })
  }

  download = webUrl => {
    window.location.href = webUrl
  }

  downloadAll = iccpCaseEnclosureList => {

  }

  render() {
    const { visible, data } = this.state;
    return (
      <Modal
        // title="案件信息表"
        visible={visible}
        onCancel={this.modalHide}
        footer={null}
      >
        {/* <Form initialValues={data}>
          <Form.Item label="最后更新" name="updateTime">
            <Input disabled />
          </Form.Item>
        </Form> */}
        <Descriptions title="案件信息表" bordered layout="vertical">

          <Descriptions.Item label="最后更新">{data.updateTime}</Descriptions.Item>
          <Descriptions.Item label="法务专家">{data.expertUserId}</Descriptions.Item>
          <Descriptions.Item label="债权人">{data.creditor}</Descriptions.Item>
          <Descriptions.Item label="公司名称">{data.companyName}</Descriptions.Item>
          <Descriptions.Item label="公司地址">{data.companyAddress}</Descriptions.Item>
          <Descriptions.Item label="国家">{data.country}</Descriptions.Item>
          <Descriptions.Item label="联系方式">{data.contactInformation}</Descriptions.Item>

          <Descriptions.Item label="债务人">{data.obligor}</Descriptions.Item>
          <Descriptions.Item label="国家/地区">{data.obligorCountry}</Descriptions.Item>
          <Descriptions.Item label="账龄">{data.ageOfAccount}</Descriptions.Item>
          <Descriptions.Item label="债务金额">{data.debtOfAmount}</Descriptions.Item>
          <Descriptions.Item label="货币类型">{data.currencyType}</Descriptions.Item>
          <Descriptions.Item label="案情简介">{data.caseIntroduction}</Descriptions.Item>

          <Descriptions.Item label="货币类型">
            <div>
              <p>
                <span style={{ marginRight: '20px' }}>材料名称</span>
                <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => this.downloadAll(data.iccpCaseEnclosureList)}>全部下载</span>
              </p>
              {
                data && data.iccpCaseEnclosureList.map(item => (
                  <p key={item.id}>
                    <span style={{ marginRight: '20px' }}>{item.oldFileName}</span>
                    <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => this.download(item.webUrl)}>下载</span>
                  </p>
                ))
              }
            </div>
          </Descriptions.Item>


        </Descriptions>
      </Modal>
    )
  }
}

export default NoticeModal
