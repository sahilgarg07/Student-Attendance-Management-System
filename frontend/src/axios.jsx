import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api/';

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        Authorization: localStorage.getItem('access_token')
            ? 'Bearer ' + localStorage.getItem('access_token')
            : null,
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            try {
                const response = await axios.post(`${baseURL}Auth/token/refresh/`, {
                    refresh: refreshToken
                });

                if (response.status === 200) {
                    localStorage.setItem('access_token', response.data.access);
                    axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + response.data.access;
                    originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                // Logout user if refresh fails
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;