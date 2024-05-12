/** @format */
'use client';

import {io} from 'socket.io-client';

const {createContext, useState, useEffect} = require('react');

export const AppContext = createContext();
export const AppContextProvider = ({children}) => {
   const [socket, setSocket] = useState(null);
   // useEffect(() => {
   //    const newSocket = io(process.env.BASE_URL);
   //    setSocket(newSocket);
   //    return () => {
   //       newSocket.disconnect();
   //    };
   // }, [user]);
   return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};
