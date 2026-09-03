import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { AccountInput } from '@/features/account/components/AccountInput';
import { PasswordInput } from '@/features/account/components/PasswordInput';
import { useAccountRequestDto } from '@/features/account/hooks/useAccountRequestDto';
import { useToastForRedirect } from '@/shared/hooks/useToastForRedirect';
import { removeGuestReservation } from '@/shared/utils/RemoveGuestReservation';

export function PasswordUpdateForAdmin() {
    const queryClient = useQueryClient();
    const {
        accountForm,
        policy,
        getFieldError,
        handleChange,
        handleBlur,
        isDisable,
        isSubmitting,
        handleUpdate,
    } = useAccountRequestDto(true);
    const [passwordType, setPasswordType] = useState('password');
    useToastForRedirect();
    useEffect(() => {
        removeGuestReservation(queryClient);
    }, []);

    return (
        <>
            <div className="flex justify-center">
                <div className="flex w-full flex-col items-center justify-center gap-4 p-8 sm:w-4/10">
                    <h1 className="!text-primary !m-0 flex items-center justify-center !text-3xl">
                        パスワード変更
                    </h1>
                    <p className="text-gray-500">
                        パスワードを変更するユーザーの情報を入力してください
                    </p>
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
