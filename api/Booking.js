/** @format */

import Message from '@/utils/Message';
import BaseApi from './BaseApi';
export const createBooking = async (data, token) => {
   try {
      let res = await BaseApi.post(`/booking`, data, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Thêm mới booking thất bại!').error();
   }
};
export const getAllBooking = async (query, token) => {
   try {
      let queryData;
      queryData = BaseApi.get(`/booking`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      if (query) {
         const {page = 1, limit = 10, sort = ''} = query;
         queryData = BaseApi.get(`/booking?page=${page}&&limit=${limit}&&sort=${sort}`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
      }
      const res = await queryData;
      return res.data;
   } catch (error) {
      // new Message('Lỗi!').error();
   }
};
export const getMyBooking = async (query, token) => {
   try {
      let queryData;
      queryData = BaseApi.get(`/booking/my-booking`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      if (query) {
         const {page = 1, limit = 10, sort = ''} = query;
         queryData = BaseApi.get(`/booking/my-booking?page=${page}&&limit=${limit}&&sort=${sort}`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
      }
      const res = await queryData;
      return res.data;
   } catch (error) {
      // new Message('Lỗi!').error();
   }
};
export const deleteBooking = async (idBooking, token) => {
   try {
      let res = await BaseApi.delete(`/booking/${idBooking}`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Xóa booking thất bại!').error();
   }
};
