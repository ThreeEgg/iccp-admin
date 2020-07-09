import {
  DownloadOutlined,
  DownOutlined,
  LoadingOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Menu, message, Modal, Upload } from 'antd';
import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import router from 'umi/router';
import {
  expertGetList,
  expertNotify,
  expertResetPassword,
  expertUpdateStatus,
} from '@/services/expert';
import api from '@/services/api';

import moment from 'moment';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import EditForm from './components/EditForm';

import { addRule, removeRule, updateRule } from './service';

import expertImportFile from '@/assets/file/专家批量导入模板.xlsx';
import expertAvatarImportFile from '@/assets/file/专家头像导入模板.zip';

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async fields => {
  const hide = message.loading('正在添加');

  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async fields => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async selectedRows => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map(row => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList = props => {
  const [sorter, setSorter] = useState('');
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [total, setTotal] = useState(0);
  const actionRef = useRef();
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [title, setTitle] = useState('新建');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const editForm = useRef();

  const gotoChat = chatItem => {
    // 发起会话
    props.dispatch({
      type: 'im/initSession',
      serviceAccid: props.imInfo.accid,
      userAccid: chatItem.userImId,
      to: chatItem.userImId,
    });
    router.push('/chat/im');
  };
  const gotoHistory = chatItem => {
    // 发起会话
    props.dispatch({
      type: 'im/initSession',
      serviceAccid: props.imInfo.accid,
      userAccid: chatItem.userImId,
      to: chatItem.userImId,
    });
    router.push('/chat/history');
  };

  const sendNotify = item => {
    Modal.confirm({
      content: '确认发送邮件提醒该专家即使更新日程表',
      okText: '发送',
      cancelText: '取消',
      centered: true,
      onOk: async () => {
        const result = await expertNotify({ userId: item.userId });
        if (result.code === '0') {
          message.success('发送成功');
        }
      },
    });
  };

  const resetPassword = item => {
    Modal.confirm({
      content: `确认将用户‘${item.userId}’的密码重置为USER123456`,
      okText: '确认',
      cancelText: '取消',
      centered: true,
      onOk: async () => {
        const result = await expertResetPassword({ userId: item.userId });
        if (result.code === '0') {
          message.success('操作成功');
        }
      },
    });
  };

  const updateStatus = item => {
    // 置反
    const isValid = item.isValid > 0 ? 0 : 1;
    Modal.confirm({
      content: `确认${isValid > 0 ? '启用' : '停用'}用户${item.userId}的账号`,
      okText: '确认',
      cancelText: '取消',
      centered: true,
      onOk: async () => {
        const result = await expertUpdateStatus({ userId: item.userId, isValid });
        if (result.code === '0') {
          message.success('操作成功');
          actionRef.current.reload();
        }
      },
    });
  };

  const imageUploadProps = {
    name: 'file',
    action: `/api${api.fileUpload}`,
    headers: {
      'x-auth-token': localStorage.adminAccessToken,
    },
    showUploadList: false,
    data: {
      uploadUserId: localStorage.userId,
      type: 0,
    },
    listType: 'picture-card',
    className: 'avatar-uploader',
  };

  const uploadButton = (
    <div>
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">上传</div>
    </div>
  );

  const imageChange = info => {
    if (info.file.status === 'uploading') {
      setImageLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      const {
        file: {
          response: {
            code,
            data: { webUrl },
          },
        },
      } = info;
      if (code === '0') {
        setImageUrl(webUrl);
      }
    }
  };

  const beforeUpload = file => {
    console.log(file.type);

    /* const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    } */
    const isZip = file.type === 'application/x-zip-compressed';
    if (!isZip) {
      message.error('必须上传zip文件');
    }
    /* const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('Image must smaller than 5MB!');
    } */
    return isZip;
  };

  const beforeImgUpload = file => {
    console.log(file.type);

    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('Image must smaller than 5MB!');
    }
    return isZip;
  };

  const gotoDetail = record => {
    // 跳转到详细资料
    window.open(`http://221.215.57.110:9821/professor?id=${record.userId}`);
  };

  const columns = [
    {
      title: '专家ID',
      dataIndex: 'userId',
    },
    {
      title: '专家名称',
      dataIndex: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '头像',
      dataIndex: 'image',
      valueType: 'text',
      hideInTable: true,
      hideInForm: false,
      hideInSearch: true,
      renderFormItem: item => (
        <Upload {...imageUploadProps} onChange={imageChange} beforeUpload={beforeImgUpload}>
          {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
      ),
    },
    {
      title: '专家国籍',
      dataIndex: 'countryCode',
      formItemProps: {
        placeholder: '请输入国家码，如CHN',
      },

      render: (_, record) => `${record.cname}(${record.countryCode})`,
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      hideInForm: true,
    },
    {
      title: '所属公司',
      dataIndex: 'company',
      hideInSearch: true,
    },
    {
      title: '职务',
      dataIndex: 'position',
      hideInSearch: true,
    },
    {
      title: '账号状态',
      dataIndex: 'isValid',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '停用中',
        },
        1: {
          text: '启用中',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      hideInForm: true,
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最近登录时间',
      dataIndex: 'lastLoginTime',
      hideInSearch: true,
      hideInForm: true,
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '本周日程安排',
      dataIndex: 'schdlupdtime',
      hideInForm: true,
      valueEnum: {
        0: { text: '未设置' },
        1: { text: '已设置' },
      },
      render: text => {
        if (!text) {
          return '未设置';
        }

        if (Date.now() - Date.parse(new Date(text)) > 7 * 24 * 3600 * 1000) {
          return '未设置';
        }
        return '已设置';
      },
    },
    {
      title: '已沟通用户数',
      dataIndex: 'chatCount',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '操作',
      valueType: 'option',
      hideInForm: true,
      render: (_, record) => [
        <a onClick={() => editExportDetail(record)}>编辑</a>,
        <a onClick={() => gotoDetail(record)}>详细资料</a>,
        <a onClick={() => sendNotify(record)}>日程提醒</a>,
        <a onClick={() => updateStatus(record)}>{record.isValid > 0 ? '停用' : '启用'}</a>,
        <a onClick={() => resetPassword(record)}>重置密码</a>,
      ],
    },
  ];

  const expertUploadProps = {
    name: 'multipartFile',
    action: `/api${api.expertBatchImport}`,
    headers: {
      'x-auth-token': localStorage.adminAccessToken,
    },
    showUploadList: false,
  };
  const imgUploadProps = {
    name: 'multipartFile',
    action: `/api${api.expertBatchImportImage}`,
    headers: {
      'x-auth-token': localStorage.adminAccessToken,
    },
    showUploadList: false,
  };

  const handleExpertChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);

      return;
    }
    if (info.file.status === 'error') {
      setLoading(true);
      const { code, msg } = info.file.response;
      if (code === '0') {
        message.success(msg);
      } else {
        message.error(msg);
      }
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setLoading(false);
      const { code, msg } = info.file.response;
      if (code === '0') {
        message.success(msg);
      } else {
        message.error(msg);
      }
    }
  };

  const handleImgChange = info => {
    if (info.file.status === 'uploading') {
      setImgLoading(true);

      return;
    }
    if (info.file.status === 'error') {
      setImgLoading(true);
      const { code, msg } = info.file.response;
      if (code === '0') {
        message.success(msg);
      } else {
        message.error(msg);
      }
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setImgLoading(false);
      const { code, msg } = info.file.response;
      if (code === '0') {
        message.success(msg);
      } else {
        message.error(msg);
      }
    }
  };

  const onFinish = params => {
    console.log('params', params);
  };

  const handleModalShow = () => {
    editForm.current.modalShow(1, { countryCode: [] });
  };

  const editExportDetail = (editData) => {
    editForm.current.modalShow(2, editData)
  }

  const handleImportMenuClick = ({ key }) => {
    switch (key) {
      case 'help':
        Modal.info({
          title: '导入模板说明',
          width: 720,
          content: (
            <div>
              <h4>专家批量导入</h4>
              <p>
                格式：表格，xlsx格式 <br />
                内容参考表格头即可
              </p>
              <h4>头像批量导入</h4>
              <p>
                格式：压缩包，zip格式 <br />
                zip包文件：在zip包根目录下，以"专家ID.jpg"或"专家ID.png"命名格式放入头像图片，大小不超过5M。如专家"A000001"，则头像名为"A000001.jpg"或"A000001.png"
              </p>
            </div>
          ),
        });
        break;
      default:
        break;
    }
  };

  return (
    <PageHeaderWrapper className="customer-service-list">
      <ProTable
        rowKey="userId"
        headerTitle="专家查询"
        actionRef={actionRef}
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter;

          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        pagination={{
          defaultCurrent: 1,
          total,
          showQuickJumper: true,
          showLessItems: true,
          showSizeChanger: true,
        }}
        toolBarRender={(action, { selectedRows }) => [
          <Upload {...expertUploadProps} onChange={handleExpertChange}>
            <Button type="primary">
              {loading ? <LoadingOutlined /> : <PlusOutlined />}专家批量导入
            </Button>
          </Upload>,
          <Upload {...imgUploadProps} onChange={handleImgChange} beforeUpload={beforeUpload}>
            <Button type="primary">
              {imgLoading ? <LoadingOutlined /> : <PlusOutlined />} 头像批量导入
            </Button>
          </Upload>,
          <Dropdown
            overlay={
              <Menu onClick={handleImportMenuClick}>
                <Menu.Item key="help">
                  <QuestionCircleOutlined /> 导入说明
                </Menu.Item>
                <Menu.Item key="expert">
                  <a href={expertImportFile} download="专家批量导入模板">
                    <DownloadOutlined /> 专家批量导入模板
                  </a>
                </Menu.Item>
                <Menu.Item key="avatar">
                  <a href={expertAvatarImportFile} download="头像批量导入模板">
                    <DownloadOutlined /> 头像批量导入模板
                  </a>
                </Menu.Item>
              </Menu>
            }
          >
            <Button>
              导入模板 <DownOutlined />
            </Button>
          </Dropdown>,
          <Button type="primary" onClick={handleModalShow}>
            <PlusOutlined /> 新增
          </Button>,
          /* <Button type = "primary" onClick = {() => handleModalVisible(true)}>
            <PlusOutlined /> 新增
          </Button>, */
        ]}
        request={params => {
          params.pageNum = params.current;
          delete params.current;
          delete params._timestamp;
          if (params.createTime) {
            params.createDateFrom = params.createTime[0];
            params.createDateTo = params.createTime[1];
            delete params.createTime;
          }

          return expertGetList(params);
        }}
        postData={data => {
          setTotal(data.pageInfo.totalResults);
          return data.items;
        }}
        tableAlertRender={false}
        columns={columns}
        rowSelection={{}}
        options={
          { fullScreen: false, reload: true, setting: true }
        }
      />
      <EditForm ref={editForm} reloadCurrent={actionRef.current} />
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
        title={title}
      >
        <ProTable
          /* onSubmit={async value => {
            const success = await handleAdd(value);

            if (success) {
              handleModalVisible(false);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }} */

          rowKey="userId"
          type="form"
          columns={columns}
          rowSelection={{}}
          form={{ onFinish }}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async value => {
            const success = await handleUpdate(value);

            if (success) {
              handleModalVisible(false);
              setStepFormValues({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};
export default connect(({ user }) => ({
  imInfo: user.imInfo,
}))(TableList);
