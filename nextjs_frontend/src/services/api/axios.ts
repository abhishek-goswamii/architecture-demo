import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { CONFIG } from '../../config';

const BASE_HTTP_CLIENT = axios.create({
    baseURL: CONFIG.BACKEND_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'x-source': 'web',
    },
});

BASE_HTTP_CLIENT.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Add auth token if needed, or handle by cookies (withCredentials: true)
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

BASE_HTTP_CLIENT.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        // Handle 401, refresh token logic here
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                // Redirect to login or handle session expiry
                console.warn('Session expired, redirecting to login...');
                // window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default BASE_HTTP_CLIENT;
