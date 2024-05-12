/** @format */
'use client';
import React, {useState} from 'react';
import {Modal, Button, Checkbox, Form, Input, Spin} from 'antd';
import styles from './register.module.scss';
import {RegisterApi} from '@/api/User';
import Message from '@/utils/Message';
export default function Register({openModalRegister, setOpenModalRegister, setOpenModalLogin}) {
   const [loading, setLoading] = useState(false);
   const handleCancel = () => {
      setOpenModalRegister(false);
   };

   const handleRegister = async (values) => {
      setLoading(true);
      const res = await RegisterApi(values);
      if (res?.status == 201) {
         new Message('Đăng ký thành công!').success();
         setOpenModalRegister(false);
         setTimeout(() => {
            setOpenModalLogin(true);
         }, 1000);
      }
   };
   const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
   };
   return (
      <div className={styles.loginWrap}>
         <Modal
            title='Đăng ký'
            open={openModalRegister}
            footer={null}
            onCancel={handleCancel}
            className={styles.modal_register}
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
               onFinish={handleRegister}
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
                  name='passwordConfirm'
                  rules={[
                     {
                        required: true,
                        message: 'Vui lòng xác nhận mật khẩu!',
                     },
                  ]}
               >
                  <Input.Password placeholder='Vui lòng xác nhận mật khẩu' />
               </Form.Item>
               <Form.Item
                  wrapperCol={{
                     offset: 0,
                     span: 24,
                  }}
               >
                  <Button type='primary' htmlType='submit' className={styles.btn_submit}>
                     Đăng ký
                  </Button>
               </Form.Item>
            </Form>
         </Modal>
      </div>
   );
}
