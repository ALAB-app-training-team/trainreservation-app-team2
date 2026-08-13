import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FiUserPlus } from 'react-icons/fi';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

import { PasswordCheckList } from '@/features/account/components/PasswordCheckList';
import { useAccountRequestDto } from '@/features/account/hooks/useAccountRequestDto';
import { useToastForRedirect } from '@/shared/hooks/useToastForRedirect';
import { removeGuestReservation } from '@/shared/utils/RemoveGuestReservation';

export function Account() {
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
    } = useAccountRequestDto();
    const [passwordType, setPasswordType] = useState('password');
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
                    <div className="text-gray-500">
                        登録するアカウント情報を入力してください
                    </div>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAccount();
                    }}
                    className="flex w-full flex-col gap-4"
                >
                    <div className="flex w-full flex-col gap-8">
                        <div className="flex flex-col items-start">
                            <label htmlFor="name">氏名</label>
                            <div className="focus-within:border-primary bg-primary-light box-border flex w-full items-center justify-between gap-4 rounded-lg px-4 py-2 outline-none focus-within:border-2">
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={accountForm.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="山田 太郎"
                                    autoComplete="name"
                                    required
                                    className="w-full outline-none"
                                />
                            </div>
                            {getFieldError?.('name') && (
                                <p className="text-left text-sm text-red-600">
                                    {getFieldError('name')}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col items-start">
                            <label htmlFor="mail">メールアドレス</label>
                            <div className="focus-within:border-primary bg-primary-light box-border flex w-full items-center justify-between gap-4 rounded-lg px-4 py-2 outline-none focus-within:border-2">
                                <input
                                    id="mail"
                                    type="email"
                                    name="mail"
                                    value={accountForm.mail}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="example@email.com"
                                    autoComplete="email"
                                    required
                                    className="w-full outline-none"
                                />
                            </div>
                            {getFieldError?.('mail') && (
                                <p className="text-left text-sm text-red-600">
                                    {getFieldError('mail')}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col items-start">
                            <label htmlFor="password">パスワード</label>
                            <div className="flex w-full flex-col gap-2">
                                <div className="focus-within:border-primary bg-primary-light box-border flex w-full items-center justify-between gap-4 rounded-lg px-4 py-2 outline-none focus-within:border-2">
                                    <input
                                        id="password"
                                        type={passwordType}
                                        name="password"
                                        value={accountForm.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="パスワードを入力"
                                        autoComplete="current-password"
                                        required
                                        className="w-full outline-none [&::-ms-reveal]:hidden"
                                    />
                                    {passwordType === 'password' && (
                                        <MdVisibilityOff
                                            onClick={() =>
                                                setPasswordType('text')
                                            }
                                        />
                                    )}
                                    {passwordType === 'text' && (
                                        <MdVisibility
                                            onClick={() =>
                                                setPasswordType('password')
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                            <PasswordCheckList policy={policy} />
                        </div>
                        <div className="flex flex-col items-start">
                            <label htmlFor="password">パスワード再入力</label>
                            <div className="flex w-full flex-col gap-2">
                                <div className="focus-within:border-primary bg-primary-light box-border flex w-full items-center justify-between gap-4 rounded-lg px-4 py-2 outline-none focus-within:border-2">
                                    <input
                                        id="passwordCheck"
                                        type={passwordType}
                                        name="passwordCheck"
                                        value={accountForm.passwordCheck}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="パスワードを再入力してください"
                                        autoComplete="current-password"
                                        required
                                        className="w-full outline-none [&::-ms-reveal]:hidden"
                                    />
                                    {passwordType === 'password' && (
                                        <MdVisibilityOff
                                            onClick={() =>
                                                setPasswordType('text')
                                            }
                                        />
                                    )}
                                    {passwordType === 'text' && (
                                        <MdVisibility
                                            onClick={() =>
                                                setPasswordType('password')
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                            {getFieldError?.('passwordCheck') && (
                                <p className="text-left text-sm text-red-600">
                                    {getFieldError('passwordCheck')}
                                </p>
                            )}
                        </div>
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
