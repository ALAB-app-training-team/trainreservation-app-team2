import axios from 'axios';
import { Suspense } from 'react';
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
    const { selectedSeats, limitSeats, handleSelectedSeats } =
        useSelectedSeats();
    const {
        reserveUser,
        focus,
        handleInputChange,
        handleInputFocus,
        isInvalid,
        getFieldError,
    } = useReserveUser();

    const handleReserve = async () => {
        // TODO: try-catchをつける
        const reserveRequestDto: ReserveRequestDto = {
            scheduleCd: scheduleInfoDto.scheduleCd,
            rideDate: scheduleInfoDto.date,
            departureStationCd: departureStationCd,
            arrivalStationCd: arrivalStationCd,
            seats: selectedSeats.map((seat) => ({
                trainCarCd: seat.trainCarCd,
                seatCd: seat.seatCd,
            })),
        };
        const response = await axios.post(
            ENDPOINTS.PURCHASE(),
            reserveRequestDto,
        );
        navigate('/reservedTicket', {
            state: { purchaseId: response.data },
        });
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
                            handleSelectedSeats={handleSelectedSeats}
                        />
                    </Suspense>
                </div>
                <div className="w-full flex-1">
                    <div className="border-primary-light flex w-full flex-col gap-8 rounded-2xl border-2 p-8 text-left">
                        <SelectedSeats
                            selectedSeats={selectedSeats}
                            limitSeats={limitSeats}
                        />
                        <form onSubmit={handleReserve}>
                            <div className="flex flex-col gap-8">
                                <ReserveUserInfo
                                    reserveUser={reserveUser}
                                    focus={focus}
                                    handleInputChange={handleInputChange}
                                    handleInputFocus={handleInputFocus}
                                    getFieldError={getFieldError}
                                />
                                <button
                                    type="submit"
                                    className="bg-primary w-full rounded-lg p-2 text-white"
                                    disabled={
                                        selectedSeats.length === 0 || isInvalid
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
