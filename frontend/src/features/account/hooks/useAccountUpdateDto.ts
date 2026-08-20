import axios, { HttpStatusCode } from 'axios';
import { type ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import type { AccountUpdateForm } from '@/features/account/types/AccountUpdateForm';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';
import { VALIDATION_MESSAGE } from '@/shared/constants/ValidationMessages';
import { checkMailRegex } from '@/shared/utils/CheckMailRegex';
import { removeWhiteSpace } from '@/shared/utils/RemoveWhiteSpace';

export function useAccountUpdateDto() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [accountUpdateForm, setAccountUpdateForm] =
        useState<AccountUpdateForm>({
            name: localStorage.getItem('name') ?? '',
            mail: '',
            password: '',
        });

    type InvalidMessage = {
        field: keyof AccountUpdateForm;
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

    const isPasswordEmpty = (value: string) => {
        return value == '';
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
        } else if (field === 'password') {
            if (isPasswordEmpty(value)) {
                messages.push({
                    field: 'password',
                    message: VALIDATION_MESSAGE.EMPTY_PASSWORD,
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
        setAccountUpdateForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        editValidateMessage(name, value);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAccountUpdateForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        editValidateMessage(name, value);
    };

    const checkDisable = (account: AccountUpdateForm) => {
        return (
            isNameEmpty(account.name) ||
            isNameMaxLength(account.name) ||
            isMailEmpty(account.mail) ||
            isMailInvalid(account.mail) ||
            isMailMaxLength(account.mail) ||
            isPasswordEmpty(account.password)
        );
    };

    const isDisable = checkDisable(accountUpdateForm);

    //変更する必要あり
    const handleAccount = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await apiClient.put(ENDPOINTS.ACCOUNT(), {
                name: removeWhiteSpace(accountUpdateForm.name),
                mail: removeWhiteSpace(accountUpdateForm.mail),
                password: accountUpdateForm.password,
            });
            localStorage.setItem(
                'name',
                removeWhiteSpace(accountUpdateForm.name),
            );
            toast.success('アカウント情報の変更が完了しました。');
            navigate('/scheduleSearch', { replace: true });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === HttpStatusCode.Conflict) {
                    toast.error(ERROR_MESSAGE.ACCOUNT_ALREADY, {/* 省略 */});
                } else if (
                    error.response?.status === HttpStatusCode.BadRequest
                ) {
                    toast.error(ERROR_MESSAGE.PASSWORD_NOT_MATCH, {
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
                } else {
                    toast.error(ERROR_MESSAGE.ACCOUNT_CHANGE_RETRY, {
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
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        accountUpdateForm,
        handleChange,
        handleBlur,
        getFieldError,
        isDisable,
        handleAccount,
        isSubmitting,
    };
}
