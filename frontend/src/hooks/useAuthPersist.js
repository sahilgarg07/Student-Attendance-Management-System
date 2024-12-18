import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { userLogin } from '../Store/Slices/userSlice';
import { personLogin } from '../Store/Slices/personSlice';
import axiosInstance from "../axios";

export const useAuthPersist = () => {
    const dispatch = useDispatch();

    const checkAuth = async () => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            try {
                axiosInstance.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
                const profileResponse = await axiosInstance.get('Auth/profile');
                
                dispatch(userLogin({ token: { access: accessToken } }));
                dispatch(personLogin(profileResponse.data));
            } catch (error) {
                console.error('Auth check failed:', error);
                // Token refresh is handled by axios interceptor
            }
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return checkAuth;
};