/** @format */

import Message from '@/utils/Message';
import BaseApi from './BaseApi';
/** @format */
export const createReview = async (data, token) => {
   try {
      let res = await BaseApi.post(`/review`, data, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      // new Message('Thêm mới review thất bại!').error();
   }
};
export const getAllReviewOnTour = async (idTour) => {
   try {
      let res = await BaseApi.get(`/review/get-all-review-on-tour/${idTour}`);
      return res;
   } catch (error) {
      // new Message('Lấy danh sách review theo tour thất bại!').error();
   }
};
export const getReviewOnTour = async (idTour, token) => {
   try {
      let res = await BaseApi.get(`/review/get-review-on-tour/${idTour}`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      // new Message('Lấy danh sách review theo tour của user thất bại!').error();
   }
};
