/** @format */
'use client';
import React, {useEffect, useState} from 'react';
import styles from './tourDetail.module.scss';
import {Button, Col, Form, Image, Rate, Row, Spin} from 'antd';
import Booking from '@/components/booking/Booking';
import {getTourBySlug} from '@/api/Tour';
import {useParams, usePathname, useRouter} from 'next/navigation';
import TextArea from 'antd/es/input/TextArea';
import {createReview, getAllReviewOnTour, getReviewOnTour} from '@/api/Review';
import {useSelector} from 'react-redux';
import Message from '@/utils/Message';
import Login from '@/components/login/Login';

export default function TourDetail() {
   const params = useParams();
   const router = useRouter();
   const location = usePathname();
   const [openModalBooking, setOpenModalBooking] = useState(false);
   const [infoTour, setInfoTour] = useState([]);
   const [listReview, setListReview] = useState([]);
   const [review, setReview] = useState(null);
   const [loading, setLoading] = useState(true);
   const [openModalLogin, setOpenModalLogin] = useState(false);
   const user = useSelector((state) => state.user);
   const handleBooking = () => {
      if (!user.token) {
         setOpenModalLogin(true);
      } else setOpenModalBooking(true);
   };
   const handleContact = () => {
      if (!user.token) {
         setOpenModalLogin(true);
      } else router.push('/chat');
   };
   const getPage = async () => {
      const tour = await getTourBySlug(params.id);
      const allReviewOnTour = await getAllReviewOnTour(tour?.data.data._id);
      if (user.token) {
         const reviewOnTour = await getReviewOnTour(tour?.data.data._id, user.token);
         setReview(reviewOnTour?.data.data);
      }
      setInfoTour(tour?.data.data);
      setListReview(allReviewOnTour?.data.data);
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
   }, [user]);
   return (
      <>
         <Spin spinning={loading} fullscreen={true} />
         <div className={styles.container}>
            <Row gutter={20}>
               <Col xl={{span: 17}} xs={{span: 24}} className={styles.left}>
                  <div className={styles.imageWrap}>
                     <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Image
                           src={infoTour?.imageCover}
                           alt='Image Cover'
                           className={styles.imageCover}
                           width={903}
                           height={400}
                        />
                     </div>
                     <div className={styles.imageSmall}>
                        {infoTour?.images &&
                           infoTour?.images.map((image, index) => (
                              <Image src={image} alt='Image Small' width={213} height={120} key={index} />
                           ))}
                     </div>
                  </div>
                  <div className={styles.descTour}>
                     <div className={styles.title}>Chi tiết</div>
                     <div className={styles.content} style={{whiteSpace: 'pre-wrap'}}>
                        {infoTour?.description && infoTour?.description.split('. ').join('.\n')}
                     </div>
                  </div>
                  <div className={styles.reviewTour}>
                     <Row gutter={20}>
                        <Col span={12}>
                           <div className={styles.title}>Review</div>
                           <div className={styles.content}>
                              {listReview?.length > 0 ? (
                                 listReview.map((review, index) => (
                                    <div className={styles.content_item} key={index}>
                                       <div className={styles.user}>
                                          <div>
                                             <Image
                                                src={review?.user.photo}
                                                alt='User'
                                                width={20}
                                                height={20}
                                                className={styles.imgUser}
                                             />
                                          </div>
                                          <div className={styles.nameUser}>{review?.user.name}</div>
                                       </div>
                                       <div className={styles.rating}>
                                          <Rate
                                             allowHalf
                                             defaultValue={review?.rating}
                                             style={{fontSize: '16px'}}
                                             key={2}
                                          />
                                       </div>
                                       <div className={styles.comment}>{review.review}</div>
                                    </div>
                                 ))
                              ) : (
                                 <span>Chưa có bản đánh giá nào</span>
                              )}
                           </div>
                        </Col>
                        {user.token && (
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
                        )}
                     </Row>
                  </div>
               </Col>
               <Col xl={{span: 7}} xs={{span: 24}}>
                  <div className={styles.booking}>
                     <div className={styles.name}>{infoTour?.name}</div>
                     <div className={styles.content}>
                        <p>Số người tham gia : {infoTour?.maxGroupSize}</p>
                        <p>Thời gian : {infoTour?.duration}</p>
                        <p>Quãng đường : {`${infoTour?.distance} km`}</p>
                     </div>
                     <div className={styles.price}>{infoTour?.price}.000 ₫</div>

                     <button
                        className={styles.btn_booking}
                        onClick={handleBooking}
                        disabled={infoTour?.startDates?.length === 0 ? true : false}
                     >
                        Đặt Tour
                     </button>
                     <button className={styles.btn_contact} onClick={handleContact}>
                        Liên hệ với admin
                     </button>
                  </div>
               </Col>
            </Row>
         </div>
         {openModalBooking && (
            <Booking openModalBooking={openModalBooking} setOpenModalBooking={setOpenModalBooking} tour={infoTour} />
         )}
         {openModalLogin && (
            <Login openModalLogin={openModalLogin} setOpenModalLogin={setOpenModalLogin} locationBack={location} />
         )}
      </>
   );
}
