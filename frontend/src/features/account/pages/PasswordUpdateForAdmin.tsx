import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import { AccountInput } from '@/features/account/components/AccountInput';
import { PasswordInput } from '@/features/account/components/PasswordInput';
import { useAccountRequestDto } from '@/features/account/hooks/useAccountRequestDto';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';
import { useToastForRedirect } from '@/shared/hooks/useToastForRedirect';
import { removeGuestReservation } from '@/shared/utils/RemoveGuestReservation';
import { removeWhiteSpace } from '@/shared/utils/RemoveWhiteSpace';

export function PasswordUpdateForAdmin() {
    const queryClient = useQueryClient();
    const {
        accountForm,
        policy,
        getFieldError,
        handleChange,
        handleBlur,
        isDisable,
        handleClear,
    } = useAccountRequestDto(true);
    const [passwordType, setPasswordType] = useState('password');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    useToastForRedirect();
    useEffect(() => {
        removeGuestReservation(queryClient);
    }, []);

    const handleUpdate = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await apiClient.put<void>(ENDPOINTS.ADMIN_UPDATE(), {
                name: removeWhiteSpace(accountForm.name),
                mail: removeWhiteSpace(accountForm.mail),
                password: accountForm.password,
            });
            handleClear();
            toast.success('変更が完了しました');
        } catch {
            toast.error(ERROR_MESSAGE.ADMIN_UPDATE_ERROR, {
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

    return (
        <>
            <div className="flex justify-center">
                <div className="flex w-1/2 flex-col items-center justify-center gap-4 p-8 md:w-4/10">
                    <h1 className="!text-primary !m-0 flex items-center justify-center !text-3xl">
                        パスワード変更
                    </h1>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdate();
                        }}
                        className="flex w-full flex-col gap-4"
                    >
                        <div className="flex w-full flex-col gap-4">
                            <AccountInput
                                id={'name'}
                                label={'氏名'}
                                type={'text'}
                                value={accountForm.name}
                                placeHolder="山田 太郎"
                                autoComplete="name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                getFieldError={getFieldError}
                            />
                            <AccountInput
                                id={'mail'}
                                label={'メールアドレス'}
                                type={'email'}
                                value={accountForm.mail}
                                placeHolder={'example@email.com'}
                                autoComplete={'email'}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                getFieldError={getFieldError}
                            />
                            <PasswordInput
                                id={'password'}
                                label={'パスワード'}
                                type={passwordType}
                                value={accountForm.password}
                                placeHolder={'パスワードを入力'}
                                autoComplete={'new-password'}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                policy={policy}
                                setPasswordType={setPasswordType}
                            />
                            <PasswordInput
                                id={'passwordCheck'}
                                label={'パスワード再入力'}
                                type={passwordType}
                                value={accountForm.passwordCheck}
                                placeHolder={'パスワードを再入力'}
                                autoComplete={'new-password'}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                getFieldError={getFieldError}
                                setPasswordType={setPasswordType}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting || isDisable}
                            className="bg-primary flex w-full items-center justify-center gap-2 rounded-lg p-2 text-white"
                        >
                            変更を確定
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
