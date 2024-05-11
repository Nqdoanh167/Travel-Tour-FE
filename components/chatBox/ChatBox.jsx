/** @format */
'use client';
import React, {useContext, useEffect, useState} from 'react';
import styles from './chatbox.module.scss';
import InputEmoji from 'react-input-emoji';
import {IoIosSend} from 'react-icons/io';
import {useSelector} from 'react-redux';
import {ChatContext} from '@/context/ChatContext';
import {createMessage, updateStatusMessagesOnChat} from '@/api/Message';
import {Image} from 'antd';
import {IoIosCheckmarkCircleOutline} from 'react-icons/io';
export default function ChatBox() {
   const [text, setText] = useState('');
   const user = useSelector((state) => state.user);
   const {chat, userReceive, setNewMessage, setStatusMes, statusMes} = useContext(ChatContext);
   const [listMessage, setListMessage] = useState([]);

   useEffect(() => {
      setListMessage(chat?.messages?.sort((a, b) => a.createAt - b.createAt));
   }, [chat]);

   const handleSendMessage = async (text) => {
      const res = await createMessage(
         {
            chatId: chat._id,
            text,
         },
         user.token,
      );
      setText('');
      setNewMessage({
         text,
         key: res?.data.data._id,
      });
   };
   const handleClick = async () => {
      if (chat) {
         await updateStatusMessagesOnChat(user?.token, {receive: userReceive?._id, chatId: chat._id});
         setStatusMes({
            key: Date.now(),
            receiveId: userReceive?._id,
         });
      }
   };
   return (
      <div className={styles.container} onClick={handleClick}>
         <div className={styles.header}>
            <span>{userReceive?.name}</span>
         </div>
         <div className={styles.form_mes}>
            <div className={styles.content}>
               {listMessage &&
                  listMessage.map((mes, index) => (
                     <div key={index}>
                        {mes?.senderId === userReceive?._id && (
                           <div className={styles.content_receive}>
                              <div className={styles.message} key={index}>
                                 <div className={styles.mes_content}>{mes?.text}</div>
                                 <div className={styles.mes_date}>Today at 11:03 PM</div>
                              </div>
                           </div>
                        )}
                        {mes?.senderId === user.id && (
                           <div className={styles.content_send}>
                              <div style={{position: 'relative'}}>
                                 <div className={`${styles.message} ${styles.message_send}`} key={index}>
                                    <div className={styles.mes_content}>{mes?.text}</div>
                                    <div className={styles.mes_date}>Today at 11:03 PM</div>
                                 </div>
                                 {mes?.seen ? (
                                    <div style={{textAlign: 'right'}}>
                                       <Image
                                          src={userReceive?.photo}
                                          alt=''
                                          width={16}
                                          height={16}
                                          style={{borderRadius: '100%', position: 'absolute', left: 18, top: -10}}
                                       />
                                    </div>
                                 ) : (
                                    <div style={{textAlign: 'right'}}>
                                       <IoIosCheckmarkCircleOutline
                                          fontSize={18}
                                          fill='#557be3'
                                          style={{position: 'absolute', bottom: -6}}
                                       />
                                    </div>
                                 )}
                              </div>
                           </div>
                        )}
                     </div>
                  ))}
            </div>
            <div className={styles.form_send}>
               <InputEmoji
                  value={text}
                  onChange={setText}
                  cleanOnEnter
                  onEnter={handleSendMessage}
                  placeholder='Type a message'
               />
               <button className={styles.btn_send} onClick={() => handleSendMessage(text)}>
                  <IoIosSend fill={'#fff'} fontSize={26} />
               </button>
            </div>
         </div>
      </div>
   );
}
