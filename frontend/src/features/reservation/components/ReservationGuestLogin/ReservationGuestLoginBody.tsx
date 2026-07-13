import axios from 'axios';
import { useState } from 'react';
import { CiMail } from 'react-icons/ci';
import { FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { ENDPOINTS } from '@/api/routes';
import { GuestLoginInput } from '@/features/reservation/components/GuestLoginInput';
import { useReservationListRequestDto } from '@/features/reservation/hooks/useReservationListRequestDto';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

export function ReservationGuestLoginBody() {
    const {
        guestLoginForm,
        handleChange,
        handleBlur,
        getFieldError,
        isInvalid,
    } = useReservationListRequestDto();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [requestError, setRequestError] = useState<string>('');
    const navigate = useNavigate();
    const handleGuestLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            if (isInvalid) {
                return;
            }
            const removeWhiteSpace = (value: string) => {
                return value.replace(/[\s\u3000]+/g, '');
            };
            const request = {
                ...guestLoginForm,
                reserverName: removeWhiteSpace(guestLoginForm.reserverName),
                reserverMail: removeWhiteSpace(guestLoginForm.reserverMail),
            };
            const response = await axios.get<ReservationResponseDto[]>(
                ENDPOINTS.RESERVATION(),
                {
                    params: request,
                },
            );
            if (response.data.length === 0) {
                setRequestError('予約情報が見つかりません');
                return;
            }
            navigate('/reservationList', {
                state: { reservationList: response.data },
            });
            window.scrollTo(0, 0);
        } catch {
            setRequestError('予約取得時に何らかのエラーが発生しました');
            return;
        } finally {
            setIsSubmitting(false);
        }
    };
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
                            <form
                                className="flex flex-col gap-4 py-2"
                                onSubmit={handleGuestLogin}
                            >
                                <GuestLoginInput
                                    id="reserverName"
                                    label="予約者氏名"
                                    type="text"
                                    inputMode="text"
                                    value={guestLoginForm.reserverName}
                                    placeHolder="山田 太郎"
                                    autoComplete="name"
                                    icon={FiUser}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    validMessage={getFieldError('reserverName')}
                                />
                                <GuestLoginInput
                                    id="reserverMail"
                                    label="メールアドレス"
                                    type="text"
                                    inputMode="email"
                                    value={guestLoginForm.reserverMail}
                                    placeHolder="example@email.com"
                                    autoComplete="email"
                                    icon={CiMail}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    validMessage={getFieldError('reserverMail')}
                                />
                                <button
                                    type="submit"
                                    className="bg-primary w-full rounded-xl p-2 text-white outline-none"
                                    disabled={isInvalid || isSubmitting}
                                >
                                    予約を検索
                                </button>
                                {requestError !== '' && (
                                    <p className="text-left text-sm text-red-600">
                                        {requestError}
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
