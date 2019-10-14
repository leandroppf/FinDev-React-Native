import axios from 'axios';
import { getToken } from './auth';
import baseUrl from '../config/config';

const api = axios.create({
    baseURL: baseUrl
});

api.interceptors.request.use(async config => {
    const token = await getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;