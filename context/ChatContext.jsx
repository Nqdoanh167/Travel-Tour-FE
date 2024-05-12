/** @format */
'use client';
import {createConversation, findUserConversation} from '@/api/Conversation';
import {getAdmin, getAllIdUser} from '@/api/User';
import {resetUser} from '@/redux/reducers/userSlide';
import Message from '@/utils/Message';
import Cookies from 'js-cookie';
import {createContext, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {io} from 'socket.io-client';
export const ChatContext = createContext();
export const ChatContextProvider = ({children}) => {
   const dispatch = useDispatch();
   const [socket, setSocket] = useState(null);
   const [newMessage, setNewMessage] = useState(null);
   const [onlineUsers, setOnlineUsers] = useState([]);
   const [conversation, setConversation] = useState(null);
   const [userReceive, setUserReceive] = useState(null);
   const [badge, setBadge] = useState(0);
   const [listUserIdsChat, setListUserIdsChat] = useState([]);
   const [statusMes, setStatusMes] = useState(null);
   const [logout, setLogout] = useState(null);
   const user = useSelector((state) => state.user);
   const getChat = async (id) => {
      const res = await createConversation(user.token, {receiveId: id});
      if (res?.status == 200 || res?.status == 201) {
         setConversation(res?.data.data);
      }
   };
   const getListUserIds = async () => {
      if (user.role === 'admin') {
         const res = await getAllIdUser(user.token);
         if (res?.status == 200) setListUserIdsChat(res?.data.data);
      }
   };
   const getInfoAdmin = async () => {
      const res = await getAdmin(user.token);
      if (res?.status == 200) setListUserIdsChat([res?.data.data._id]);
   };
   useEffect(() => {
      if (user.token) {
         getInfoAdmin();
      }
   }, [user]);
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
      socket.on('logout', (data) => {
         console.log('check');
         setLogout({
            key: Date.now(),
         });
      });
      return () => {
         socket.off('logout');
      };
   }, [socket]);
   useEffect(() => {
      if (socket === null) return;
      const receiveId = conversation?.members?.find((id) => id !== user?.id);
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
   useEffect(() => {
      setTimeout(() => {
         if (logout) {
            new Message('Tài khoản của bạn đã đăng nhập ở nơi khác.Xin vui lòng thử lại!').error();
            dispatch(resetUser());
            Cookies.remove('jwt');
            window.setTimeout(() => {
               location.reload();
            }, 2000);
         }
      }, 5000);
   }, [logout]);

   return (
      <ChatContext.Provider
         value={{
            onlineUsers,
            setConversation,
            conversation,
            setUserReceive,
            userReceive,
            setNewMessage,
            badge,
            listUserIdsChat,
            setStatusMes,
            statusMes,
            logout,
         }}
      >
         {children}
      </ChatContext.Provider>
   );
};
