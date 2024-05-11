/** @format */
'use client';
import React, {useContext, useEffect, useState} from 'react';
import styles from './navbar.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import Login from '../login/Login';
import Register from '../register/Register';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import {useSelector} from 'react-redux';
import {IoNotifications} from 'react-icons/io5';
import {Badge} from 'antd';
import {ChatContext} from '@/context/ChatContext';
import {slide as Menu} from 'react-burger-menu';
export const NavbarLinks = [
   {
      name: 'Trang chủ',
      link: '/',
      active: true,
   },
   {
      name: 'Giới thiệu',
      link: '/',
      active: false,
   },
   {
      name: '   Điểm đến',
      link: '/',
      active: false,
   },
   {
      name: ' Dịch vụ khác',
      link: '/',
      active: false,
   },
   {
      name: '   Liên hệ',
      link: '/',
      active: false,
   },
];

const Navbar = () => {
   const router = useRouter();
   const [openModalLogin, setOpenModalLogin] = useState(false);
   const [openModalRegister, setOpenModalRegister] = useState(false);
   const [loggedIn, setLoggedIn] = useState(false);
   const [active, setActive] = useState(0);
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

   const {badge} = useContext(ChatContext);

   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

   useEffect(() => {
      const handleResize = () => {
         setWindowWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);

      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, []);
   var stylesMenu = {
      bmBurgerButton: {
         position: 'fixed',
         width: '26px',
         height: '26px',
         left: '26px',
         top: '38px',
         display: windowWidth <= 768 ? 'block' : 'none',
      },

      bmBurgerBars: {
         background: '#373a47',
      },
      bmBurgerBarsHover: {
         background: '#a90000',
      },
      bmCrossButton: {
         height: '24px',
         width: '24px',
      },
      bmCross: {
         background: '#bdc3c7',
      },
      bmMenuWrap: {
         position: 'fixed',
         height: '100%',
      },
      bmMenu: {
         background: '#373a47',
         padding: '2.5em 0 0',
         fontSize: '1.15em',
         background: '#fff',
      },
      bmMorphShape: {
         fill: '#373a47',
      },
      bmItemList: {
         color: '#b8b7ad',
         display: 'flex',
         flexDirection: 'column',
      },
      bmItem: {
         display: 'inline-block',
         padding: '16px 30px',
      },

      bmOverlay: {
         background: 'rgba(0, 0, 0, 0.3)',
      },
   };
   return (
      <>
         {
            <Menu id={'sidebar'} styles={stylesMenu}>
               {NavbarLinks.map((link, index) => (
                  <Link
                     href={link.link}
                     className={`${styles.link} ${active == index && styles.active}`}
                     key={index}
                     onClick={() => setActive(index)}
                  >
                     {link.name}
                  </Link>
               ))}
            </Menu>
         }
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
                  <div className={styles.bar}></div>
                  <div className={styles.logo}>
                     <Link href={'/'}>
                        <Image src={'/assets/logo.png'} alt='' height={64} width={116} />
                     </Link>
                  </div>
                  <div className={styles.navLink}>
                     {NavbarLinks.map((link, index) => (
                        <Link
                           href={link.link}
                           className={`${styles.link} ${active == index && styles.active}`}
                           key={index}
                           onClick={() => setActive(index)}
                        >
                           {link.name}
                        </Link>
                     ))}
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
                     <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                        <Badge count={badge}>
                           <IoNotifications fontSize={26} />
                        </Badge>
                        <div className={styles.user} onClick={() => router.replace('/account')}>
                           <Image src={user.photo} alt='User' width={30} height={30} className={styles.imgUser} />
                           <div className={styles.nameUser}>{user.email}</div>
                        </div>
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
