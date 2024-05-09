/** @format */
'use client';
import React, {useEffect, useState} from 'react';
import styles from './managetour.module.scss';
import {Button, DatePicker, Form, Input, Modal, Popconfirm, Select, Upload} from 'antd';
import {Table} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {createTour, deleteTour, getAllTours, getTourBySlug, updateTour} from '@/api/Tour';
import {useSelector} from 'react-redux';
import Message from '@/utils/Message';
import dayjs from 'dayjs';
import {getGuide} from '@/api/User';
import {ConvertRole} from '@/utils/utils';
const {TextArea} = Input;
const normFile = (e) => {
   if (Array.isArray(e)) {
      return e;
   }
   return e.fileList;
};
export default function ManageTour() {
   const [openModalTourDetail, setOpenModalTourDetail] = useState(false);
   const [openModalAddTour, setOpenModalAddTour] = useState(false);
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
   const [listGuide, setListGuide] = useState([]);
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
      console.log('sorter', sorter);
   };
   const fetchData = async () => {
      setLoading(true);
      const res = await getAllTours({
         page: tableParams.pagination.current,
         limit: tableParams.pagination.pageSize,
         sort: 'name',
      });
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
   // lấy data list guide
   const getGuideData = async () => {
      const res = await getGuide(user.token);
      setListGuide(res.data.data);
   };
   useEffect(() => {
      getGuideData();
   }, []);
   const columns = [
      {
         title: 'Name',
         dataIndex: 'name',
         // showSorterTooltip: {
         //    target: 'full-header',
         // },
      },
      {
         title: 'Thời gian',
         dataIndex: 'duration',
      },
      {
         title: 'Độ khó',
         dataIndex: 'difficulty',
      },
      {
         title: 'Giá',
         dataIndex: 'price',
         // defaultSortOrder: 'descend',
         // sorter: (a, b) => a.price - b.price,
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
      const res = await getTourBySlug(record.slug);
      const data = res.data.data;
      if (data.startDates) {
         data.startDates = data.startDates.map((date) => dayjs(date));
      }
      if (data.imageCover) {
         data.imageCover = [
            {
               uid: '-1',
               name: data.imageCover,
               status: 'done',
               url: data.imageCover,
            },
         ];
      }
      if (data.images) {
         data.images = data.images.map((image, index) => ({
            key: index,
            uid: index,
            name: image,
            status: 'done',
            url: image,
         }));
      }
      setSelectedRecord(data);
      setOpenModalTourDetail(true);
   };

   const handleAdd = () => {
      setOpenModalAddTour(true);
   };
   const handleDelete = async (id) => {
      const res = await deleteTour(id, user.token);
      if (res.status == 204) {
         new Message('Xóa tour thành công!').success();
         fetchData();
      }
   };
   const handleOkModalEditTour = () => {
      setOpenModalTourDetail(false);
   };

   const handleCancelModalEditTour = () => {
      setOpenModalTourDetail(false);
   };
   const handleOkModalAddTour = () => {
      setOpenModalAddTour(false);
   };

   const handleCancelModalAddTour = () => {
      setOpenModalAddTour(false);
   };

   const handleAddTour = async (values) => {
      // Trích xuất giá trị từ trường Input
      const {
         difficulty,
         distance,
         duration,
         endDestination,
         imageCover,
         images,
         maxGroupSize,
         name,
         price,
         startDates,
         startDestination,
         summary,
         priceDiscount,
         description,
         guides,
      } = values;
      // Tạo một đối tượng FormData
      const formData = new FormData();

      // Thêm giá trị vào đối tượng FormData
      formData.append('name', name);
      formData.append('difficulty', difficulty);
      formData.append('distance', distance);
      formData.append('duration', duration);
      formData.append('endDestination', endDestination);
      formData.append('imageCover', imageCover[0].originFileObj);
      images.forEach((image) => {
         formData.append('images', image.originFileObj);
      });
      formData.append('maxGroupSize', maxGroupSize);
      formData.append('price', price);
      startDates.forEach((startDate) => {
         formData.append('startDates', startDate.toISOString());
      });
      formData.append('startDestination', startDestination);
      formData.append('summary', summary);
      formData.append('priceDiscount', priceDiscount);
      formData.append('description', description);
      guides.forEach((guide) => {
         formData.append('guides', guide);
      });

      const res = await createTour(formData, user.token);
      if (res?.status == 201) {
         new Message('Thêm mới tour thành công!').success();
         fetchData();
      }
      setOpenModalAddTour(false);
   };
   const handleEditTour = async (values) => {
      // Trích xuất giá trị từ trường Input
      const {
         difficulty,
         distance,
         duration,
         endDestination,
         imageCover,
         images,
         maxGroupSize,
         name,
         price,
         startDates,
         startDestination,
         summary,
         priceDiscount,
         description,
         guides,
      } = values;

      // Tạo một đối tượng FormData
      const formData = new FormData();

      // Thêm giá trị vào đối tượng FormData
      formData.append('name', name ? name : selectedRecord.name);
      formData.append('difficulty', difficulty ? difficulty : selectedRecord.difficulty);
      formData.append('distance', distance ? distance : selectedRecord.distance);
      formData.append('duration', duration ? duration : selectedRecord.duration);
      formData.append('endDestination', endDestination ? endDestination : selectedRecord.endDestination);
      if (imageCover[0].originFileObj) {
         formData.append('imageCover', imageCover[0].originFileObj);
      }
      images.forEach((image) => {
         if (image.originFileObj) formData.append('images', image.originFileObj);
         else formData.append('images', image.name);
      });
      formData.append('maxGroupSize', maxGroupSize ? maxGroupSize : selectedRecord.maxGroupSize);
      formData.append('price', price ? distance : selectedRecord.distance);
      startDates.forEach((startDate) => {
         formData.append('startDates', startDate.toISOString());
      });
      formData.append('startDestination', startDestination ? startDestination : selectedRecord.startDestination);
      formData.append('summary', summary ? summary : selectedRecord.summary);
      formData.append('priceDiscount', priceDiscount ? priceDiscount : selectedRecord.priceDiscount);
      formData.append('description', description ? description : selectedRecord.description);
      guides.forEach((guide) => {
         formData.append('guides', guide);
      });
      const res = await updateTour(formData, selectedRecord._id, user.token);
      if (res?.status == 200) {
         new Message('Cập nhật tour thành công!').success();
         fetchData();
      }
      setOpenModalTourDetail(false);
   };

   return (
      <div>
         <div className={styles.form_container}>
            <div className={styles.heading_secondary}>QUẢN LÝ TOURS </div>
            <Button type='primary' className={styles.btn_add} onClick={handleAdd}>
               Thêm tour
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
         {openModalTourDetail && (
            <div>
               <Modal
                  title='Sửa Tour'
                  open={openModalTourDetail}
                  onOk={handleOkModalEditTour}
                  onCancel={handleCancelModalEditTour}
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
                           onFinish={handleEditTour}
                           initialValues={selectedRecord}
                        >
                           <Form.Item
                              style={{
                                 marginBottom: 0,
                              }}
                           >
                              <Form.Item
                                 name='name'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập tên tour',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                    marginRight: '16px',
                                 }}
                              >
                                 <Input placeholder='Nhập tên tour...' className={styles.input_form} />
                              </Form.Item>
                              <Form.Item
                                 name='duration'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập thời gian dự kiến',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                 }}
                              >
                                 <Input placeholder='Nhập thời gian dự kiến...' className={styles.input_form} />
                              </Form.Item>
                           </Form.Item>
                           <Form.Item
                              style={{
                                 marginBottom: 0,
                              }}
                           >
                              <Form.Item
                                 name='maxGroupSize'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập số lượng người tối đa',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                    marginRight: '16px',
                                 }}
                              >
                                 <Input placeholder='Nhập số lượng người tối đa...' className={styles.input_form} />
                              </Form.Item>
                              <Form.Item
                                 name='difficulty'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập độ khó tour',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                 }}
                              >
                                 <Input placeholder='Nhập độ khó tour...' className={styles.input_form} />
                              </Form.Item>
                           </Form.Item>
                           <Form.Item
                              style={{
                                 marginBottom: 0,
                              }}
                           >
                              <Form.Item
                                 name='price'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập giá tour',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                    marginRight: '16px',
                                 }}
                              >
                                 <Input placeholder='Nhập giá tour...' className={styles.input_form} />
                              </Form.Item>
                              <Form.Item
                                 name='priceDiscount'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập mã giảm giá',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                 }}
                              >
                                 <Input placeholder='Nhập mã giảm giá...' className={styles.input_form} />
                              </Form.Item>
                           </Form.Item>
                           <Form.Item
                              style={{
                                 marginBottom: 0,
                              }}
                           >
                              <Form.Item
                                 name='startDestination'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập vị trí bắt đầu',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                    marginRight: '16px',
                                 }}
                              >
                                 <Input placeholder='Nhập vị trí bắt đầu...' className={styles.input_form} />
                              </Form.Item>
                              <Form.Item
                                 name='endDestination'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập vị trí điểm đến',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                 }}
                              >
                                 <Input placeholder='Nhập vị trí điểm đến...' className={styles.input_form} />
                              </Form.Item>
                           </Form.Item>
                           <Form.Item
                              style={{
                                 marginBottom: 0,
                              }}
                           >
                              <Form.Item
                                 name='distance'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập khoảng cách',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                    marginRight: '16px',
                                 }}
                              >
                                 <Input placeholder='Nhập khoảng cách...' className={styles.input_form} />
                              </Form.Item>
                              <Form.Item
                                 name='startDates'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập thời gian bắt đầu',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                 }}
                              >
                                 <DatePicker
                                    placeholder='Chọn thời gian bắt đầu...'
                                    className={styles.date_form}
                                    multiple
                                 />
                              </Form.Item>
                           </Form.Item>
                           <Form.Item
                              name='guides'
                              style={{
                                 display: 'inline-block',
                                 width: '100%',
                              }}
                              className={styles.select}
                           >
                              <Select
                                 className={styles.select_form}
                                 mode='multiple'
                                 allowClear
                                 placeholder='Chọn hướng dẫn viên'
                              >
                                 {listGuide.map((item) => (
                                    <Select.Option key={item._id} value={item._id}>
                                       {`${item.name} - ${ConvertRole(item.role)}`}
                                    </Select.Option>
                                 ))}
                              </Select>
                           </Form.Item>
                           <Form.Item
                              label='Upload'
                              valuePropName='fileList'
                              getValueFromEvent={normFile}
                              name='imageCover'
                              rules={[
                                 {
                                    required: true,
                                    message: 'Vui lòng thêm ảnh',
                                 },
                              ]}
                           >
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
                                       Upload Ảnh Cover
                                    </div>
                                 </button>
                              </Upload>
                           </Form.Item>
                           <Form.Item
                              label='Upload'
                              valuePropName='fileList'
                              getValueFromEvent={normFile}
                              name='images'
                              rules={[
                                 {
                                    required: true,
                                    message: 'Vui lòng thêm ảnh',
                                 },
                              ]}
                           >
                              <Upload
                                 action='http://localhost:3000'
                                 listType='picture-card'
                                 maxCount={4}
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
                                       Upload Ảnh Small
                                    </div>
                                 </button>
                              </Upload>
                           </Form.Item>
                           <Form.Item
                              name='summary'
                              rules={[
                                 {
                                    required: true,
                                    message: 'Vui lòng nhập tóm tắt tour',
                                 },
                              ]}
                           >
                              <TextArea rows={2} placeholder='Nhập tóm tắt tour...' className={styles.input_form} />
                           </Form.Item>
                           <Form.Item label='TextArea' name='description'>
                              <TextArea rows={4} placeholder='Nhập thông tin tour...' className={styles.input_form} />
                           </Form.Item>
                           <Form.Item style={{textAlign: 'center'}}>
                              <Button type='primary' htmlType='submit' className={styles.btn_submit}>
                                 Sửa tour
                              </Button>
                           </Form.Item>
                        </Form>
                     </div>
                  </div>
               </Modal>
            </div>
         )}
         {openModalAddTour && (
            <div>
               <Modal
                  title='Thêm Tour'
                  open={openModalAddTour}
                  onOk={handleOkModalAddTour}
                  onCancel={handleCancelModalAddTour}
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
                           onFinish={handleAddTour}
                        >
                           <Form.Item
                              style={{
                                 marginBottom: 0,
                              }}
                           >
                              <Form.Item
                                 name='name'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập tên tour',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                    marginRight: '16px',
                                 }}
                              >
                                 <Input placeholder='Nhập tên tour...' className={styles.input_form} />
                              </Form.Item>
                              <Form.Item
                                 name='duration'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập thời gian dự kiến',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                 }}
                              >
                                 <Input placeholder='Nhập thời gian dự kiến...' className={styles.input_form} />
                              </Form.Item>
                           </Form.Item>
                           <Form.Item
                              style={{
                                 marginBottom: 0,
                              }}
                           >
                              <Form.Item
                                 name='maxGroupSize'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập số lượng người tối đa',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                    marginRight: '16px',
                                 }}
                              >
                                 <Input placeholder='Nhập số lượng người tối đa...' className={styles.input_form} />
                              </Form.Item>
                              <Form.Item
                                 name='difficulty'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập độ khó tour',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                 }}
                              >
                                 <Input placeholder='Nhập độ khó tour...' className={styles.input_form} />
                              </Form.Item>
                           </Form.Item>
                           <Form.Item
                              style={{
                                 marginBottom: 0,
                              }}
                           >
                              <Form.Item
                                 name='price'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập giá tour',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                    marginRight: '16px',
                                 }}
                              >
                                 <Input placeholder='Nhập giá tour...' className={styles.input_form} />
                              </Form.Item>
                              <Form.Item
                                 name='priceDiscount'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập mã giảm giá',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                 }}
                              >
                                 <Input placeholder='Nhập mã giảm giá...' className={styles.input_form} />
                              </Form.Item>
                           </Form.Item>
                           <Form.Item
                              style={{
                                 marginBottom: 0,
                              }}
                           >
                              <Form.Item
                                 name='startDestination'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập vị trí bắt đầu',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                    marginRight: '16px',
                                 }}
                              >
                                 <Input placeholder='Nhập vị trí bắt đầu...' className={styles.input_form} />
                              </Form.Item>
                              <Form.Item
                                 name='endDestination'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập vị trí điểm đến',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                 }}
                              >
                                 <Input placeholder='Nhập vị trí điểm đến...' className={styles.input_form} />
                              </Form.Item>
                           </Form.Item>
                           <Form.Item
                              style={{
                                 marginBottom: 0,
                              }}
                           >
                              <Form.Item
                                 name='distance'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập khoảng cách',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                    marginRight: '16px',
                                 }}
                              >
                                 <Input placeholder='Nhập khoảng cách...' className={styles.input_form} />
                              </Form.Item>
                              <Form.Item
                                 name='startDates'
                                 rules={[
                                    {
                                       required: true,
                                       message: 'Vui lòng nhập thời gian bắt đầu',
                                    },
                                 ]}
                                 style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                 }}
                              >
                                 <DatePicker
                                    placeholder='Chọn thời gian bắt đầu...'
                                    className={styles.date_form}
                                    multiple
                                 />
                              </Form.Item>
                           </Form.Item>
                           <Form.Item
                              name='guides'
                              style={{
                                 display: 'inline-block',
                                 width: '100%',
                              }}
                              className={styles.select}
                           >
                              <Select
                                 className={styles.select_form}
                                 mode='multiple'
                                 allowClear
                                 placeholder='Chọn hướng dẫn viên'
                              >
                                 {listGuide.map((item) => (
                                    <Select.Option key={item._id} value={item._id}>
                                       {`${item.name} - ${ConvertRole(item.role)}`}
                                    </Select.Option>
                                 ))}
                              </Select>
                           </Form.Item>
                           <Form.Item
                              label='Upload'
                              valuePropName='fileList'
                              getValueFromEvent={normFile}
                              name='imageCover'
                              rules={[
                                 {
                                    required: true,
                                    message: 'Vui lòng thêm ảnh',
                                 },
                              ]}
                           >
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
                                       Upload Ảnh Cover
                                    </div>
                                 </button>
                              </Upload>
                           </Form.Item>
                           <Form.Item
                              label='Upload'
                              valuePropName='fileList'
                              getValueFromEvent={normFile}
                              name='images'
                              rules={[
                                 {
                                    required: true,
                                    message: 'Vui lòng thêm ảnh',
                                 },
                              ]}
                           >
                              <Upload
                                 action='http://localhost:3000'
                                 listType='picture-card'
                                 maxCount={4}
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
                                       Upload Ảnh Small
                                    </div>
                                 </button>
                              </Upload>
                           </Form.Item>
                           <Form.Item
                              name='summary'
                              rules={[
                                 {
                                    required: true,
                                    message: 'Vui lòng nhập tóm tắt tour',
                                 },
                              ]}
                           >
                              <TextArea rows={2} placeholder='Nhập tóm tắt tour...' className={styles.input_form} />
                           </Form.Item>
                           <Form.Item label='TextArea' name='description'>
                              <TextArea rows={4} placeholder='Nhập thông tin tour...' className={styles.input_form} />
                           </Form.Item>
                           <Form.Item style={{textAlign: 'center'}}>
                              <Button type='primary' htmlType='submit' className={styles.btn_submit}>
                                 Thêm tour
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
