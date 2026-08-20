import axios, { HttpStatusCode } from 'axios';
import { type ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import type { PasswordCheck } from '@/features/account/types/PasswordCheck';
import type { PasswordUpdateForm } from '@/features/account/types/PasswordUpdateForm';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';
import { VALIDATION_MESSAGE } from '@/shared/constants/ValidationMessages';
import { checkPasswordRegex } from '@/shared/utils/CheckPasswordRegex';

export function usePasswordUpdateDto() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [passwordUpdateForm, setPasswordUpdateForm] =
        useState<PasswordUpdateForm>({
            password: '',
            newPassword: '',
            newPasswordCheck: '',
        });

    const policy: PasswordCheck = {
        isBetweenLength:
            passwordUpdateForm.newPassword.length >= 8 &&
            passwordUpdateForm.newPassword.length <= 64,
        hasNumber: /[0-9]/.test(passwordUpdateForm.newPassword),
        hasUppercase: /[A-Z]/.test(passwordUpdateForm.newPassword),
        hasLowercase: /[a-z]/.test(passwordUpdateForm.newPassword),
        isValid: checkPasswordRegex(passwordUpdateForm.newPassword),
    };

    type InvalidMessage = {
        field: keyof PasswordUpdateForm;
        message: string;
    };
    const [invalidMessages, setInvalidMessages] = useState<InvalidMessage[]>(
        [],
    );

    const isCheckPasswordEmpty = (value: string) => {
        return value == '';
    };
    const isNotMatchNewPassword = (value: string) => {
        return passwordUpdateForm.newPassword !== value;
    };

    const editValidateMessage = (field: string, value: string) => {
        const messages: InvalidMessage[] = invalidMessages.filter(
            (item) => item.field !== field,
        );
        if (field === 'newPasswordCheck') {
            if (isCheckPasswordEmpty(value)) {
                messages.push({
                    field: 'newPasswordCheck',
                    message: VALIDATION_MESSAGE.EMPTY_PASSWORD_CHECK,
                });
            } else if (isNotMatchNewPassword(value)) {
                messages.push({
                    field: 'newPasswordCheck',
                    message: VALIDATION_MESSAGE.PASSWORD_NOT_MATCH,
                });
            }
        }
        setInvalidMessages(messages);
    };

    const getFieldError = (field: string) => {
        return (
            invalidMessages.find((item) => item.field === field)?.message ?? ''
        );
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordUpdateForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        editValidateMessage(name, value);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordUpdateForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        editValidateMessage(name, value);
    };

    const checkDisable = (
        account: PasswordUpdateForm,
        policy: PasswordCheck,
    ) => {
        return (
            !policy.isBetweenLength ||
            !policy.hasNumber ||
            !policy.hasUppercase ||
            !policy.hasLowercase ||
            !policy.isValid ||
            isCheckPasswordEmpty(account.newPasswordCheck) ||
            isNotMatchNewPassword(account.newPasswordCheck)
        );
    };

    const isDisable = checkDisable(passwordUpdateForm, policy);

    //後で変更
    const handleAccount = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await apiClient.post<void>(ENDPOINTS.ACCOUNT(), {
                password: passwordUpdateForm.password,
            });
            toast.success('パスワードの変更が完了しました。');
            navigate('/login', { replace: true });
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response?.status === HttpStatusCode.Conflict
            ) {
                toast.error(ERROR_MESSAGE.ACCOUNT_ALREADY, {
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
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        passwordUpdateForm,
        policy,
        handleChange,
        handleBlur,
        getFieldError,
        isDisable,
        handleAccount,
        isSubmitting,
    };
}
