import axios from 'axios';


export const api = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 請求攔截器
api.interceptors.request.use(
    (config) => {
        // 從 localStorage 獲取 token
        const token = localStorage.getItem('local-token');

        // 如果有 token 就加到 header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);