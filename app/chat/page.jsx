/** @format */
'use client';
import React, {useContext, useEffect, useState} from 'react';
import styles from './chat.module.scss';
import UserChat from '@/components/userChat/UserChat';
import {Col, Row} from 'antd';
import ChatBox from '@/components/chatBox/ChatBox';
import {useSelector} from 'react-redux';
import {getManyUser} from '@/api/User';
import {ChatContext} from '@/context/ChatContext';
import {useRouter} from 'next/navigation';
export default function ChatPage() {
   const router = useRouter();
   const user = useSelector((state) => state.user);
   const {setUserReceive, conversation, listUserIdsChat} = useContext(ChatContext);
   const [listUserChat, setListUserChat] = useState(null);

   const getUsersOnline = async () => {
      const users = await getManyUser(user.token, listUserIdsChat);
      if (users?.status == 200) {
         setListUserChat(users?.data.data);
      }
   };
   useEffect(() => {
      const loggedIn = user.token;
      if (!loggedIn) {
         router.push('/');
      }
   }, []);
   useEffect(() => {
      getUsersOnline();
   }, [listUserIdsChat]);

   const handleChooseUser = async (userChat) => {
      setUserReceive({
         _id: userChat?._id,
         name: userChat?.name,
         photo: userChat?.photo,
      });
   };
   return (
      <div className={styles.container}>
         <Row>
            <Col
               xl={{span: 10}}
               xs={{span: 10}}
               style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '30px',
               }}
            >
               {listUserChat &&
                  listUserChat
                     .filter((userChat) => userChat?._id !== user.id)
                     .map((userChat, index) => (
                        <UserChat userChat={userChat} key={index} onClick={() => handleChooseUser(userChat)} />
                     ))}
            </Col>
            <Col xl={{span: 14}} xs={{span: 24}}>
               {conversation && <ChatBox />}
            </Col>
         </Row>
      </div>
   );
}
