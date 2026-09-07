import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { useLoginRequestDto } from '@/features/account/hooks/useLoginRequestDto';
import { useToastForRedirect } from '@/shared/hooks/useToastForRedirect';
import { removeGuestReservation } from '@/shared/utils/RemoveGuestReservation';

export function Login() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { loginRequestDto, handleChange, handleLogin, isSubmitting } =
        useLoginRequestDto();
    const [passwordType, setPasswordType] = useState('password');
    useToastForRedirect();
    useEffect(() => {
        removeGuestReservation(queryClient);
    }, []);
    return (
        <div className="flex justify-center">
            <div className="flex w-1/2 flex-col items-center justify-center gap-4 p-8 md:w-4/10">
                <div className="flex flex-col items-center justify-center gap-1">
                    <div>
                        <img src="/logo.svg" className="h-auto w-16" />
                    </div>
                    <h1 className="!text-primary-ink !m-0 text-left !text-3xl">
                        新幹線でGO！
                    </h1>
                    <p className="text-fg-muted">
                        アカウントにログインまたは新規登録してください
                    </p>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                    className="flex w-full flex-col gap-4"
                >
                    <div className="flex w-full flex-col gap-2">
                        <div className="flex flex-col items-start">
                            <label htmlFor="mail">メールアドレス</label>
                            <div className="focus-within:border-primary-ink bg-primary-light box-border flex w-full items-center justify-between gap-4 rounded-lg px-4 py-2 outline-none focus-within:border-2">
                                <input
                                    id="mail"
                                    type="email"
                                    name="mail"
                                    value={loginRequestDto.mail}
                                    onChange={handleChange}
                                    placeholder="example@email.com"
                                    autoComplete="email"
                                    required
                                    className="w-full outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col items-start">
                            <label htmlFor="password">パスワード</label>
                            <div className="focus-within:border-primary-ink bg-primary-light box-border flex w-full items-center justify-between gap-4 rounded-lg px-4 py-2 outline-none focus-within:border-2">
                                <input
                                    id="password"
                                    type={passwordType}
                                    name="password"
                                    value={loginRequestDto.password}
                                    onChange={handleChange}
                                    placeholder="パスワードを入力"
                                    autoComplete="current-password"
                                    required
                                    className="w-full outline-none [&::-ms-reveal]:hidden"
                                />
                                {passwordType === 'password' && (
                                    <MdVisibilityOff
                                        onClick={() => setPasswordType('text')}
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
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary flex w-full items-center justify-center gap-2 rounded-lg p-2 text-white"
                    >
                        <FiLogIn />
                        ログイン
                    </button>
                </form>
                <div className="flex w-full items-center gap-4">
                    <div className="bg-primary h-px flex-1" />
                    <span className="whitespace-nowrap">または</span>
                    <div className="bg-primary h-px flex-1" />
                </div>
                <button
                    onClick={() => navigate('/accountCreate')}
                    type="button"
                    className="border-primary-mid-light bg-surface flex w-full items-center justify-center gap-2 rounded-lg border-2 p-2 text-center font-medium"
                >
                    <FiUserPlus />
                    新規登録
                </button>
            </div>
        </div>
    );
}
