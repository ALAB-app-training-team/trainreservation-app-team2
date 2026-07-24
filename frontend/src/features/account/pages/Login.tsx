import { FiLogIn } from 'react-icons/fi';

import { useLoginRequestDto } from '@/features/account/hooks/useLoginRequestDto';

export function Login() {
    const { loginRequestDto, handleChange, handleLogin, isSubmitting } =
        useLoginRequestDto();

    return (
        <div className="flex justify-center">
            <div className="flex w-7/10 flex-col items-center justify-center gap-4 p-8">
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
                            <input
                                id="mail"
                                type="mail"
                                name="mail"
                                value={loginRequestDto.mail}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                required
                                className="focus:border-primary bg-primary-light w-full rounded-xl p-2 outline-none focus:border-2"
                            />
                        </div>
                        <div className="flex flex-col items-start">
                            <label htmlFor="password">パスワード</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={loginRequestDto.password}
                                onChange={handleChange}
                                required
                                className="focus:border-primary bg-primary-light w-full rounded-xl p-2 outline-none focus:border-2"
                            />
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
