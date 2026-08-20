import { useState } from 'react';
import { FiUser } from 'react-icons/fi';

import { PasswordInput } from '@/features/account/components/PasswordInput';
import { usePasswordUpdateDto } from '@/features/account/hooks/usePasswordUpdateDto';

export function PasswordUpdate() {
    const {
        passwordUpdateForm,
        policy,
        getFieldError,
        handleChange,
        handleBlur,
        isDisable,
        handleAccount,
        isSubmitting,
    } = usePasswordUpdateDto();

    const [passwordType, setPasswordType] = useState('password');

    return (
        <div className="flex justify-center">
            <div className="flex w-1/2 flex-col items-center justify-center gap-4 p-8 md:w-4/10">
                <div className="flex flex-col items-center justify-center gap-1">
                    <h1 className="!text-primary !m-0 flex items-center justify-center !text-3xl">
                        <FiUser />
                        パスワード変更
                    </h1>
                    <div className="text-gray-500">
                        変更するパスワードを入力してください
                    </div>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAccount();
                    }}
                    className="flex w-full flex-col gap-4"
                >
                    <div className="flex w-full flex-col gap-4">
                        <PasswordInput
                            id={'password'}
                            label={'現在のパスワード'}
                            type={passwordType}
                            value={passwordUpdateForm.password}
                            placeHolder={'現在のパスワードを入力'}
                            autoComplete={'new-password'}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            setPasswordType={setPasswordType}
                        />

                        <PasswordInput
                            id={'newPassword'}
                            label={'新しいパスワード'}
                            type={passwordType}
                            value={passwordUpdateForm.newPassword}
                            placeHolder={'新しいパスワードを入力'}
                            autoComplete={'new-password'}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            policy={policy}
                            setPasswordType={setPasswordType}
                        />
                        <PasswordInput
                            id={'newPasswordCheck'}
                            label={'新しいパスワード再入力'}
                            type={passwordType}
                            value={passwordUpdateForm.newPasswordCheck}
                            placeHolder={'新しいパスワードを再入力'}
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
                        <FiUser />
                        変更
                    </button>
                </form>
            </div>
        </div>
    );
}
