import { type ChangeEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import apiClient from '@/api/apiClient';
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
    const location = useLocation();
    const { prevPath, ...prevData } = location.state ?? {};

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
            const response = await apiClient.post<string>(
                ENDPOINTS.LOGIN(),
                loginRequestDto,
            );
            localStorage.setItem('name', response.data);
            if (!prevPath) {
                navigate('/scheduleSearch', { replace: true });
            } else {
                navigate(prevPath, { state: prevData, replace: true });
            }
        } catch {
            toast.error(ERROR_MESSAGE.LOGIN_RETRY,{
                duration:Infinity,
                action: {
                    label: 'OK',
                    onClick: () => {}
                },
                classNames: {
                    title : 'text-left whitespace-pre-line',
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return { loginRequestDto, handleChange, handleLogin, isSubmitting };
}
