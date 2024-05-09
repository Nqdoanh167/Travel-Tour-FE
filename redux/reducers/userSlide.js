/** @format */

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
   name: '',
   email: '',
   phone: '',
   photo: '',
   role: '',
   token: '',
   id: '',
};

export const userSlide = createSlice({
   name: 'user',
   initialState,
   reducers: {
      updateUser: (state, action) => {
         const {name = '', email = '', phone = '', photo = '', role = '', token = '', _id = ''} = action.payload;
         state.name = name ? name : state.name;
         state.email = email ? email : state.email;
         state.phone = phone ? phone : state.phone;
         state.photo = photo ? photo : state.photo;
         state.role = role ? role : state.role;
         state.token = token ? token : state.token;
         state.id = _id ? _id : state.id;
      },
      resetUser: (state) => {
         state.name = '';
         state.email = '';
         state.phone = '';
         state.photo = '';
         state.role = '';
         state.token = '';
         state.id = '';
      },
   },
});

// Action creators are generated for each case reducer function
export const {updateUser, resetUser} = userSlide.actions;

export default userSlide.reducer;
