import axios from 'axios';
import { useState } from 'react';
import { CiMail } from 'react-icons/ci';
import { FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { ENDPOINTS } from '@/api/routes';
import { GuestLoginInput } from '@/features/reservation/components/GuestLoginInput';
import type { GuestLoginFormError } from '@/features/reservation/types/GuestLoginFormError';
import type { ReservationListRequestDto } from '@/features/reservation/types/ReservationListRequestDto';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

export function ReservationGuestLoginBody() {
    const navigate = useNavigate();
    const [guestLoginForm, setGuestLoginForm] =
        useState<ReservationListRequestDto>({
            reserverName: '',
            reserverMail: '',
        });
    const [errors, setErrors] = useState<GuestLoginFormError>({
        reserverName: '',
        reserverMail: '',
        searchReservation: '',
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGuestLoginForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const validateField = (name: string, value: string) => {
        switch (name) {
            case 'reserverName':
                if (!value.trim()) {
                    return '予約者氏名を入力してください。';
                }
                return '';
            case 'reserverMail':
                if (!value.trim()) {
                    return 'メールアドレスを入力してください。';
                } else if (!/\S+@\S+/.test(value)) {
                    return 'メールアドレスの形式が正しくありません。';
                }
                return '';
            default:
                return '';
        }
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value),
        }));
    };

    const handleGuestLogin = async () => {
        const newErrors = {
            reserverName: validateField(
                'reserverName',
                guestLoginForm.reserverName,
            ),
            reserverMail: validateField(
                'reserverMail',
                guestLoginForm.reserverMail,
            ),
            searchReservation: '',
        };
        setErrors(newErrors);
        if (newErrors.reserverName || newErrors.reserverMail) {
            return;
        }
        const response = await axios.get<ReservationResponseDto[]>(
            ENDPOINTS.RESERVATIONLIST(),
            {
                params: guestLoginForm,
            },
        );
        if (response.data.length === 0) {
            setErrors((prev) => ({
                ...prev,
                searchReservation: '予約情報が見つかりません。',
            }));
            return;
        }
        navigate('/reservationList', {
            state: { reservationList: response.data },
        });
        window.scrollTo(0, 0);
    };
    return (
        <>
            <div className="flex justify-center">
                <div className="flex w-full max-w-5xl flex-col gap-4">
                    <div className="border-primary/20 flex flex-col justify-between gap-4 rounded-2xl border-2 p-4">
                        <div className="border-primary/20 flex flex-col gap-4 border-b-2 py-2">
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
                        <label>アカウントをお持ちの方はこちら</label>
                        <button className="border-primary/20 w-full rounded-xl border-2 bg-white p-2">
                            ログインして表示
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
