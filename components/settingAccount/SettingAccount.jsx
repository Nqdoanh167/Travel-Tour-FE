/** @format */
'use client';
import React, {useState} from 'react';
import styles from './setting.module.scss';
import {Button, Form, Input, Spin, Upload} from 'antd';
import {UpdateMeApi, UpdatePasswordApi} from '@/api/User';
import {useDispatch, useSelector} from 'react-redux';
import {resetUser, updateUser} from '@/redux/reducers/userSlide';
import Cookies from 'js-cookie';
import {PlusOutlined} from '@ant-design/icons';
import Message from '@/utils/Message';
export default function SettingAccount() {
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();

   const handleLogout = async () => {
      setLoading(true);
      window.setTimeout(() => {
         location.reload();
      }, 1000);
      dispatch(resetUser());
      Cookies.remove('jwt');
   };

   const user = useSelector((state) => state.user);
   const normFile = (e) => {
      if (Array.isArray(e)) {
         return e;
      }
      return e.fileList;
   };

   const fileList = [
      {
         uid: '-1',
         name: 'ImageUser.jpeg',
         status: 'done',
         url: user.photo,
      },
   ];
   const handleUpdateUser = async (values) => {
      const {name, phone, photo} = values;
      const formData = new FormData();
      formData.append('name', name ? name : user.name);
      formData.append('phone', phone ? phone : user.phone);
      if (photo) formData.append('photo', photo[0].originFileObj);
      const res = await UpdateMeApi(formData, user.token);
      if (res.status == 200) {
         dispatch(updateUser({...res?.data.data.user}));
         new Message('Cập nhật thông tin thành công!').success();
      }
   };
   const handleChangePassword = async (values) => {
      const {passwordCurrent, password, passwordConfirm} = values;
      const res = await UpdatePasswordApi({passwordCurrent, password, passwordConfirm}, user.token);
      if (res?.status == 200) {
         new Message('Cập nhật mật khẩu thành công!').success();
         window.location.reload();
      }
   };
   return (
      <div>
         <Spin spinning={loading} fullscreen={true} />
         <div className={styles.form_container}>
            <div style={{textAlign: 'right'}}>
               <Button type='primary' className={styles.btn_logout} onClick={handleLogout}>
                  Đăng xuất
               </Button>
            </div>
            <div className={styles.heading_secondary}>Sửa thông tin cá nhân </div>
            <Form
               labelCol={{
                  span: 24,
               }}
               wrapperCol={{
                  span: 24,
               }}
               layout='horizontal'
               style={{
                  maxWidth: 600,
                  marginTop: '20px',
               }}
               onFinish={handleUpdateUser}
            >
               <Form.Item label='Tên' name='name'>
                  <Input
                     placeholder='Nhập tên của bạn...'
                     className={styles.input_form}
                     defaultValue={user.name}
                     value={user.name}
                  />
               </Form.Item>
               <Form.Item label='Số điện thoại' name='phone'>
                  <Input
                     placeholder='Nhập số điện thoại...'
                     className={styles.input_form}
                     defaultValue={user.phone}
                     value={user.phone}
                  />
               </Form.Item>

               <Form.Item valuePropName='fileList' getValueFromEvent={normFile} name='photo'>
                  <Upload
                     action='http://localhost:3000'
                     listType='picture-card'
                     maxCount={1}
                     accept='image/*'
                     defaultFileList={[...fileList]}
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
                           Thêm ảnh
                        </div>
                     </button>
                  </Upload>
               </Form.Item>
               <div style={{textAlign: 'right'}}>
                  <Button type='primary' htmlType='submit' className={styles.btn_submit}>
                     Cập nhật
                  </Button>
               </div>
            </Form>
         </div>
         <div className={styles.separate}></div>
         <div className={styles.form_container}>
            <div className={styles.heading_secondary}>Thay đổi mật khẩu </div>
            <Form
               labelCol={{
                  span: 24,
               }}
               wrapperCol={{
                  span: 24,
               }}
               layout='horizontal'
               style={{
                  maxWidth: 600,
                  marginTop: '20px',
               }}
               onFinish={handleChangePassword}
            >
               <Form.Item
                  label='Mật khẩu hiện tại'
                  name='passwordCurrent'
                  rules={[
                     {
                        required: true,
                        message: 'Vui lòng nhập mật khẩu hiện tại của bạn!',
                     },
                     {
                        min: 8,
                        message: 'Mật khẩu phải có ít nhất 8 ký tự!',
                     },
                  ]}
               >
                  <Input.Password placeholder='Nhập mật khẩu hiện tại...' className={styles.input_form} />
               </Form.Item>
               <Form.Item
                  label='Mật khẩu mới'
                  name='password'
                  rules={[
                     {
                        required: true,
                        message: 'Vui lòng nhập mật khẩu mới!',
                     },
                     {
                        min: 8,
                        message: 'Mật khẩu phải có ít nhất 8 ký tự!',
                     },
                  ]}
               >
                  <Input.Password placeholder='Nhập mật khẩu mới...' className={styles.input_form} />
               </Form.Item>
               <Form.Item
                  label='Xác nhận mật khẩu'
                  name='passwordConfirm'
                  rules={[
                     {
                        required: true,
                        message: 'Vui lòng xác nhận mật khẩu!',
                     },
                     {
                        min: 8,
                        message: 'Mật khẩu phải có ít nhất 8 ký tự!',
                     },
                  ]}
               >
                  <Input.Password placeholder='Xác nhận mật khẩu...' className={styles.input_form} />
               </Form.Item>
               <div style={{textAlign: 'right'}}>
                  <Button type='primary' htmlType='submit' className={styles.btn_submit}>
                     Thay đổi
                  </Button>
               </div>
            </Form>
         </div>
      </div>
   );
}
