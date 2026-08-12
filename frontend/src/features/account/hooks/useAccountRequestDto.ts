import { type ChangeEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import type { AccountRequestDto } from '@/features/account/types/AccountRequestDto';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';

export function useAccountRequestDto() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [accountRequestDto, setAccountRequestDto] =
        useState<AccountRequestDto>({
            name: '',
            mail: '',
            password: '',
        });
    const [passwordCheck, setPasswordCheck] = useState('');
    const location = useLocation();
    const { prevPath, ...prevData } = location.state ?? {};

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'passwordCheck') {
            setPasswordCheck(value);
        } else {
            setAccountRequestDto((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleLogin = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const response = await apiClient.post<string>(
                ENDPOINTS.LOGIN(),
                accountRequestDto,
            );
            localStorage.setItem('name', response.data);
            if (!prevPath) {
                navigate('/scheduleSearch', { replace: true });
            } else {
                navigate(prevPath, { state: prevData, replace: true });
            }
        } catch {
            alert(ERROR_MESSAGE.LOGIN_RETRY);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        accountRequestDto,
        passwordCheck,
        handleChange,
        handleLogin,
        isSubmitting,
    };
}
