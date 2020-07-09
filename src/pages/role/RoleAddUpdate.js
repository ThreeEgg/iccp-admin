import React, { Component, createRef } from 'react';
import { Modal, Form, Input, Button, Select, message, Tree } from 'antd';
import * as imService from '@/services/role';

export class RoleAddUpdate extends Component {
  state = {
    visible: false,
    title: '',
    data: '',
    roleLimitTree: '',
    permissionIds: '',
    selectedKeys: []
  };

  formRef = createRef();

  componentDidMount() {
    this.getRoleLimit();
  }

  getRoleLimit = async () => {
    const {
      data: { permissionTree },
      code,
    } = await imService.getRoleLimit();
    if (code === '0') {
      this.setState({
        roleLimitTree: permissionTree,
      });
    }
  };

  onFinish = async params => {
    console.log('this.formRef', this.formRef.current)
    const { data, permissionIds } = this.state;
    params.id = data ? data.id : '';
    /* console.log('params', params)
    if (!params.id) {
      delete params.id
    } */
    const { code, msg } = await imService.addRole({
      ...params,
      permissionIds: permissionIds.join(','),
    });
    if (code === '0') {
      message.success(msg);
      this.props.getRoleInfo.current.reload();
      this.handleCancel();
    }
  };

  modalShow = (type, data) => {
    if (type === 'add') {
      this.setState({
        visible: true,
        title: '新建',
        data: '',
      }, () => {
        this.getRoleLimit();
      });
    } else if (type === 'update') {
      this.setState({
        visible: true,
        title: '编辑',
        data,
      }, () => {
        this.getRoleInfo(data.id)
      });

    }

  };

  getRoleInfo = async (id) => {
    const {
      data: { permissionTree },
      code,
    } = await imService.getRoleLimit(id);
    if (code === '0') {
      const selectedKeys = this.handleTree(permissionTree)
      this.setState({
        roleLimitTree: permissionTree,
        // selectedKeys
      });
      this.checkTree(selectedKeys)
    }
  }

  handleTree = tree => {
    const permissions = []
    const treeMap = (tree) => {
      tree.map(item => {
        if (item.isCheck) {
          permissions.push(item.id)
        }
        if (item.children && item.children.length > 0) {
          return treeMap(item.children)
        }
      })
    }
    treeMap(tree);
    return permissions
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      data: '',
      roleLimitTree: '',
      selectedKeys: []
    });
  };

  renderTreeNode = data =>
    data.map(item => {
      //  渲染树节点
      const { TreeNode } = Tree;
      if (item.children) {
        return (
          <TreeNode title={item.description} key={item.id} dataRef={item}>
            {this.renderTreeNode(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.description} key={item.id} dataRef={item} />;
    });

  checkTree = checkedKeys => {
    this.setState({
      permissionIds: checkedKeys,
      selectedKeys: checkedKeys
    });
    this.formRef.current && this.formRef.current.setFieldsValue({
      permissionIds: checkedKeys
    })
  };

  initTreeData = arr => {
    arr.map(item => {
      item.title = item.description;
      item.key = item.id;
      if (item.children) {
        this.initTreeData(item.children);
      }
    });
    return arr;
  };

  render() {
    const { Option } = Select;

    const { visible, title, data, roleLimitTree, selectedKeys } = this.state;
    return (
      <Modal title={title} visible={visible}
        onCancel={this.handleCancel}
        destroyOnClose
        okButtonProps={{
          form: 'roleForm',
          htmlType: 'submit',
        }}
      >
        <Form onFinish={this.onFinish}
          initialValues={data} name="roleForm"
          ref={this.formRef}
        >
          <Form.Item
            label="角色名称"
            name="description"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请选择角色名称" />
          </Form.Item>
          <Form.Item
            label="角色类型"
            name="roleType"
            rules={[{ required: true, message: '请选择角色类型' }]}
          >
            <Select placeholder="请选择角色类型" style={{ width: '80%' }}>
              <Option value="admin">管理员</Option>
              <Option value="service">客服</Option>
            </Select>
          </Form.Item>
          <Form.Item label="功能权限" name="permissionIds"
            rules={[{ required: true, message: '请选择功能权限' }]}
          >
            <Tree
              checkable
              multiple
              checkedKeys={selectedKeys}
              onCheck={this.checkTree}
              treeData={roleLimitTree && this.initTreeData(roleLimitTree)}

            >
              {/* {roleLimitTree && this.renderTreeNode(roleLimitTree)} */}
            </Tree>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default RoleAddUpdate;
