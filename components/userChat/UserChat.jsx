/** @format */

import React, {useContext} from 'react';
import styles from './userchat.module.scss';
import Image from 'next/image';
import {ChatContext} from '@/context/ChatContext';
export default function UserChat({userChat, onClick}) {
   const {onlineUsers} = useContext(ChatContext);

   return (
      <div className={styles.container} onClick={onClick}>
         <div>
            <Image src={userChat.photo} alt='User' height={35} width={35} className={styles.img_user} />
         </div>
         <div className={styles.text_content}>
            <div className={styles.name}>{userChat.name}</div>
            <div className={styles.text}>Text message</div>
         </div>
         <div className={styles.info}>
            <div className={styles.date}>05/10/2024</div>
            <div className={styles.notify}>2</div>
            {onlineUsers.some((userOnline) => userOnline.userId == userChat._id) && (
               <span className={styles.user_online}></span>
            )}
         </div>
      </div>
   );
}
