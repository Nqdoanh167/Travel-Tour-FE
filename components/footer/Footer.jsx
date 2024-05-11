/** @format */
'use client';
import React from 'react';
import {FaFacebook, FaInstagram, FaLinkedin, FaLocationArrow, FaMobileAlt} from 'react-icons/fa';
import styles from './footer.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import {Col, Row} from 'antd';
const FooterLinks = [
   {
      title: 'Trang chủ',
      link: '/',
   },
   {
      title: 'Giới thiệu',
      link: '/',
   },
   {
      title: 'Điểm đến',
      link: '/',
   },
   {
      title: 'Dịch vụ khác',
      link: '/',
   },
   {
      title: 'Liên hệ',
      link: '/',
   },
];

const Footer = () => {
   return (
      <>
         <div className={styles.footerWrap}>
            <video autoPlay loop muted className={styles.video}>
               <source src={'/assets/video/footer.mp4'} type='video/mp4' />
            </video>
            <div className={styles.container}>
               <Row gutter={20} style={{padding: '20px'}}>
                  <Col xl={{span: 9}} className={styles.left}>
                     <div className={styles.logo}>
                        <Image src={'/assets/logo.png'} alt='Logo' width={116} height={64} />
                     </div>
                     <span>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus, ut illo. Itaque nemo quas
                        distinctio nihil, assumenda quod blanditiis reiciendis, molestias esse cupiditate deserunt nisi.
                        Delectus quisquam aut consequatur veniam.
                     </span>
                     <div className={styles.social}>
                        <p>Facebook</p>
                        <p>Facebook</p>
                        <p>Facebook</p>
                     </div>
                  </Col>
                  <Col xl={{span: 15}} xs={{span: 24}}>
                     <div className={styles.right}>
                        <Row style={{justifyContent: 'space-between'}}>
                           <Col className={styles.linksWrap}>
                              <div className={styles.title}>
                                 <h4>Liên kết nhanh</h4>
                              </div>
                              {FooterLinks.map((link, index) => (
                                 <Link className={styles.links} href={link.link} key={index}>
                                    <span>&#11162;</span>
                                    <span>{link.title}</span>
                                 </Link>
                              ))}
                           </Col>
                           <Col span={12} className={styles.linksWrap}>
                              <div className={styles.title}>
                                 <h4>Liên kết nhanh</h4>
                              </div>
                              {FooterLinks.map((link, index) => (
                                 <Link className={styles.links} href={link.link} key={index}>
                                    <span>&#11162;</span>
                                    <span>{link.title}</span>
                                 </Link>
                              ))}
                           </Col>
                        </Row>
                     </div>
                  </Col>
               </Row>
               <div className={styles.license}>© 2024 Bản quyền và thiết kế bởi doanh.dev</div>
            </div>
         </div>
      </>
   );
};

export default Footer;
