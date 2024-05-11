/** @format */

import Message from '@/utils/Message';
import BaseApi from './BaseApi';
/** @format */
export const createChat = async (token, data) => {
   try {
      let res = await BaseApi.post(`/chat`, data, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Thêm mới chat thất bại!').error();
   }
};
export const findUserChat = async (token) => {
   try {
      let res = await BaseApi.get(`/chat`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Lấy chat theo user  thất bại!').error();
   }
};
export const findChat = async (token, receiveId) => {
   try {
      let res = await BaseApi.get(`/chat/find/${receiveId}`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Lấy chat  thất bại!').error();
   }
};
