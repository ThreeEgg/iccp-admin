import React, { Component } from 'react';
import { Descriptions, Modal } from 'antd';
import { connect } from 'dva';
import { downloadCaseBatch } from '@/services/im';
import moment from 'moment';

class NoticeModal extends Component {
  download = webUrl => {
    window.open(webUrl, '_blank');
  };

  downloadAll = async caseId => {
    const res = await downloadCaseBatch({ caseId });
    // 如果有code，而不是二进制文件，表示错误
    if (res.code) {
      return;
    }
    if (res instanceof Blob) {
      const blobUrl = window.URL.createObjectURL(res);
      const eleLink = document.createElement('a');
      eleLink.download = '案件附件.zip';
      eleLink.style.display = 'none';
      eleLink.href = blobUrl;
      // 触发点击
      document.body.appendChild(eleLink);
      eleLink.click();
      // 然后移除
      document.body.removeChild(eleLink);
    }
  };

  render() {
    const { visible, data = {} } = this.props;
    return (
      <Modal
        // title="案件信息表"
        visible={visible}
        onCancel={this.props.modalHide}
        footer={null}
      >
        {/* <Form initialValues={data}>
          <Form.Item label="最后更新" name="updateTime">
            <Input disabled />
          </Form.Item>
        </Form> */}

        <Descriptions
          title={
            <div>
              <h3>案件信息表</h3>
              <h5>最后更新: {moment(data.updateTime).format('YYYY-MM-DD HH:mm:ss')}</h5>
            </div>
          }
          bordered
          size="small"
          layout={'vertical'}
        >
          {/*<Descriptions.Item label="最后更新">{data.updateTime}</Descriptions.Item>*/}
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

          <Descriptions.Item label="附件材料">
            <div>
              <p>
                <span style={{ marginRight: '20px' }}>全部材料</span>
                {data && data.iccpCaseEnclosureList && data.iccpCaseEnclosureList.length ? (
                  <span
                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => this.downloadAll(data.caseId)}
                  >
                    打包下载
                  </span>
                ) : (
                  <span>无</span>
                )}
              </p>
              {data &&
                data.iccpCaseEnclosureList &&
                data.iccpCaseEnclosureList.map(item => (
                  <p key={item.id}>
                    <span style={{ marginRight: '20px' }}>{item.oldFileName}</span>
                    <span
                      style={{ textDecoration: 'underline', cursor: 'pointer' }}
                      onClick={() => this.download(item.webUrl)}
                    >
                      下载
                    </span>
                  </p>
                ))}
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    );
  }
}

export default connect(({}) => ({}))(NoticeModal);
