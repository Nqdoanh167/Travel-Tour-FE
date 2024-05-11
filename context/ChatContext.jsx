/** @format */
'use client';
import {createChat, findChat, findUserChat} from '@/api/Chat';
import Message from '@/utils/Message';
import {createContext, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {io} from 'socket.io-client';
export const ChatContext = createContext();
export const ChatContextProvider = ({children}) => {
   const [socket, setSocket] = useState(null);
   const [newMessage, setNewMessage] = useState(null);
   const [onlineUsers, setOnlineUsers] = useState([]);
   const [chat, setChat] = useState(null);
   const [userReceive, setUserReceive] = useState(null);
   const [badge, setBadge] = useState(0);
   const [listUserIdsChat, setListUserIdsChat] = useState([]);
   const [statusMes, setStatusMes] = useState(null);
   const user = useSelector((state) => state.user);
   const getChat = async (id) => {
      const res = await createChat(user.token, {receiveId: id});
      if (res?.status == 200 || res?.status == 201) {
         setChat(res?.data.data.chat);
      }
   };
   const getListUserIds = async () => {
      const res = await findUserChat(user.token);
      if (res?.status == 200) setListUserIdsChat(res?.data.data);
   };

   useEffect(() => {
      if (userReceive) getChat(userReceive._id);
   }, [newMessage, userReceive]);
   useEffect(() => {
      const newSocket = io(process.env.BASE_URL);
      setSocket(newSocket);
      getListUserIds();
      return () => {
         newSocket.disconnect();
      };
   }, [user]);
   useEffect(() => {
      if (socket === null) return;

      socket.emit('addNewUser', user?.id);
      socket.on('getOnlineUsers', (data) => {
         setOnlineUsers(data);
      });
      return () => {
         socket.off('getOnlineUsers');
      };
   }, [socket]);
   useEffect(() => {
      if (socket === null) return;
      const receiveId = chat?.members?.find((id) => id !== user?.id);
      const senderUser = {
         _id: user.id,
         name: user.name,
      };
      socket.emit('sendMessage', {senderUser, receiveId});
   }, [newMessage]);
   useEffect(() => {
      if (socket === null) return;
      socket.on('getMessage', (data) => {
         getChat(data?.senderUser?._id);
         setUserReceive(data?.senderUser);
         setBadge((badge) => badge + 1);
      });
   }, [socket]);
   useEffect(() => {
      if (socket === null) return;
      socket.emit('sendUpdateStateMess', {receiveId: statusMes?.receiveId});
   }, [statusMes]);
   useEffect(() => {
      if (socket === null) return;
      socket.on('updateStateMess', (receiveId) => {
         getChat(receiveId.receiveId);
      });
   }, [socket]);

   return (
      <ChatContext.Provider
         value={{
            onlineUsers,
            setChat,
            chat,
            setUserReceive,
            userReceive,
            setNewMessage,
            badge,
            listUserIdsChat,
            setStatusMes,
            statusMes,
         }}
      >
         {children}
      </ChatContext.Provider>
   );
};
