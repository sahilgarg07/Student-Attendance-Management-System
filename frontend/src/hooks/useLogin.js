import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userLogin} from '../Store/Slices/userSlice';
import { personLogin} from '../Store/Slices/personSlice';
import axiosInstance from "../axios";
export const useLogin=()=>{
    const [error,setError]=useState(null);
    const [isLoading,setIsLoading]=useState(null);
    const dispatch=useDispatch();

    const login=async (formData)=>{
        setIsLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post('Auth/login', formData).catch(function (error) {
                console.log(response);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                setError(true)

            });// Replace 'Auth/login' with your desired login endpoint
            console.log('Login response:', response.data['token']['access']);
            localStorage.setItem('access_token',response.data['token']['access']);
            localStorage.setItem('refresh_token', response.data['token']['refresh']);
            axiosInstance.defaults.headers['Authorization'] = 'Bearer '+ localStorage.getItem('access_token');

            // dispatch(userLogin(response.data));
            const response1 = await axiosInstance.get('Auth/profile')
            console.log(response1)
            // console.log(response1.data)
            dispatch(personLogin(response1.data));


        } catch (error) {
            alert(error)
            setError(error);
        }

        setIsLoading(false);

        //     if(!dataresponse.ok){
        //         setIsLoading(false);
        //
        //     }
        //     if(dataresponse.ok){
        //     localStorage.setItem('user', JSON.stringify(json));

        //     dispatch(userLogin(json));
        //     dispatch(personLogin(datajson));
        //     }
        // }
    }
    return {login,isLoading,error};
}