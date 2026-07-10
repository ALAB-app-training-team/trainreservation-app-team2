import axios from 'axios';
import { Suspense, useState } from 'react';
import { IoCardOutline } from 'react-icons/io5';
import { LuArrowLeft } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';

import { ENDPOINTS } from '@/api/routes';
import { ReserveUserInfo } from '@/features/schedule/components/ReserveUserInfo';
import { SelectedSeats } from '@/features/schedule/components/SelectedSeats';
import { TrainCars } from '@/features/schedule/components/TrainCars/TrainCars';
import { TrainCarsSkeleton } from '@/features/schedule/components/TrainCars/TrainCarsSkeleton';
import { useReserveUser } from '@/features/schedule/hooks/useReserveUser';
import { useSelectedSeats } from '@/features/schedule/hooks/useSelectedSeats';
import type { PaymentRequestDto } from '@/features/schedule/types/PaymentRequestDto';
import type { ReserveRequestDto } from '@/features/schedule/types/ReserveRequestDto';

export function SelectSeats() {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        scheduleInfoDto,
        departureStationCd,
        arrivalStationCd,
        searchRequestDto,
    } = location.state;
    const {
        selectedSeats,
        limitSeats,
        handleSelectedSeats,
        handleClear,
        checkReservedSeats,
    } = useSelectedSeats();
    const {
        reserveUser,
        focus,
        handleInputChange,
        handleInputFocus,
        handleInputBlur,
        isInvalid,
        getFieldError,
    } = useReserveUser();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const getPaymentToken = async (): Promise<string> => {
        const paymentRequestDto: PaymentRequestDto = {
            number: reserveUser.cardNumber,
            name: reserveUser.cardName,
            expiry: reserveUser.expiry,
            cvc: reserveUser.cvc,
        };
        const response = await axios.post(
            ENDPOINTS.PAYMENT_TOKEN(),
            paymentRequestDto,
        );

        return response.data;
    };

    const submitOrderWithToken = async (
        paymentToken: string,
    ): Promise<string> => {
        const reserveRequestDto: ReserveRequestDto = {
            scheduleCd: scheduleInfoDto.scheduleCd,
            rideDate: scheduleInfoDto.date,
            departureStationCd: departureStationCd,
            arrivalStationCd: arrivalStationCd,
            seats: selectedSeats.map((seat) => ({
                trainCarCd: seat.trainCarCd,
                seatCd: seat.seatCd,
            })),
            reserverName: reserveUser.reserverName,
            reserverMail: reserveUser.reserverMail,
            paymentToken: paymentToken,
        };
        const response = await axios.post(
            ENDPOINTS.RESERVATION(),
            reserveRequestDto,
        );
        return response.data;
    };

    const handleReserve = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const paymentToken = await getPaymentToken();
            const purchaseId = await submitOrderWithToken(paymentToken);
            navigate('/reservedTicket', {
                state: { purchaseId: purchaseId, isBack: false },
            });
        } catch {
            //TODO: エラー時にユーザーにわかりやすく表示する
            alert(
                '予約処理中にエラーが発生しました。お手数ですが再度お試しください。',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-start p-4 pb-0">
                <button
                    type="button"
                    onClick={() => {
                        navigate('/scheduleSearch', {
                            state: { searchRequestDto },
                        });
                    }}
                >
                    <div className="flex items-center gap-2">
                        <LuArrowLeft />
                        検索画面に戻る
                    </div>
                </button>
            </div>
            <div className="flex w-full flex-col items-start justify-between gap-4 p-4 md:flex-row">
                <div className="w-full md:w-7/10">
                    <Suspense fallback={<TrainCarsSkeleton />}>
                        <TrainCars
                            scheduleInfoDto={scheduleInfoDto}
                            selectedSeats={selectedSeats}
                            limitSeats={limitSeats}
                            handleSelectedSeats={handleSelectedSeats}
                            checkReservedSeats={checkReservedSeats}
                        />
                    </Suspense>
                </div>
                <div className="w-full flex-1">
                    <div className="border-primary-light flex w-full flex-col gap-8 rounded-2xl border-2 p-8 text-left">
                        <SelectedSeats
                            selectedSeats={selectedSeats}
                            limitSeats={limitSeats}
                            handleClear={handleClear}
                        />
                        <form onSubmit={handleReserve}>
                            <div className="flex flex-col gap-8">
                                <ReserveUserInfo
                                    reserveUser={reserveUser}
                                    focus={focus}
                                    handleInputChange={handleInputChange}
                                    handleInputFocus={handleInputFocus}
                                    getFieldError={getFieldError}
                                    handleInputBlur={handleInputBlur}
                                />
                                <button
                                    type="submit"
                                    className="bg-primary w-full rounded-lg p-2 text-white"
                                    disabled={
                                        selectedSeats.length === 0 ||
                                        isInvalid ||
                                        isSubmitting
                                    }
                                >
                                    <div className="flex items-center justify-center gap-4">
                                        <IoCardOutline />
                                        予約を確定
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
