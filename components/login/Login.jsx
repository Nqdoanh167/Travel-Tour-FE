/** @format */
'use client';
import React, {useContext, useState} from 'react';
import {Modal, Button, Checkbox, Form, Input, Spin} from 'antd';

import styles from './login.module.scss';
import {LoginApi} from '@/api/User';
import Message from '@/utils/Message';
import Cookies from 'js-cookie';
import {useDispatch} from 'react-redux';
import {updateUser} from '@/redux/reducers/userSlide';
import {ChatContext} from '@/context/ChatContext';
export default function Login({openModalLogin, setOpenModalLogin}) {
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();
   const handleCancel = () => {
      setOpenModalLogin(false);
   };

   const handleLogin = async (values) => {
      setLoading(true);
      const res = await LoginApi(values);
      console.log('checklogout');
      if (res?.status == 200) {
         Cookies.set('jwt', res.data.token, {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
         });
         dispatch(updateUser({...res?.data.data.user, token: res.data.token}));

         new Message('Đăng nhập thành công!').success();
         window.setTimeout(() => {
            location.assign('/');
         }, 1500);
      }
      setLoading(false);
   };
   const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
   };
   return (
      <div className={styles.loginWrap}>
         <Modal
            title='Đăng nhập'
            open={openModalLogin}
            footer={null}
            onCancel={handleCancel}
            className={styles.modal_login}
         >
            <Form
               name='basic'
               labelCol={{
                  span: 24,
               }}
               wrapperCol={{
                  offset: 0,
                  span: 24,
               }}
               style={{
                  maxWidth: 500,
                  marginTop: '20px',
               }}
               initialValues={{
                  remember: true,
               }}
               onFinish={handleLogin}
               onFinishFailed={onFinishFailed}
               autoComplete='off'
            >
               <Spin spinning={loading} />
               <Form.Item
                  name='email'
                  rules={[
                     {
                        required: true,
                        message: 'Vui lòng nhập email!',
                     },
                     {
                        type: 'email',
                        message: 'Email không hợp lệ!',
                     },
                  ]}
               >
                  <Input placeholder='Vui lòng nhập email' />
               </Form.Item>

               <Form.Item
                  name='password'
                  rules={[
                     {
                        required: true,
                        message: 'Vui lòng nhập mật khẩu!',
                     },
                     {
                        min: 8,
                        message: 'Mật khẩu phải có ít nhất 8 ký tự!',
                     },
                  ]}
               >
                  <Input.Password placeholder='Vui lòng nhập mật khẩu' />
               </Form.Item>

               <Form.Item
                  wrapperCol={{
                     offset: 0,
                     span: 24,
                  }}
               >
                  <Button type='primary' htmlType='submit' className={styles.btn_submit}>
                     Đăng nhập
                  </Button>
               </Form.Item>
            </Form>
         </Modal>
      </div>
   );
}
