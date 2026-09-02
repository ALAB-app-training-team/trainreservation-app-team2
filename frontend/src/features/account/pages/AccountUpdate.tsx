import { useState } from 'react';
import { FiUser } from 'react-icons/fi';

import { AccountInput } from '@/features/account/components/AccountInput';
import { PasswordInput } from '@/features/account/components/PasswordInput';
import { useAccountUpdateDto } from '@/features/account/hooks/useAccountUpdateDto';
import { CustomModal } from '@/shared/components/CustomModal';

export function AccountUpdate() {
    const {
        accountUpdateForm,
        getFieldError,
        handleChange,
        handleBlur,
        isDisable,
        handleAccount,
        handleAccountDelete,
        isSubmitting,
    } = useAccountUpdateDto();

    const [passwordType, setPasswordType] = useState('password');
    // 管理者が退会すると管理者権限が必要な機能に到達できなくなるため、退会させない
    const isAdmin = localStorage.getItem('role') === 'ROLE_ADMIN';
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    return (
        <div className="flex justify-center">
            <div className="flex w-1/2 flex-col items-center justify-center gap-4 p-8 md:w-4/10">
                <div className="flex flex-col items-center justify-center gap-1">
                    <h1 className="!text-primary !m-0 flex items-center justify-center !text-3xl">
                        <FiUser />
                        氏名・メールアドレス変更
                    </h1>
                    <p className="text-gray-500">
                        変更するアカウント情報を入力してください
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
                            value={accountUpdateForm.name}
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
                            value={accountUpdateForm.mail}
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
                            value={accountUpdateForm.password}
                            placeHolder={'現在のパスワードを入力'}
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
                    {!isAdmin && (
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="mt-2 text-sm text-gray-500 underline"
                        >
                            退会はこちら
                        </button>
                    )}
                </form>

                <CustomModal
                    isOpen={isDeleteModalOpen}
                    onRequestClose={() => setIsDeleteModalOpen(false)}
                >
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <h2 className="text-xl font-bold text-red-500">
                                本当に退会しますか？
                            </h2>
                            <p className="text-sm text-gray-500">
                                退会するとアカウント情報は削除され、元に戻せません。
                            </p>
                        </div>

                        <div className="flex w-full gap-3">
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="w-full rounded-lg border border-gray-300 p-2 text-gray-600"
                            >
                                キャンセル
                            </button>
                            <button
                                type="button"
                                onClick={handleAccountDelete}
                                className="w-full rounded-lg bg-red-500 p-2 text-white"
                            >
                                はい
                            </button>
                        </div>
                    </div>
                </CustomModal>
            </div>
        </div>
    );
}
