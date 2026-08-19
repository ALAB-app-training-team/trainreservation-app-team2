import axios, { HttpStatusCode } from 'axios';
import { type ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import type { AccountForm } from '@/features/account/types/AccountForm';
import type { PasswordCheck } from '@/features/account/types/PasswordCheck';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';
import { VALIDATION_MESSAGE } from '@/shared/constants/ValidationMessages';
import { checkMailRegex } from '@/shared/utils/CheckMailRegex';
import { checkPasswordRegex } from '@/shared/utils/CheckPasswordRegex';
import { removeWhiteSpace } from '@/shared/utils/RemoveWhiteSpace';

export function useAccountRequestDto() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [accountForm, setAccountForm] = useState<AccountForm>({
        name: '',
        mail: '',
        password: '',
        passwordCheck: '',
    });

    const policy: PasswordCheck = {
        isBetweenLength:
            accountForm.password.length >= 8 &&
            accountForm.password.length <= 64,
        hasNumber: /[0-9]/.test(accountForm.password),
        hasUppercase: /[A-Z]/.test(accountForm.password),
        hasLowercase: /[a-z]/.test(accountForm.password),
        isValid: checkPasswordRegex(accountForm.password),
    };

    type InvalidMessage = {
        field: keyof AccountForm;
        message: string;
    };
    const [invalidMessages, setInvalidMessages] = useState<InvalidMessage[]>(
        [],
    );

    const isNameEmpty = (value: string) => {
        return removeWhiteSpace(value) === '';
    };
    const isNameMaxLength = (value: string) => {
        return value.length > 255;
    };

    const isMailEmpty = (value: string) => {
        return removeWhiteSpace(value) === '';
    };
    const isMailInvalid = (value: string) => {
        return checkMailRegex(value);
    };
    const isMailMaxLength = (value: string) => {
        return value.length > 255;
    };

    const isCheckPasswordEmpty = (value: string) => {
        return value == '';
    };
    const isNotMatchPassword = (value: string) => {
        return accountForm.password !== value;
    };

    const editValidateMessage = (field: string, value: string) => {
        const messages: InvalidMessage[] = invalidMessages.filter(
            (item) => item.field !== field,
        );
        if (field === 'name') {
            if (isNameEmpty(value)) {
                messages.push({
                    field: 'name',
                    message: VALIDATION_MESSAGE.EMPTY_NAME,
                });
            } else if (isNameMaxLength(value)) {
                messages.push({
                    field: 'name',
                    message: VALIDATION_MESSAGE.MAX_LENGTH_NAME,
                });
            }
        } else if (field === 'mail') {
            if (isMailEmpty(value)) {
                messages.push({
                    field: 'mail',
                    message: VALIDATION_MESSAGE.EMPTY_MAIL,
                });
            } else if (isMailInvalid(value)) {
                messages.push({
                    field: 'mail',
                    message: VALIDATION_MESSAGE.INVALID_MAIL,
                });
            } else if (isMailMaxLength(value)) {
                messages.push({
                    field: 'mail',
                    message: VALIDATION_MESSAGE.MAX_LENGTH_MAIL,
                });
            }
        } else if (field === 'passwordCheck') {
            if (isCheckPasswordEmpty(value)) {
                messages.push({
                    field: 'passwordCheck',
                    message: VALIDATION_MESSAGE.EMPTY_PASSWORD_CHECK,
                });
            } else if (isNotMatchPassword(value)) {
                messages.push({
                    field: 'passwordCheck',
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
        setAccountForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        editValidateMessage(name, value);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAccountForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        editValidateMessage(name, value);
    };

    const checkDisable = (account: AccountForm, policy: PasswordCheck) => {
        return (
            isNameEmpty(account.name) ||
            isNameMaxLength(account.name) ||
            isMailEmpty(account.mail) ||
            isMailInvalid(account.mail) ||
            isMailMaxLength(account.mail) ||
            !policy.isBetweenLength ||
            !policy.hasNumber ||
            !policy.hasUppercase ||
            !policy.hasLowercase ||
            !policy.isValid ||
            isCheckPasswordEmpty(account.passwordCheck) ||
            isNotMatchPassword(account.passwordCheck)
        );
    };

    const isDisable = checkDisable(accountForm, policy);

    const handleClear = () => {
        setAccountForm({
            name: '',
            mail: '',
            password: '',
            passwordCheck: '',
        });
    };

    const handleAccount = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await apiClient.post<void>(ENDPOINTS.ACCOUNT(), {
                name: removeWhiteSpace(accountForm.name),
                mail: removeWhiteSpace(accountForm.mail),
                password: accountForm.password,
            });
            toast.success(
                'アカウント登録が完了しました。ログインしてください。',
            );
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
        accountForm,
        policy,
        handleChange,
        handleBlur,
        getFieldError,
        isDisable,
        handleAccount,
        isSubmitting,
        handleClear,
    };
}
