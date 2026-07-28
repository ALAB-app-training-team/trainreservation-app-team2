import { useState } from 'react';
import { FiLogIn } from 'react-icons/fi';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

import { useLoginRequestDto } from '@/features/account/hooks/useLoginRequestDto';

export function Login() {
    const { loginRequestDto, handleChange, handleLogin, isSubmitting } =
        useLoginRequestDto();
    const [passwordType, setPasswordType] = useState('password');

    return (
        <div className="flex justify-center">
            <div className="flex w-full flex-col items-center justify-center gap-4 p-8 md:w-6/10">
                <div className="flex flex-col items-center justify-center gap-1">
                    <div>
                        <img src="/logo.svg" className="h-auto w-16" />
                    </div>
                    <h1 className="!text-primary !m-0 text-left !text-3xl">
                        新幹線でGO！
                    </h1>
                    <div className="text-gray-500">
                        アカウントにログインまたは新規登録してください
                    </div>
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
                            <div className="focus-within:border-primary bg-primary-light box-border flex w-full items-center justify-between gap-4 rounded-lg px-4 py-2 outline-none focus-within:border-2">
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
                            <div className="focus-within:border-primary bg-primary-light box-border flex w-full items-center justify-between gap-4 rounded-lg px-4 py-2 outline-none focus-within:border-2">
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
            </div>
        </div>
    );
}
