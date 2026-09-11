import { type ChangeEvent, type FocusEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import type { LoginRequestDto } from '@/features/account/types/LoginRequestDto';
import type { LoginResponseDto } from '@/features/account/types/LoginResponseDto';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';
import { VALIDATION_MESSAGE } from '@/shared/constants/ValidationMessages';
import { removeWhiteSpace } from '@/shared/utils/RemoveWhiteSpace';

export function useLoginRequestDto() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [loginRequestDto, setLoginRequestDto] = useState<LoginRequestDto>({
        mail: '',
        password: '',
    });
    const location = useLocation();
    const { prevPath, ...prevData } = location.state ?? {};

    type InvalidMessage = {
        field: keyof LoginRequestDto;
        message: string;
    };
    const [invalidMessages, setInvalidMessages] = useState<InvalidMessage[]>(
        [],
    );

    const isMailEmpty = (value: string) => removeWhiteSpace(value) === '';
    const isPasswordEmpty = (value: string) => value === '';

    const isDisable =
        isMailEmpty(loginRequestDto.mail) ||
        isPasswordEmpty(loginRequestDto.password);

    const editValidateMessage = (field: string, value: string) => {
        const messages: InvalidMessage[] = invalidMessages.filter(
            (item) => item.field !== field,
        );
        if (field === 'mail' && isMailEmpty(value)) {
            messages.push({
                field: 'mail',
                message: VALIDATION_MESSAGE.EMPTY_MAIL,
            });
        } else if (field === 'password' && isPasswordEmpty(value)) {
            messages.push({
                field: 'password',
                message: VALIDATION_MESSAGE.EMPTY_PASSWORD,
            });
        }
        setInvalidMessages(messages);
    };

    const getFieldError = (field: string) => {
        return (
            invalidMessages.find((item) => item.field === field)?.message ?? ''
        );
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        editValidateMessage(name, value);
    };

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
            const response = await apiClient.post<LoginResponseDto>(
                ENDPOINTS.LOGIN(),
                loginRequestDto,
            );
            localStorage.setItem('name', response.data.name);
            localStorage.setItem('role', response.data.role);
            if (response.data.role === 'ROLE_ADMIN') {
                navigate('/admin/password', { replace: true });
            } else if (!prevPath) {
                navigate('/scheduleSearch', { replace: true });
            } else {
                navigate(prevPath, { state: prevData, replace: true });
            }
        } catch {
            toast.error(ERROR_MESSAGE.LOGIN_RETRY, {
                duration: Infinity,
                action: {
                    label: 'OK',
                    onClick: () => {},
                },
                classNames: {
                    title: 'text-left whitespace-pre-line',
                    actionButton: '!px-4 !py-2 !text-base !h-auto',
                },
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        loginRequestDto,
        handleChange,
        handleBlur,
        getFieldError,
        isDisable,
        handleLogin,
        isSubmitting,
    };
}
