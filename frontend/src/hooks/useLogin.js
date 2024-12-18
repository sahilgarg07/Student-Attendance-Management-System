// src/hooks/useLogin.js
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userLogin } from '../Store/Slices/userSlice';
import { personLogin } from '../Store/Slices/personSlice';
import axiosInstance from "../axios";

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const login = async (formData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post('Auth/login', formData);
            
            const { access, refresh } = response.data.token;
            
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            
            axiosInstance.defaults.headers['Authorization'] = `Bearer ${access}`;

            dispatch(userLogin(response.data));

            const profileResponse = await axiosInstance.get('Auth/profile');
            dispatch(personLogin(profileResponse.data));

            return true;
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                setError(error.response.data.message || 'An error occurred during login');
            } else if (error.request) {
                // The request was made but no response was received
                setError('No response received from server. Please try again.');
            } else {
                // Something happened in setting up the request that triggered an Error
                setError('An unexpected error occurred. Please try again.');
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
};