/** @format */
'use client';
import React, {useEffect, useState} from 'react';
import styles from './navbar.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import Login from '../login/Login';
import Register from '../register/Register';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import {useSelector} from 'react-redux';
const imageSmall = '/assets/places/place5.jpg';
export const NavbarLinks = [
   {
      name: 'Home',
      link: '/',
   },
   {
      name: 'About',
      link: '/about',
   },
   {
      name: 'Blogs',
      link: '/blogs',
   },
   {
      name: 'Best Places',
      link: '/best-places',
   },
];

const Navbar = () => {
   const router = useRouter();
   const [openModalLogin, setOpenModalLogin] = useState(false);
   const [openModalRegister, setOpenModalRegister] = useState(false);
   const [loggedIn, setLoggedIn] = useState(false);

   const handleLogin = () => {
      setOpenModalLogin(!openModalLogin);
   };
   const handleRegister = () => {
      setOpenModalRegister(!openModalRegister);
   };
   useEffect(() => {
      // Kiểm tra sự tồn tại của cookie JWT
      const token = Cookies.get('jwt');
      if (token) {
         // Nếu có token, giải mã token để lấy thông tin người dùng
         const decoded = jwtDecode(token);

         // Kiểm tra thời gian hết hạn của token
         const currentTime = Date.now() / 1000;
         if (decoded.exp > currentTime) {
            // Token vẫn hợp lệ, người dùng đã đăng nhập
            setLoggedIn(true);
         } else {
            // Token đã hết hạn, xóa cookie và đăng xuất người dùng
            Cookies.remove('jwt');
         }
      }
   }, []);
   const user = useSelector((state) => state.user);
   return (
      <>
         <nav className={styles.navWrap}>
            <div className={styles.navColor}>
               <div className={styles.containerTop}>
                  <div className={styles.flex}>
                     <p>20% off on next booking</p>
                     <p>mobile no. +91 123456789</p>
                  </div>
               </div>
            </div>
            <div className={styles.containerBottom}>
               <div className={styles.flex}>
                  <div className={styles.logo}>
                     <Link href={'/'}>
                        <Image src={'/assets/logo.png'} alt='' height={64} width={116} />
                     </Link>
                  </div>
                  <div className={styles.navLink}>
                     <Link href={'/'} className={`${styles.link} ${styles.active}`}>
                        Trang chủ
                     </Link>
                     <Link href={'/'} className={styles.link}>
                        Giới thiệu
                     </Link>
                     <Link href={'/'} className={styles.link}>
                        Điểm đến
                     </Link>
                     <Link href={'/'} className={styles.link}>
                        Dịch vụ khác
                     </Link>
                     <Link href={'/'} className={styles.link}>
                        Liên hệ
                     </Link>
                     <input type='text' className={styles.search} placeholder='Tìm kiếm ...' />
                  </div>
                  {!loggedIn ? (
                     <div style={{display: 'flex', gap: '10px'}}>
                        <button className={styles.btn_auth} onClick={handleLogin}>
                           Đăng nhập
                        </button>
                        <button className={styles.btn_auth} onClick={handleRegister}>
                           Đăng ký
                        </button>
                     </div>
                  ) : (
                     <div className={styles.user} onClick={() => router.replace('/account')}>
                        <Image src={user.photo} alt='User' width={30} height={30} className={styles.imgUser} />
                        <div className={styles.nameUser}>{user.email}</div>
                     </div>
                  )}
               </div>
            </div>
         </nav>
         {openModalLogin && <Login openModalLogin={openModalLogin} setOpenModalLogin={setOpenModalLogin} />}
         {openModalRegister && (
            <Register
               openModalRegister={openModalRegister}
               setOpenModalRegister={setOpenModalRegister}
               setOpenModalLogin={setOpenModalLogin}
            />
         )}
      </>
   );
};

export default Navbar;
