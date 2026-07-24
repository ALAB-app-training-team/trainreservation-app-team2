import axios from 'axios';
import { type ChangeEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ENDPOINTS } from '@/api/routes';
import { authContext } from '@/context/AuthContext';
import type { LoginRequestDto } from '@/features/account/types/LoginRequestDto';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';

export function useLoginRequestDto() {
    const navigate = useNavigate();
    const { setName } = useContext(authContext);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [loginRequestDto, setLoginRequestDto] = useState<LoginRequestDto>({
        mail: '',
        password: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginRequestDto((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLogin = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const response = await axios.post<string>(
                ENDPOINTS.LOGIN(),
                loginRequestDto,
                { withCredentials: true },
            );
            localStorage.setItem('name', response.data);
            if (setName) {
                setName(response.data);
            }
            navigate('/scheduleSearch');
        } catch {
            alert(ERROR_MESSAGE.LOGIN_RETRY);
        } finally {
            setIsSubmitting(false);
        }
    };

    return { loginRequestDto, handleChange, handleLogin, isSubmitting };
}
