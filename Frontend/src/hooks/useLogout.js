import { useDispatch } from "react-redux"
import { userLogout} from '../Store/Slices/userSlice';
import { personLogout} from '../Store/Slices/personSlice';
export const useLogout=()=>{
     
    const dispatch = useDispatch();

    const logout=()=>{
        // localStorage.removeItem('user');
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        dispatch(userLogout());
        dispatch(personLogout());
    }
    return {logout};
}