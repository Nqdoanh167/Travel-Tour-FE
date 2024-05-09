/** @format */

import axios from 'axios';

const BaesApi = axios.create({
   baseURL: `${process.env.BASE_URL}/api/v1`,
   timeout: 10000,
});

export default BaesApi;
