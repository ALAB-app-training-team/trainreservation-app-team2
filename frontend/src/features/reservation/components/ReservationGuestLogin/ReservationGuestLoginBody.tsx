import axios from 'axios';
import { useState } from 'react';
import { CiMail } from 'react-icons/ci';
import { FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { ENDPOINTS } from '@/api/routes';
import { GuestLoginInput } from '@/features/reservation/components/GuestLoginInput';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

export function ReservationGuestLoginBody() {
    const navigate = useNavigate();
    const [guestName, setGuestName] = useState<string>('');
    const [guestMailAddress, setGuestMailAddress] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleGuestLogin = async () => {
        setError('');
        const response = await axios.get<ReservationResponseDto[]>(
            ENDPOINTS.RESERVATIONLIST(),
            // {
            //     params: { purchaseId: purchaseId },
            // },
        );
        if (response.data.length === 0) {
            setError('予約情報が存在しません。入力内容に誤りがあります。');
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
                    <div className="border-primary/10 flex flex-col justify-between gap-4 rounded-2xl border-2 p-4">
                        <div className="border-primary/10 flex flex-col gap-4 border-b-2 py-2">
                            <label className="mb-8 flex items-start font-bold">
                                ゲスト予約の確認
                            </label>
                            <label className="flex items-start">
                                予約時に入力した氏名とメールアドレスを入力してください
                            </label>
                            <GuestLoginInput
                                id="GuestName"
                                label="購入者氏名"
                                type="text"
                                value={guestName}
                                placeholder="山田 太郎"
                                icon={FiUser}
                                setValue={setGuestName}
                            />
                            <GuestLoginInput
                                id="GuestMailAddress"
                                label="メールアドレス"
                                type="email"
                                value={guestMailAddress}
                                placeholder="example@email.com"
                                icon={CiMail}
                                setValue={setGuestMailAddress}
                            />
                            <button
                                className="bg-primary mb-4 w-full rounded-xl p-2 text-white outline-none"
                                onClick={handleGuestLogin}
                            >
                                予約を検索
                            </button>
                            {error !== '' && (
                                <p className="text-left text-sm text-red-600">
                                    {error}
                                </p>
                            )}
                        </div>
                        <label>アカウントをお持ちの方はこちら</label>
                        <button className="border-primary/10 w-full rounded-xl border-2 bg-white p-2">
                            ログインして表示
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
