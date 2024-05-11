/** @format */

import Message from '@/utils/Message';
import BaseApi from './BaseApi';
/** @format */
export const createMessage = async (data, token) => {
   try {
      let res = await BaseApi.post(`/message`, data, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Thêm mới message thất bại!').error();
   }
};
export const getMessages = async (token, chatId) => {
   try {
      let res = await BaseApi.get(`/message/${chatId}`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Lấy thông tin messages  thất bại!').error();
   }
};

export const updateStatusMessagesOnChat = async (token, data) => {
   try {
      let res = await BaseApi.post(`/message/update-status`, data, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Update status message thất bại!').error();
   }
};
