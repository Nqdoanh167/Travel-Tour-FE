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
export default function ChatPage() {
   const user = useSelector((state) => state.user);
   const {setUserReceive, chat, listUserIdsChat} = useContext(ChatContext);
   const [listUserChat, setListUserChat] = useState([]);
   const getUsersOnline = async () => {
      const users = await getManyUser(user.token, listUserIdsChat);
      if (users?.status == 200) {
         setListUserChat(users?.data.data);
      }
   };
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
               span={10}
               style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '30px',
               }}
            >
               {listUserChat &&
                  listUserChat
                     .filter((userChat) => userChat._id !== user.id)
                     .map((userChat, index) => (
                        <UserChat userChat={userChat} key={index} onClick={() => handleChooseUser(userChat)} />
                     ))}
            </Col>
            <Col span={14}>{chat && <ChatBox />}</Col>
         </Row>
      </div>
   );
}
