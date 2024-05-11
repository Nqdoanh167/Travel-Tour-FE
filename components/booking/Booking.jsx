/** @format */

import React, {useState} from 'react';

import styles from './booking.module.scss';
import {Modal, Select} from 'antd';
import {Button, Form, Input} from 'antd';
import Image from 'next/image';
import {useSelector} from 'react-redux';
import {FormatDate} from '@/utils/utils';
import {createBooking} from '@/api/Booking';
import Message from '@/utils/Message';
const {TextArea} = Input;
export default function Booking({openModalBooking, setOpenModalBooking, tour}) {
   const user = useSelector((state) => state.user);
   const handleOk = () => {
      setOpenModalBooking(false);
   };
   const handleCancel = () => {
      setOpenModalBooking(false);
   };
   const handleBooking = async (values) => {
      const data = {...values, price: tour.price, tour: tour._id, user: user.id};
      console.log(data);
      const res = await createBooking(data, user.token);
      if (res?.status == 201) {
         // payment
         new Message('Booking thành công').success();
         // send Email
      }
      setOpenModalBooking(false);
   };
   return (
      <Modal
         // title='Basic Modal'
         open={openModalBooking}
         onOk={handleOk}
         onCancel={handleCancel}
         className={styles.modal}
         footer={null}
      >
         <div className={styles.modalContent}>
            <div className={styles.infoTour}>
               <div className='imgTour'>
                  <Image
                     src={tour.imageCover}
                     alt='Image Cover'
                     width={340}
                     height={220}
                     className={styles.imageCover}
                  />
               </div>
               <div className={styles.booking}>
                  <div className={styles.name}>{tour?.name}</div>
                  <div className={styles.content}>
                     <p>Số người tham gia : {tour?.maxGroupSize}</p>
                     <p>Thời gian : {tour?.duration}</p>
                     <p>Độ khó : {tour?.difficulty}</p>
                     <p>Quãng đường : {tour?.distance}</p>
                  </div>
                  <div className={styles.price}>{tour?.price}.000 ₫</div>
               </div>
            </div>
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
                     maxWidth: 800,
                     fontWeight: '500',
                     fontSize: '26px',
                  }}
                  onFinish={handleBooking}
                  initialValues={{nameUserBooking: user.name, phoneUserBooking: user.phone}}
               >
                  <Form.Item
                     style={{
                        marginBottom: 0,
                     }}
                  >
                     <Form.Item
                        name='nameUserBooking'
                        rules={[
                           {
                              required: true,
                              message: 'Vui lòng nhập tên của bạn',
                           },
                        ]}
                        style={{
                           display: 'inline-block',
                           width: 'calc(50% - 8px)',
                           marginRight: '16px',
                        }}
                     >
                        <Input
                           placeholder='Họ và tên...'
                           className={styles.input_form}
                           // defaultValue={user.name}
                           // value={user.name}
                        />
                     </Form.Item>
                     <Form.Item
                        name='phoneUserBooking'
                        rules={[
                           {
                              required: true,
                              message: 'Vui lòng cung cấp số điện thoại',
                           },
                        ]}
                        style={{
                           display: 'inline-block',
                           width: 'calc(50% - 8px)',
                        }}
                     >
                        <Input
                           placeholder='Số điện thoại...'
                           className={styles.input_form}
                           // defaultValue={user.phone}
                           // value={user.phone}
                        />
                     </Form.Item>
                  </Form.Item>
                  <Form.Item
                     style={{
                        marginBottom: 0,
                     }}
                  >
                     <Form.Item
                        name='quantityGroup'
                        rules={[
                           {
                              required: true,
                              message: 'Vui lòng nhập số lượng người tham gia',
                           },
                        ]}
                        style={{
                           display: 'inline-block',
                           width: 'calc(50% - 8px)',
                           marginRight: '16px',
                        }}
                     >
                        <Input placeholder='Nhập số lượng người tham gia...' className={styles.input_form} />
                     </Form.Item>
                     <Form.Item
                        name='startDate'
                        rules={[
                           {
                              required: true,
                              message: 'Vui lòng chọn thời gian bắt đầu',
                           },
                        ]}
                        style={{
                           display: 'inline-block',
                           width: 'calc(50% - 8px)',
                        }}
                        className={styles.select}
                     >
                        <Select className={styles.select_form} placeholder='Chọn thời gian bắt đầu'>
                           {tour.startDates.map((item) => (
                              <Select.Option key={item} value={item}>
                                 {FormatDate(item)}
                                 {/* {item} */}
                              </Select.Option>
                           ))}
                        </Select>
                     </Form.Item>
                  </Form.Item>
                  <Form.Item label='TextArea' name='note'>
                     <TextArea rows={4} placeholder='Nhập ghi chú...' className={styles.input_form} />
                  </Form.Item>
                  <Form.Item style={{textAlign: 'center'}}>
                     <Button type='primary' htmlType='submit' className={styles.btn_submit}>
                        Gửi yêu cầu
                     </Button>
                  </Form.Item>
               </Form>
            </div>
         </div>
      </Modal>
   );
}
