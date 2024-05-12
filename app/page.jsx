/** @format */
'use client';
import React, {useContext, useEffect, useState} from 'react';
import styles from './page.module.scss';
import TourCard from '@/components/tourCard/TourCard';
import {Col, Row, Spin} from 'antd';
import {getTopTours} from '@/api/Tour';
import {ChatContext} from '@/context/ChatContext';
import Message from '@/utils/Message';
import {resetUser} from '@/redux/reducers/userSlide';
import Cookies from 'js-cookie';
import {useDispatch} from 'react-redux';
const Home = () => {
   const [listTours, setListTours] = useState([]);
   const [loading, setLoading] = useState(false);

   const getAll = async () => {
      const res = await getTopTours();
      setListTours(res?.data);
   };
   useEffect(() => {
      getAll();
      setLoading(true);
      setTimeout(() => {
         setLoading(false);
      }, 1000);
   }, []);

   return (
      <>
         <div>
            <Spin spinning={loading} fullscreen={true} />
            <div className={styles.videoWrap}>
               <video autoPlay loop muted className={styles.video}>
                  <source src={'/assets/video/main.mp4'} type='video/mp4' />
               </video>
            </div>

            <div className={styles.tourList}>
               <div className={styles.container}>
                  <div className={styles.title_divider}>
                     <div className={styles.divider}></div>
                     <h2 className={styles.title}>Tour du lịch</h2>
                     <div className={styles.divider}></div>
                  </div>
                  <h1 className={styles.titlePrimary}>Yêu thích nhất</h1>
                  <div className={styles.tourCard} style={{marginTop: '30px'}}>
                     <Row gutter={20}>
                        {listTours &&
                           listTours.map((tour, index) => (
                              <Col xl={{span: 6}} xs={{span: 24}} md={{span: 12}} key={index}>
                                 <TourCard tour={tour} />
                              </Col>
                           ))}
                     </Row>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Home;
