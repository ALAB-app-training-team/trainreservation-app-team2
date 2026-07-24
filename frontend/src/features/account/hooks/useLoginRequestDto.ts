import axios from 'axios';
import { type ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ENDPOINTS } from '@/api/routes';
import type { LoginRequestDto } from '@/features/account/types/LoginRequestDto';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';

export function useLoginRequestDto() {
    const navigate = useNavigate();
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
            const response = await axios.post(
                ENDPOINTS.LOGIN(),
                loginRequestDto,
            );
            localStorage.setItem('name', response.data);
            // TODO: useContextに入れる
            navigate('/scheduleSearch');
        } catch {
            alert(ERROR_MESSAGE.LOGIN_RETRY);
        } finally {
            setIsSubmitting(false);
        }
    };

    return { loginRequestDto, handleChange, handleLogin, isSubmitting };
}
