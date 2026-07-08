import { CiMail } from 'react-icons/ci';
import { FiUser } from 'react-icons/fi';

import { GuestLoginInput } from '@/features/reservation/components/GuestLoginInput';
import { useReservationListRequestDto } from '@/features/reservation/hooks/useReservationListRequestDto';

export function ReservationGuestLoginBody() {
    const {
        guestLoginForm,
        errors,
        handleChange,
        handleBlur,
        isInvalid,
        handleGuestLogin,
    } = useReservationListRequestDto();
    return (
        <>
            <div className="flex justify-center">
                <div className="flex w-full max-w-5xl flex-col gap-4">
                    <div className="border-primary/20 flex flex-col justify-between gap-4 rounded-2xl border-2 p-4">
                        <div className="flex flex-col gap-4 py-2">
                            <label className="mb-8 flex items-start font-bold">
                                ゲスト予約の確認
                            </label>
                            <label className="flex items-start">
                                予約時に入力した氏名とメールアドレスを入力してください
                            </label>
                            <GuestLoginInput
                                id="reserverName"
                                label="予約者氏名"
                                type="text"
                                value={guestLoginForm.reserverName}
                                placeholder="山田 太郎"
                                icon={FiUser}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.reserverName}
                            />
                            <GuestLoginInput
                                id="reserverMail"
                                label="メールアドレス"
                                type="email"
                                value={guestLoginForm.reserverMail}
                                placeholder="example@email.com"
                                icon={CiMail}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.reserverMail}
                            />
                            <button
                                className="bg-primary w-full rounded-xl p-2 text-white outline-none"
                                disabled={isInvalid}
                                onClick={handleGuestLogin}
                            >
                                予約を検索
                            </button>
                            {errors.searchReservation && (
                                <p className="text-left text-sm text-red-600">
                                    {errors.searchReservation}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
