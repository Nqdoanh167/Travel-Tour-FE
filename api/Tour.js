/** @format */

import Message from '@/utils/Message';
import BaseApi from './BaseApi';
//
export const getAllTours = async (query) => {
   try {
      let queryData;
      queryData = BaseApi.get(`/tour`);
      if (query) {
         const {page = 1, limit = 10, sort = ''} = query;
         queryData = BaseApi.get(`/tour?page=${page}&&limit=${limit}&&sort=${sort}`);
      }
      const res = await queryData;
      return res.data;
   } catch (error) {
      new Message('Lỗi!').error();
   }
};
export const getTopTours = async (query) => {
   try {
      let queryData;
      queryData = BaseApi.get(`/tour/top-8`);
      if (query) {
         const {page = 1, limit = 10, sort = ''} = query;
         queryData = BaseApi.get(`/tour?page=${page}&&limit=${limit}&&sort=${sort}`);
      }
      const res = await queryData;
      return res.data;
   } catch (error) {
      new Message('Lỗi!').error();
   }
};
export const getTourBySlug = async (slug) => {
   try {
      let res = await BaseApi.get(`/tour/${slug}`);
      return res;
   } catch (error) {
      new Message('Lỗi!').error();
   }
};
export const getTourById = async (id) => {
   try {
      let res = await BaseApi.get(`/tour/id/${id}`);
      return res;
   } catch (error) {
      new Message('Lỗi!').error();
   }
};
export const createTour = async (data, token) => {
   try {
      let res = await BaseApi.post(`/tour`, data, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Thêm mới tour thất bại!').error();
   }
};
export const updateTour = async (data, idTour, token) => {
   try {
      let res = await BaseApi.patch(`/tour/${idTour}`, data, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Cập nhật tour thất bại!').error();
   }
};
export const deleteTour = async (idTour, token) => {
   try {
      let res = await BaseApi.delete(`/tour/${idTour}`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Xóa tour thất bại!').error();
   }
};
