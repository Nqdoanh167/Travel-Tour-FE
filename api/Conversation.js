/** @format */

import Message from '@/utils/Message';
import BaseApi from './BaseApi';
/** @format */
export const createConversation = async (token, data) => {
   try {
      let res = await BaseApi.post(`/conversation`, data, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Thêm mới conversation thất bại!').error();
   }
};
export const findUserConversation = async (token) => {
   try {
      let res = await BaseApi.get(`/conversation`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Lấy all  user of all conversation thất bại!').error();
   }
};
export const findConversation = async (token, receiveId) => {
   try {
      let res = await BaseApi.get(`/conversation/find/${receiveId}`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Lấy conversation  thất bại!').error();
   }
};
