import { useDispatch } from 'react-redux';
import { userLogin } from '../Store/Slices/userSlice';
import { personLogin } from '../Store/Slices/personSlice';
import { useState } from 'react';

export const useVerifyUser = () => {
    const [isVerifying, setIsVerifying] = useState(true);
    const dispatch = useDispatch();

    const verifystate = async () => {
        setIsVerifying(true);
        let local = localStorage.getItem('user');
        
        if (local) {
            local = JSON.parse(local);

            try {
                const response = await fetch('/api/data/findperson', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${local.token}` // Adjusted here for the token
                    },
                    body: JSON.stringify({ email: local.email })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const json = await response.json();
                dispatch(userLogin(local));
                dispatch(personLogin(json));
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }

        setIsVerifying(false); 
    }

    return { verifystate, isVerifying };
}
