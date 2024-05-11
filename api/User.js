/** @format */

import Message from '@/utils/Message';
import BaseApi from './BaseApi';
export const LoginApi = async (data) => {
   try {
      let res = await BaseApi.post('/user/login', data);
      return res;
   } catch (error) {
      new Message('Đăng nhập thất bại!').error();
   }
};
export const RegisterApi = async (data) => {
   try {
      let res = await BaseApi.post('/user/signup', data);
      return res;
   } catch (error) {
      new Message('Đăng ký thất bại!').error();
   }
};
export const LogoutApi = async () => {
   try {
      let res = await BaseApi.post('/user/logout');
      return res;
   } catch (error) {
      new Message('Đăng xuất thất bại!').error();
   }
};
export const UpdateMeApi = async (data, token) => {
   try {
      let res = await BaseApi.patch('/user/updateMe', data, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Cập nhập thông tin thất bại!').error();
   }
};
export const UpdatePasswordApi = async (data, token) => {
   try {
      let res = await BaseApi.patch('/user/updateMyPassword', data, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Cập nhập mật khẩu thất bại!').error();
   }
};
export const getAllUsers = async (query, token) => {
   try {
      let queryData;
      queryData = BaseApi.get(`/user`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      if (query) {
         const {page = 1, limit = 10, sort = ''} = query;
         queryData = BaseApi.get(`/user?page=${page}&&limit=${limit}&&sort=${sort}`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
      }
      const res = await queryData;
      return res.data;
   } catch (error) {
      new Message('Lỗi!').error();
   }
};
export const createUser = async (data, token) => {
   try {
      let res = await BaseApi.post(`/user`, data, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Thêm mới user thất bại!').error();
   }
};
export const getUserById = async (idUser, token) => {
   try {
      let res = await BaseApi.get(`/user/${idUser}`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Lỗi!').error();
   }
};
export const deleteUser = async (idUser, token) => {
   try {
      let res = await BaseApi.delete(`/user/${idUser}`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Xóa user thất bại!').error();
   }
};
export const updateUser = async (data, idUser, token) => {
   try {
      let res = await BaseApi.patch(`/user/${idUser}`, data, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Cập nhật user thất bại!').error();
   }
};
export const getGuide = async (token) => {
   try {
      let res = await BaseApi.get(`/user/get-guide`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Lấy danh sách hướng dẫn viên thất bại!').error();
   }
};
export const getManyUser = async (token, data) => {
   try {
      let res = await BaseApi.post(`/user/get-many-user`, data, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return res;
   } catch (error) {
      new Message('Lấy danh sách user thất bại!').error();
   }
};
