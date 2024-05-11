/** @format */
'use client';
import React, {useEffect, useState} from 'react';
import styles from './tourDetail.module.scss';
import {Button, Col, Form, Image, Rate, Row, Spin} from 'antd';
import Booking from '@/components/booking/Booking';
import {getTourBySlug} from '@/api/Tour';
import {useParams} from 'next/navigation';
import TextArea from 'antd/es/input/TextArea';
import {createReview, getAllReviewOnTour, getReviewOnTour} from '@/api/Review';
import {useSelector} from 'react-redux';
import Message from '@/utils/Message';

export default function TourDetail() {
   const params = useParams();
   const [openModalBooking, setOpenModalBooking] = useState(false);
   const [infoTour, setInfoTour] = useState([]);
   const [listReview, setListReview] = useState([]);
   const [review, setReview] = useState(null);
   const [loading, setLoading] = useState(true);
   const user = useSelector((state) => state.user);
   const handleBooking = () => {
      setOpenModalBooking(true);
   };
   const getPage = async () => {
      const tour = await getTourBySlug(params.id);
      const allReviewOnTour = await getAllReviewOnTour(tour?.data.data._id);
      const reviewOnTour = await getReviewOnTour(tour?.data.data._id, user.token);
      setInfoTour(tour?.data.data);
      setListReview(allReviewOnTour?.data.data);
      setReview(reviewOnTour?.data.data);
   };

   const handleReview = async (values) => {
      let data;
      data = {...values, tour: infoTour._id};
      const res = await createReview(data, user.token);
      if (res?.status == 201) {
         new Message('Cảm ơn bạn đã  đánh giá').success();
         setReview(res?.data.data);
         getPage();
      }
   };
   useEffect(() => {
      getPage();
      setTimeout(() => {
         setLoading(false);
      }, 1500);
   }, []);

   return (
      <>
         <Spin spinning={loading} fullscreen={true} />
         <div className={styles.container}>
            <Row gutter={20}>
               <Col span={17} className={styles.left}>
                  <div className={styles.imageWrap}>
                     <div className={styles.imageCover}>
                        <Image src={infoTour.imageCover} alt='Image Cover' width={903} height={400} />
                     </div>
                     <div className={styles.imageSmall}>
                        {infoTour.images &&
                           infoTour.images.map((image, index) => (
                              <Image src={image} alt='Image Small' width={213} height={120} key={index} />
                           ))}
                     </div>
                  </div>
                  <div className={styles.descTour}>
                     <div className={styles.title}>Chi tiết</div>
                     <div className={styles.content} style={{whiteSpace: 'pre-wrap'}}>
                        {infoTour.description && infoTour.description.split('. ').join('.\n')}
                     </div>
                  </div>
                  <div className={styles.reviewTour}>
                     <Row gutter={20}>
                        <Col span={12}>
                           <div className={styles.title}>Review</div>
                           <div className={styles.content}>
                              {listReview.length > 0 ? (
                                 listReview.map((review, index) => (
                                    <div className={styles.content_item} key={index}>
                                       <div className={styles.user}>
                                          <div>
                                             <Image
                                                src={user.photo}
                                                alt='User'
                                                width={20}
                                                height={20}
                                                className={styles.imgUser}
                                             />
                                          </div>
                                          <div className={styles.nameUser}>{review?.user.name}</div>
                                       </div>
                                       <div className={styles.rating}>
                                          <Rate allowHalf defaultValue={review.rating} style={{fontSize: '16px'}} />
                                       </div>
                                       <div className={styles.comment}>{review.review}</div>
                                    </div>
                                 ))
                              ) : (
                                 <span>Chưa có bản đánh giá nào</span>
                              )}
                           </div>
                        </Col>
                        <Col span={12}>
                           <div className={styles.title}>Review của bạn</div>
                           <div className={styles.content}>
                              <div className={styles.content_item}>
                                 <div className={styles.user}>
                                    <div>
                                       <Image
                                          src={user.photo}
                                          alt='User'
                                          width={20}
                                          height={20}
                                          className={styles.imgUser}
                                       />
                                    </div>
                                    <div className={styles.nameUser}>{user?.name}</div>
                                 </div>

                                 <Form
                                    labelCol={{
                                       span: 0,
                                    }}
                                    wrapperCol={{
                                       span: 24,
                                    }}
                                    layout='horizontal'
                                    style={{
                                       maxHeight: 200,
                                       maxWidth: 500,
                                       fontWeight: '500',
                                       fontSize: '26px',
                                       marginTop: '20px',
                                    }}
                                    onFinish={handleReview}
                                    initialValues={review}
                                    disabled={review}
                                 >
                                    <Form.Item
                                       name='rating'
                                       style={{
                                          display: 'inline-block',
                                          width: '100%',
                                       }}
                                    >
                                       <Rate allowHalf style={{fontSize: '20px'}} defaultValue={review?.rating} />
                                    </Form.Item>
                                    <Form.Item
                                       name='review'
                                       rules={[
                                          {
                                             required: true,
                                             message: 'Vui lòng thêm nhận xét của bạn',
                                          },
                                       ]}
                                       style={{
                                          display: 'inline-block',
                                          width: '100%',
                                       }}
                                    >
                                       <TextArea
                                          rows={4}
                                          placeholder='Thêm nhận xét của bạn...'
                                          className={styles.input_form}
                                       />
                                    </Form.Item>
                                    <Form.Item style={{textAlign: 'center'}}>
                                       <Button type='primary' htmlType='submit' className={styles.btn_submit}>
                                          Đánh giá
                                       </Button>
                                    </Form.Item>
                                 </Form>
                              </div>
                           </div>
                        </Col>
                     </Row>
                  </div>
               </Col>
               <Col span={7}>
                  <div className={styles.booking}>
                     <div className={styles.name}>{infoTour?.name}</div>
                     <div className={styles.content}>
                        <p>Số người tham gia : {infoTour?.maxGroupSize}</p>
                        <p>Thời gian : {infoTour?.duration}</p>
                        <p>Độ khó : {infoTour?.difficulty}</p>
                        <p>Quãng đường : {infoTour?.distance}</p>
                     </div>
                     <div className={styles.price}>{infoTour?.price}.000 ₫</div>
                     <button className={styles.btn_booking} onClick={handleBooking}>
                        Đặt Tour
                     </button>
                  </div>
               </Col>
            </Row>
         </div>
         {openModalBooking && (
            <Booking openModalBooking={openModalBooking} setOpenModalBooking={setOpenModalBooking} tour={infoTour} />
         )}
      </>
   );
}