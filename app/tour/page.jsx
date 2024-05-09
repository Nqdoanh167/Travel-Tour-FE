/** @format */
'use client';
import {Checkbox, Col, Pagination, Row} from 'antd';
import React from 'react';
import styles from './tour.module.scss';
import TourCard from '@/components/tourCard/TourCard';
export default function Tour() {
   const onChange = (checkedValues) => {
      console.log('checked = ', checkedValues);
   };
   return (
      <div className={styles.tourWrap}>
         <h1>10 tour du lịch tốt nhất</h1>
         <Row gutter={20}>
            <Col span={4} className={styles.barLeft}>
               <div className={styles.rating}>
                  <div className={styles.title}>Đánh giá sao</div>
                  <Checkbox.Group
                     style={{
                        width: '100%',
                     }}
                     onChange={onChange}
                  >
                     <Row>
                        <Col span={24}>
                           <Checkbox value='5'>5 sao</Checkbox>
                        </Col>
                        <Col span={24}>
                           <Checkbox value='4'>4 sao</Checkbox>
                        </Col>
                        <Col span={24}>
                           <Checkbox value='3'>3 sao</Checkbox>
                        </Col>
                        <Col span={24}>
                           <Checkbox value='2'>2 sao</Checkbox>
                        </Col>
                        <Col span={24}>
                           <Checkbox value='1'>1 sao</Checkbox>
                        </Col>
                     </Row>
                  </Checkbox.Group>
               </div>
            </Col>
            <Col span={20} className={styles.content}>
               <div className={styles.barTop}>
                  <div className={styles.sort_title}>Sắp xếp theo</div>
                  <div className={`${styles.btn_sort} ${styles.active}`}>Mới nhất</div>
                  <div className={styles.btn_sort}>Giá tốt nhất</div>
                  <div className={styles.btn_sort}>Đánh giá nhiều nhất</div>
               </div>
               <div className={styles.tourCard} style={{marginTop: '30px'}}>
                  <Row gutter={20}>
                     <Col span={6}>
                        <TourCard />
                     </Col>
                     <Col span={6}>
                        <TourCard />
                     </Col>
                     <Col span={6}>
                        <TourCard />
                     </Col>
                     <Col span={6}>
                        <TourCard />
                     </Col>
                     <Col span={6}>
                        <TourCard />
                     </Col>
                     <Col span={6}>
                        <TourCard />
                     </Col>
                     <Col span={6}>
                        <TourCard />
                     </Col>
                     <Col span={6}>
                        <TourCard />
                     </Col>
                  </Row>
               </div>
               <div style={{textAlign: 'center', margin: '20px 0'}}>
                  <Pagination defaultCurrent={1} total={500} />
               </div>
            </Col>
         </Row>
      </div>
   );
}
