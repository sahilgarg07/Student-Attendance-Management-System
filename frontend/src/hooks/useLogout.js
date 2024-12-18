import { useDispatch } from "react-redux"
import { userLogout } from '../Store/Slices/userSlice';
import { personLogout } from '../Store/Slices/personSlice';
import axiosInstance from "../axios";

export const useLogout = () => {
    const dispatch = useDispatch();

    const logout = async () => {
        try {
            await axiosInstance.post('Auth/logout');  // Assuming you have a logout endpoint
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            delete axiosInstance.defaults.headers['Authorization'];
            dispatch(userLogout());
            dispatch(personLogout());
        }
    }
    return { logout };
}