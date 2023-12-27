import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userLogin} from '../Store/Slices/userSlice';
import { personLogin} from '../Store/Slices/personSlice';
import axiosInstance from "../axios";
import axios from "axios";

export const useSignup=()=>{
    const [error,setError]=useState(null);
    const [isLoading,setIsLoading]=useState(null);
    const dispatch=useDispatch();
    
    
    const signup=async (formData)=>{
        const {name,email,username:rollNumber}=formData;
        setIsLoading(true);
        setError(null);
        // console.log(rollNumber)
        try {
            console.log("heelo");
            console.log(formData);
            const response = await axiosInstance.post('Auth/register', formData);
            console.log(response);
            await axiosInstance.post('/Home/student',{name,email,rollNumber});

            console.log('Signup response:', response.data);
            localStorage.setItem('access_token',response.data['token']['access']);
            localStorage.setItem('refresh_token', response.data['token']['refresh']);
            axiosInstance.defaults.headers['Authorization'] = 'Bearer '+ localStorage.getItem('access_token');
            console.log('Bearer '+ localStorage.getItem('access_token'));
            const response1 = await axiosInstance.get('Auth/profile')
            console.log(response1.data)
            dispatch(personLogin(response1.data));
        }catch (error) {
            console.log('Register Error', error);
            setError(error);
        }
        setIsLoading(false);
        // const response = await fetch('/api/user/signup',{
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json'},
        //     body: JSON.stringify({email,password})
        // })
        // const json=await response.json();
        // // console.log(json,5456955);
        // if(!response.ok){
        //     setIsLoading(false);
        //     setError(json.error);
        // }
        // if(response.ok){
        //     const dataresponse = await fetch('/api/data/addperson',{
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${json.email} ${json.token}`},
        //         body: JSON.stringify({name,email})
        //     })
        //
        //     const datajson=await dataresponse.json();
        //     // console.log(datajson,5698);
        //     if(!dataresponse.ok){
        //         setIsLoading(false);
        //         setError(datajson.error);
        //     }
        //     if(dataresponse.ok){
        //         localStorage.setItem('user', JSON.stringify(json));
        //         setIsLoading(false);
        //         dispatch(userLogin(json));
        //         dispatch(personLogin(datajson));
        //     }
        // }
    }
    return {signup,isLoading,error};
}