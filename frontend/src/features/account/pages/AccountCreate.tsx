import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FiUserPlus } from 'react-icons/fi';

import { AccountInput } from '@/features/account/components/AccountInput';
import { PasswordInput } from '@/features/account/components/PasswordInput';
import { useAccountRequestDto } from '@/features/account/hooks/useAccountRequestDto';
import { useToastForRedirect } from '@/shared/hooks/useToastForRedirect';
import { removeGuestReservation } from '@/shared/utils/RemoveGuestReservation';

export function AccountCreate() {
    const queryClient = useQueryClient();
    const {
        accountForm,
        policy,
        getFieldError,
        handleChange,
        handleBlur,
        isDisable,
        handleAccount,
        isSubmitting,
    } = useAccountRequestDto(false);
    const [passwordType, setPasswordType] = useState('password');
    const [passwordCheckType, setPasswordCheckType] = useState('password');
    useToastForRedirect();
    useEffect(() => {
        removeGuestReservation(queryClient);
    }, []);
    return (
        <div className="flex justify-center">
            <div className="flex w-1/2 flex-col items-center justify-center gap-4 p-8 md:w-4/10">
                <div className="flex flex-col items-center justify-center gap-1">
                    <h1 className="!text-primary !m-0 flex items-center justify-center !text-3xl">
                        <FiUserPlus />
                        新規登録
                    </h1>
                    <p className="text-gray-500">
                        登録するアカウント情報を入力してください
                    </p>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAccount();
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
                            type={passwordCheckType}
                            value={accountForm.passwordCheck}
                            placeHolder={'パスワードを再入力'}
                            autoComplete={'new-password'}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            getFieldError={getFieldError}
                            setPasswordType={setPasswordCheckType}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting || isDisable}
                        className="bg-primary flex w-full items-center justify-center gap-2 rounded-lg p-2 text-white"
                    >
                        <FiUserPlus />
                        登録
                    </button>
                </form>
            </div>
        </div>
    );
}
