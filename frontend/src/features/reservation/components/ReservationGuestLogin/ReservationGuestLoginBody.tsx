import { useState } from 'react';
import { CiMail } from 'react-icons/ci';
import { FiUser } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { GuestLoginInput } from '@/features/reservation/components/GuestLoginInput';
import { useReservationListRequestDto } from '@/features/reservation/hooks/useReservationListRequestDto';
import { useReservedTickets } from '@/features/reservation/hooks/useReservedTickets';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';
import { removeWhiteSpace } from '@/shared/utils/RemoveWhiteSpace';

export function ReservationGuestLoginBody() {
    const {
        guestLoginForm,
        handleChange,
        handleBlur,
        getFieldError,
        isInvalid,
    } = useReservationListRequestDto();
    const [searchParams] = useSearchParams();
    const targetReservationId = searchParams.get('reservationId');
    const { reservedTickets, getReservationTicket } =
        useReservedTickets(targetReservationId);
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
            const request = {
                ...guestLoginForm,
                reserverName: removeWhiteSpace(guestLoginForm.reserverName),
                reserverMail: removeWhiteSpace(guestLoginForm.reserverMail),
            };
            if (
                targetReservationId !== null &&
                getReservationTicket(targetReservationId, request) === null
            ) {
                setRequestError(ERROR_MESSAGE.NO_RESERVATION);
                return;
            }
            sessionStorage.setItem('guestLoginInfo', JSON.stringify(request));

            if (targetReservationId) {
                const targetReservation = reservationList.find(
                    (item) =>
                        String(item.reservationId) ===
                        String(targetReservationId),
                );

                if (targetReservation) {
                    navigate('/reservedTicket', {
                        state: {
                            reservationId: targetReservationId,
                            isBack: false,
                        },
                    });
                    window.scrollTo(0, 0);
                    return;
                }
            }

            navigate('/reservationList');
            window.scrollTo(0, 0);
        } catch {
            setRequestError(ERROR_MESSAGE.ANY_RESERVATION_ERROR);
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
                                    id="reservationId"
                                    label="予約ID"
                                    type="text"
                                    inputMode="text"
                                    value={
                                        targetReservationId === null
                                            ? ''
                                            : targetReservationId
                                    }
                                    placeHolder="予約ID"
                                    autoComplete="text"
                                    icon={FiUser}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    validMessage={getFieldError(
                                        'reservationId',
                                    )}
                                />
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
