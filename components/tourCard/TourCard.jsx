/** @format */
'use client';
import {Card} from 'antd';
import React from 'react';
import styles from './tourCard.module.scss';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
export default function TourCard({tour}) {
   const router = useRouter();

   return (
      <Card
         className={styles.card}
         hoverable
         cover={
            <Image alt='example' src={'/assets/places/place4.jpg'} className={styles.image} width={317} height={196} />
         }
         style={{border: '2px solid #f0f0f0'}}
         onClick={() => router.push(`/tour/${tour.slug}`)}
      >
         <div className={styles.name}>{tour?.name}</div>
         <div className={styles.content}>
            <p>Số người tham gia : {tour?.maxGroupSize}</p>
            <p>Thời gian : {tour?.duration}</p>
            <p>Độ khó : {tour?.difficulty}</p>
            <p>Quãng đường : {tour?.distance}</p>
         </div>
         <div className={styles.price}>{tour?.price}.000 ₫</div>
      </Card>
   );
}
