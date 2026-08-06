import { useQueryClient } from '@tanstack/react-query';
import axios, { HttpStatusCode } from 'axios';
import { Suspense, useEffect, useState } from 'react';
import { IoCardOutline } from 'react-icons/io5';
import { LuArrowLeft, LuLogIn } from 'react-icons/lu';
import { redirect, useLocation, useNavigate } from 'react-router-dom';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import { ReloginConfirmModal } from '@/features/schedule/components/ReloginConfirmModal';
import { ReserveConfirmModal } from '@/features/schedule/components/ReserveConfirmModal';
import { ReserveUserInfo } from '@/features/schedule/components/ReserveUserInfo';
import { SelectedSeats } from '@/features/schedule/components/SelectedSeats';
import { TotalSeatsFare } from '@/features/schedule/components/TotalSeatsFare';
import { TrainCars } from '@/features/schedule/components/TrainCars/TrainCars';
import { TrainCarsSkeleton } from '@/features/schedule/components/TrainCars/TrainCarsSkeleton';
import { TrainInfo } from '@/features/schedule/components/TrainInfo';
import { useReserveUser } from '@/features/schedule/hooks/useReserveUser';
import { useResolveReservedSeats } from '@/features/schedule/hooks/useResolveReservedSeats';
import { useSelectedSeats } from '@/features/schedule/hooks/useSelectedSeats';
import type { PaymentRequestDto } from '@/features/schedule/types/PaymentRequestDto';
import type { ReserveRequestDto } from '@/features/schedule/types/ReserveRequestDto';
import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';
import type { SelectSeatsLocationState } from '@/features/schedule/types/SelectSeatsLocationState';
import { CustomModal } from '@/shared/components/CustomModal';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';
import { useModal } from '@/shared/hooks/useModal';
import { removeWhiteSpace } from '@/shared/utils/RemoveWhiteSpace';

export function SelectSeats() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const {
        scheduleInfoDto,
        searchRequestDto,
        prevSelectedSeats,
        reservedSeats,
    }: SelectSeatsLocationState = location.state;
    const { resolveReservedSeat } = useResolveReservedSeats(
        scheduleInfoDto,
        reservedSeats,
    );
    const initialSelectedSeats = reservedSeats
        ? resolveReservedSeat
        : (prevSelectedSeats ?? []);
    const {
        selectedSeats,
        handleSelectedSeats,
        handleClear,
        checkReservedSeats,
    } = useSelectedSeats(initialSelectedSeats);
    const {
        reserveUser,
        focus,
        handleInputChange,
        handleInputFocus,
        handleInputBlur,
        isInvalid,
        getFieldError,
    } = useReserveUser();
    const {
        isOpen: isReserveConfirmModalOpen,
        handleModalOpen: handleReserveConfirmModalOpen,
        onRequestClose: onRequestReserveConfirmModalClose,
    } = useModal();
    const {
        isOpen: isReloginConfirmModalOpen,
        handleModalOpen: handleReloginConfirmModalOpen,
        onRequestClose: onRequestReloginConfirmModalClose,
    } = useModal();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const isLoggedIn = !!localStorage.getItem('name');

    useEffect(() => {
        const nv = performance.getEntriesByType(
            'navigation',
        )[0] as PerformanceNavigationTiming;
        if (!isLoggedIn && searchRequestDto === null && nv.type !== 'reload') {
            sessionStorage.setItem('message', ERROR_MESSAGE.LOGIN_ERROR);
            redirect('/login');
        }
    }, []);

    const getPaymentToken = async (): Promise<string> => {
        const paymentRequestDto: PaymentRequestDto = {
            number: reserveUser.cardNumber,
            name: reserveUser.cardName,
            expiry: reserveUser.expiry,
            cvc: reserveUser.cvc,
        };
        const response = await apiClient.post(
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
            departureStationCd: scheduleInfoDto.departureStationCd,
            arrivalStationCd: scheduleInfoDto.arrivalStationCd,
            seats: selectedSeats.map((seat) => ({
                trainCarCd: seat.trainCarCd,
                trainCarTypeCd: seat.trainCarTypeCd,
                seatCd: seat.seatCd,
                seatFare: seat.seatFare,
            })),
            reserverName: reserveUser.reserverName,
            reserverMail: reserveUser.reserverMail,
            paymentToken: paymentToken,
        };

        if (!reserveUser.reserverMail && !reserveUser.reserverName) {
            const response = await apiClient.post(
                ENDPOINTS.RESERVATION(),
                reserveRequestDto,
            );
            return response.data;
        } else {
            const response = await apiClient.post(
                ENDPOINTS.GUESTRESERVATION(),
                reserveRequestDto,
            );
            return response.data;
        }
    };

    const handleReserve = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const paymentToken = await getPaymentToken();
            const reservationId = await submitOrderWithToken(paymentToken);
            if (!isLoggedIn) {
                sessionStorage.setItem(
                    'guestLoginInfo',
                    JSON.stringify({
                        reserverName: removeWhiteSpace(
                            reserveUser.reserverName,
                        ),
                        reserverMail: removeWhiteSpace(
                            reserveUser.reserverMail,
                        ),
                    }),
                );
            }
            navigate('/reservedTicket', {
                state: {
                    reservationId: reservationId,
                    isBack: false,
                    guestLogin: false,
                },
            });
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response?.status === HttpStatusCode.Conflict &&
                error.response?.data
            ) {
                const errorData = error.response.data;
                const conflictSeats: SeatResponseDto[] =
                    typeof errorData === 'string'
                        ? JSON.parse(errorData)
                        : errorData;
                checkReservedSeats(conflictSeats);

                await queryClient.refetchQueries({
                    predicate: (query) => query.queryKey[0] === 'seat',
                });
                return;
            }
            if (
                axios.isAxiosError(error) &&
                error.response?.status === HttpStatusCode.Unauthorized
            ) {
                handleReloginConfirmModalOpen();

                return;
            }
            alert(ERROR_MESSAGE.RESERVE_RETRY);
        } finally {
            setIsSubmitting(false);
            onRequestReserveConfirmModalClose();
        }
    };

    const handleRelogin = () => {
        navigate('/login', {
            state: {
                prevPath: location.pathname,
                scheduleInfoDto,
                searchRequestDto,
                prevSelectedSeats: selectedSeats,
            },
        });
    };

    return (
        <>
            <div className="flex items-center justify-start p-4 pb-0">
                {searchRequestDto !== null ? (
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
                ) : (
                    <button
                        type="button"
                        onClick={() => {
                            navigate('/reservationList');
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <LuArrowLeft />
                            予約一覧へ戻る
                        </div>
                    </button>
                )}
            </div>

            <div className="flex w-full flex-col items-start justify-between gap-4 p-4 md:flex-row">
                <div className="w-full md:w-7/10">
                    <TrainInfo scheduleInfoDto={scheduleInfoDto} />
                    <Suspense fallback={<TrainCarsSkeleton />}>
                        <TrainCars
                            scheduleInfoDto={scheduleInfoDto}
                            selectedSeats={selectedSeats}
                            handleSelectedSeats={handleSelectedSeats}
                            checkReservedSeats={checkReservedSeats}
                            reservedSeats={reservedSeats}
                        />
                    </Suspense>
                </div>
                <div className="w-full flex-1">
                    <div className="border-primary-light flex w-full flex-col gap-4 rounded-2xl border-2 p-8 text-left">
                        <SelectedSeats
                            selectedSeats={selectedSeats}
                            handleClear={handleClear}
                        />
                        {!isLoggedIn && searchRequestDto !== null && (
                            <div className="border-primary-mid-light bg-primary-light flex w-full flex-col gap-4 rounded-2xl border-2 p-4 text-center">
                                <span>アカウントをお持ちですか？</span>
                                <button
                                    onClick={() =>
                                        navigate('/login', {
                                            state: {
                                                prevPath: location.pathname,
                                                scheduleInfoDto,
                                                searchRequestDto,
                                                prevSelectedSeats:
                                                    selectedSeats,
                                            },
                                        })
                                    }
                                    className="border-primary-mid-light flex w-full items-center justify-center gap-4 rounded-2xl border-2 bg-white p-2 text-center font-medium"
                                >
                                    <LuLogIn />
                                    ログインして氏名・メールアドレスを省略
                                </button>
                            </div>
                        )}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleReserveConfirmModalOpen();
                            }}
                        >
                            <div className="flex flex-col gap-4">
                                <ReserveUserInfo
                                    reserveUser={reserveUser}
                                    focus={focus}
                                    handleInputChange={handleInputChange}
                                    handleInputFocus={handleInputFocus}
                                    getFieldError={getFieldError}
                                    handleInputBlur={handleInputBlur}
                                />
                                <TotalSeatsFare selectedSeats={selectedSeats} />
                                <button
                                    type="submit"
                                    className="bg-primary w-full rounded-lg p-2 text-white"
                                    disabled={
                                        selectedSeats.length === 0 ||
                                        isInvalid ||
                                        isSubmitting ||
                                        searchRequestDto === null //TODO:予約変更API作成後、ボタン押せるようにする
                                    }
                                >
                                    <div className="flex items-center justify-center gap-4">
                                        <IoCardOutline />
                                        予約する
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <CustomModal
                isOpen={isReserveConfirmModalOpen}
                onRequestClose={onRequestReserveConfirmModalClose}
            >
                <ReserveConfirmModal
                    onClick={handleReserve}
                    onRequestClose={onRequestReserveConfirmModalClose}
                    isSubmitting={isSubmitting}
                />
            </CustomModal>
            <CustomModal
                isOpen={isReloginConfirmModalOpen}
                onRequestClose={onRequestReloginConfirmModalClose}
            >
                <ReloginConfirmModal
                    onReloginClick={handleRelogin}
                    onRequestClose={onRequestReloginConfirmModalClose}
                    isSubmitting={isSubmitting}
                />
            </CustomModal>
        </>
    );
}
