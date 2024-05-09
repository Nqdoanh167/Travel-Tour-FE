/** @format */
'use client';
import React, {useEffect, useState} from 'react';
import styles from './manageuser.module.scss';
import {Button, Form, Input, Modal, Popconfirm, Select, Upload} from 'antd';
import {Table} from 'antd';
import {PlusOutlined} from '@ant-design/icons';

import {useSelector} from 'react-redux';
import Message from '@/utils/Message';
import {createUser, deleteUser, getAllUsers, getUserById, updateUser} from '@/api/User';
import {ConvertRole} from '@/utils/utils';
const {TextArea} = Input;
const normFile = (e) => {
   if (Array.isArray(e)) {
      return e;
   }
   return e.fileList;
};
export default function ManageUser() {
   const [openModalUserDetail, setOpenModalUserDetail] = useState(false);
   const [openModalAddUser, setOpenModelAddUser] = useState(false);
   const user = useSelector((state) => state.user);
   const [selectedRecord, setSelectedRecord] = useState(null);
   const [data, setData] = useState();
   const [loading, setLoading] = useState(false);
   const [tableParams, setTableParams] = useState({
      pagination: {
         current: 1,
         pageSize: 10,
      },
   });
   const handleTableChange = (pagination, filters, sorter) => {
      setTableParams({
         pagination,
         filters,
         ...sorter,
      });

      // `dataSource` is useless since `pageSize` changed
      if (pagination.pageSize !== tableParams.pagination?.pageSize) {
         setData([]);
      }
   };
   const fetchData = async () => {
      setLoading(true);
      const res = await getAllUsers(
         {
            page: tableParams.pagination.current,
            limit: tableParams.pagination.pageSize,
            sort: 'email',
         },
         user.token,
      );
      setData(res.data);
      setLoading(false);
      setTableParams({
         ...tableParams,
         pagination: {
            ...tableParams.pagination,
            total: res.total,
         },
      });
   };
   useEffect(() => {
      fetchData();
   }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

   const columns = [
      {
         title: 'Name',
         dataIndex: 'name',
         // showSorterTooltip: {
         //    target: 'full-header',
         // },
         render: (text) => text || 'chưa cập nhật',
      },
      {
         title: 'Email',
         dataIndex: 'email',
      },
      {
         title: 'Số điện thoại',
         dataIndex: 'phone',
         render: (text) => text || 'chưa cập nhật',
      },
      {
         title: 'Vai trò',
         dataIndex: 'role',
         render: (role, record) => ConvertRole(role),
      },

      {
         title: 'Action',
         dataIndex: 'action',
         render: (_, record) => (
            <div style={{display: 'flex', gap: 20}}>
               <div className='edit'>
                  <a onClick={() => handleEdit(record)}>Edit</a>
               </div>
               {data.length >= 1 ? (
                  <Popconfirm title='Sure to delete?' onConfirm={() => handleDelete(record._id)}>
                     <a style={{color: 'red'}}>Delete</a>
                  </Popconfirm>
               ) : null}
            </div>
         ),
      },
   ];
   const handleEdit = async (record) => {
      const res = await getUserById(record._id, user.token);
      const data = res.data.data;
      if (data.photo) {
         data.photo = [
            {
               uid: '-1',
               name: data.photo,
               status: 'done',
               url: data.photo,
            },
         ];
      }

      setSelectedRecord(data);
      setOpenModalUserDetail(true);
   };

   const handleAdd = () => {
      setOpenModelAddUser(true);
   };
   const handleDelete = async (id) => {
      const res = await deleteUser(id, user.token);
      if (res.status == 204) {
         new Message('Xóa user thành công!').success();
         fetchData();
      }
   };
   const handleOkModalEditUser = () => {
      setOpenModalUserDetail(false);
   };

   const handleCancelModalEditUser = () => {
      setOpenModalUserDetail(false);
   };
   const handleOkModalAddUser = () => {
      setOpenModelAddUser(false);
   };

   const handleCancelModalAddUser = () => {
      setOpenModelAddUser(false);
   };

   const handleAddUser = async (values) => {
      // Trích xuất giá trị từ trường Input
      const {name, email, phone, photo, role} = values;
      console.log(values);
      // Tạo một đối tượng FormData
      const formData = new FormData();

      // Thêm giá trị vào đối tượng FormData
      if (name) formData.append('name', name);
      formData.append('email', email);
      if (phone) formData.append('phone', phone);
      formData.append('role', role);
      if (photo) formData.append('photo', photo[0].originFileObj);
      const res = await createUser(formData, user.token);
      if (res?.status == 201) {
         new Message('Thêm mới user thành công!').success();
         fetchData();
      }
      setOpenModelAddUser(false);
   };
   const handleEditUser = async (values) => {
      // Trích xuất giá trị từ trường Input
      const {name, email, phone, photo, role = 'user'} = values;

      // Tạo một đối tượng FormData
      const formData = new FormData();

      // Thêm giá trị vào đối tượng FormData
      if (name) formData.append('name', name ? name : selectedRecord.name);
      formData.append('email', email ? email : selectedRecord.email);
      if (phone) formData.append('phone', phone ? phone : selectedRecord.phone);
      formData.append('role', role ? role : selectedRecord.role);

      if (photo[0].originFileObj) {
         formData.append('photo', photo[0].originFileObj);
      }

      const res = await updateUser(formData, selectedRecord._id, user.token);
      if (res?.status == 200) {
         new Message('Cập nhật user thành công!').success();
         fetchData();
         setOpenModalUserDetail(false);
      }
   };
   return (
      <div>
         <div className={styles.form_container}>
            <div className={styles.heading_secondary}>QUẢN LÝ USERS </div>
            <Button type='primary' className={styles.btn_add} onClick={handleAdd}>
               Thêm user
            </Button>
            <Table
               columns={columns}
               rowKey={(record) => record._id}
               dataSource={data}
               pagination={tableParams.pagination}
               loading={loading}
               onChange={handleTableChange}
            />
         </div>
         {openModalUserDetail && (
            <div>
               <Modal
                  title='Sửa User'
                  open={openModalUserDetail}
                  onOk={handleOkModalEditUser}
                  onCancel={handleCancelModalEditUser}
                  footer={null}
               >
                  <div className={styles.modalContent}>
                     <div className={styles.form}>
                        <Form
                           labelCol={{
                              span: 0,
                           }}
                           wrapperCol={{
                              span: 24,
                           }}
                           layout='horizontal'
                           style={{
                              maxWidth: 1200,
                              fontWeight: '500',
                              fontSize: '26px',
                           }}
                           onFinish={handleEditUser}
                           initialValues={selectedRecord}
                        >
                           <Form.Item
                              style={{
                                 marginBottom: 0,
                              }}
                           >
                              <Form.Item
                                 name='name'
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                    marginRight: '16px',
                                 }}
                              >
                                 <Input placeholder='Nhập tên user...' className={styles.input_form} />
                              </Form.Item>
                              <Form.Item
                                 name='email'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập email',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                 }}
                              >
                                 <Input placeholder='Nhập email...' className={styles.input_form} disabled />
                              </Form.Item>
                           </Form.Item>
                           <Form.Item
                              style={{
                                 marginBottom: 0,
                              }}
                           >
                              <Form.Item
                                 name='phone'
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                    marginRight: '16px',
                                 }}
                              >
                                 <Input placeholder='Nhập số điện thoại...' className={styles.input_form} />
                              </Form.Item>

                              <Form.Item
                                 name='role'
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                 }}
                                 className={styles.select}
                              >
                                 <Select defaultValue='user'>
                                    <Select.Option value='admin'>Admin</Select.Option>
                                    <Select.Option value='lead-guide'>Hướng dẫn viên trưởng</Select.Option>
                                    <Select.Option value='guide'>Hướng dẫn viên</Select.Option>
                                    <Select.Option value='user'>User</Select.Option>
                                 </Select>
                              </Form.Item>
                           </Form.Item>
                           <Form.Item label='Upload' valuePropName='fileList' getValueFromEvent={normFile} name='photo'>
                              <Upload
                                 action='http://localhost:3000'
                                 listType='picture-card'
                                 maxCount={1}
                                 accept='image/*'
                              >
                                 <button
                                    style={{
                                       border: 0,
                                       background: 'none',
                                    }}
                                    type='button'
                                 >
                                    <PlusOutlined />
                                    <div
                                       style={{
                                          marginTop: 8,
                                          color: '#a9a6a6',
                                          fontWeight: 500,
                                       }}
                                    >
                                       Upload Ảnh User
                                    </div>
                                 </button>
                              </Upload>
                           </Form.Item>

                           <Form.Item style={{textAlign: 'center'}}>
                              <Button type='primary' htmlType='submit' className={styles.btn_submit}>
                                 Chỉnh sửa
                              </Button>
                           </Form.Item>
                        </Form>
                     </div>
                  </div>
               </Modal>
            </div>
         )}
         {openModalAddUser && (
            <div>
               <Modal
                  title='Thêm User'
                  open={openModalAddUser}
                  onOk={handleOkModalAddUser}
                  onCancel={handleCancelModalAddUser}
                  footer={null}
               >
                  <div className={styles.modalContent}>
                     <div className={styles.form}>
                        <Form
                           labelCol={{
                              span: 0,
                           }}
                           wrapperCol={{
                              span: 24,
                           }}
                           layout='horizontal'
                           style={{
                              maxWidth: 1200,
                              fontWeight: '500',
                              fontSize: '26px',
                           }}
                           onFinish={handleAddUser}
                        >
                           <Form.Item
                              style={{
                                 marginBottom: 0,
                              }}
                           >
                              <Form.Item
                                 name='name'
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                    marginRight: '16px',
                                 }}
                              >
                                 <Input placeholder='Nhập tên user...' className={styles.input_form} />
                              </Form.Item>
                              <Form.Item
                                 name='email'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập email',
                                    },
                                    {
                                       type: 'email',
                                       message: 'Email không hợp lệ!',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                 }}
                              >
                                 <Input placeholder='Nhập email...' className={styles.input_form} />
                              </Form.Item>
                           </Form.Item>
                           <Form.Item
                              style={{
                                 marginBottom: 0,
                              }}
                           >
                              <Form.Item
                                 name='phone'
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                    marginRight: '16px',
                                 }}
                              >
                                 <Input placeholder='Nhập số điện thoại...' className={styles.input_form} />
                              </Form.Item>
                              <Form.Item
                                 name='role'
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                 }}
                                 className={styles.select}
                              >
                                 <Select className={styles.select_form} placeholder='Chọn vai trò'>
                                    <Select.Option value='admin'>Admin</Select.Option>
                                    <Select.Option value='lead-guide'>Hướng dẫn viên trưởng</Select.Option>
                                    <Select.Option value='guide'>Hướng dẫn viên</Select.Option>
                                    <Select.Option value='user'>User</Select.Option>
                                 </Select>
                              </Form.Item>
                           </Form.Item>
                           <Form.Item label='Upload' valuePropName='fileList' getValueFromEvent={normFile} name='photo'>
                              <Upload
                                 action='http://localhost:3000'
                                 listType='picture-card'
                                 maxCount={1}
                                 accept='image/*'
                              >
                                 <button
                                    style={{
                                       border: 0,
                                       background: 'none',
                                    }}
                                    type='button'
                                 >
                                    <PlusOutlined />
                                    <div
                                       style={{
                                          marginTop: 8,
                                          color: '#a9a6a6',
                                          fontWeight: 500,
                                       }}
                                    >
                                       Upload Ảnh User
                                    </div>
                                 </button>
                              </Upload>
                           </Form.Item>

                           <Form.Item style={{textAlign: 'center'}}>
                              <Button type='primary' htmlType='submit' className={styles.btn_submit}>
                                 Thêm user
                              </Button>
                           </Form.Item>
                        </Form>
                     </div>
                  </div>
               </Modal>
            </div>
         )}
      </div>
   );
}
