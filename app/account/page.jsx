/** @format */
'use client';
import React, {useEffect, useState} from 'react';
import styles from './account.module.scss';

import SettingAccount from '@/components/settingAccount/SettingAccount';
import MyBooking from '@/components/myBooking/MyBooking';
import MyReview from '@/components/myReview/MyReview';
import ManageTour from '@/components/manageTour/ManageTour';
import {useSelector} from 'react-redux';
import {useRouter} from 'next/navigation';
import ManageUser from '@/components/manageUser/ManageUser';
import ManageBooking from '@/components/manageBooking/ManageBooking';
export default function Account() {
   const [activeLink, setActiveLink] = useState(1);
   const Userlinks = [
      {
         key: '1',
         label: 'Cài đặt',
      },
      {
         key: '2',
         label: 'My bookings',
      },
      {
         key: '3',
         label: 'My reviews',
      },
      {
         key: '4',
         label: 'Tài khoản ngân hàng',
      },
   ];
   const Adminlinks = [
      {
         key: '5',
         label: 'Quản lý tours',
      },
      {
         key: '6',
         label: 'Quản lý users',
      },
      {
         key: '7',
         label: 'Quản lý reviews',
      },
      {
         key: '8',
         label: 'Quản lý bookings',
      },
   ];
   const handleClick = (link) => {
      setActiveLink(link.key);
   };
   const user = useSelector((state) => state.user);
   const router = useRouter();
   useEffect(() => {
      const loggedIn = user.token;
      if (!loggedIn) {
         router.push('/');
      }
   }, []);

   return (
      <div className={styles.accountWrap}>
         <div className={styles.user_view}>
            <nav className={styles.user_view__menu}>
               <ul className={styles.side_nav}>
                  <li className={styles.navItem}>
                     {Userlinks.map((link) => (
                        <a
                           href='#'
                           className={`${styles.link} ${activeLink == link.key && styles.link_active}`}
                           key={link.key}
                           onClick={() => handleClick(link)}
                        >
                           {link.label}
                        </a>
                     ))}
                  </li>
               </ul>
               {user.role === 'admin' && (
                  <div className={styles.admin_nav}>
                     <h5 className={styles.admin_nav__heading}>Admin</h5>
                     <ul className={styles.side_nav}>
                        <li className={`${styles.navItem} ${styles.active}`}>
                           {Adminlinks.map((link) => (
                              <a
                                 href='#'
                                 className={`${styles.link} ${activeLink == link.key && styles.link_active}`}
                                 key={link.key}
                                 onClick={() => handleClick(link)}
                              >
                                 {link.label}
                              </a>
                           ))}
                        </li>
                     </ul>
                  </div>
               )}
            </nav>
            <div className={styles.content}>
               {activeLink == 1 && <SettingAccount />}
               {activeLink == 2 && <MyBooking />}
               {activeLink == 3 && <MyReview />}
               {activeLink == 5 && <ManageTour />}
               {activeLink == 6 && <ManageUser />}
               {activeLink == 8 && <ManageBooking />}
            </div>
         </div>
      </div>
   );
}
