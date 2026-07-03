import axios from 'axios';
import { Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ENDPOINTS } from '@/api/routes';
import { SelectedSeats } from '@/features/schedule/components/SelectedSeats';
import { TrainCars } from '@/features/schedule/components/TrainCars/TrainCars';
import { TrainCarsSkeleton } from '@/features/schedule/components/TrainCars/TrainCarsSkeleton';
import { useSelectedSeats } from '@/features/schedule/hooks/useSelectedSeats';
import type { ReserveRequestDto } from '@/features/schedule/types/ReserveRequestDto';

export function SelectSeats() {
    const navigate = useNavigate();
    const location = useLocation();
    const { scheduleInfoDto, departureStationCd, arrivalStationCd } =
        location.state;
    const { selectedSeats, limitSeats, handleSelectedSeats } =
        useSelectedSeats();

    const handleReserve = async () => {
        console.log(scheduleInfoDto);

        // TODO: try-catchをつける
        const reserveRequestDto: ReserveRequestDto = {
            schedule_cd: scheduleInfoDto.schedule_cd,
            ride_date: scheduleInfoDto.date,
            departureStationCd: departureStationCd,
            arrivalStationCd: arrivalStationCd,
            seats: selectedSeats.map((seat) => ({
                train_car_cd: seat.train_car_cd,
                seat_cd: seat.seat_cd,
            })),
        };
        const response = await axios.post(
            ENDPOINTS.PURCHASE(),
            reserveRequestDto,
        );
        console.log(response);
        navigate('/reservedTicket', {
            state: { purchaseId: response.data },
        });
    };

    return (
        <>
            <div className="flex w-full flex-col flex-col-reverse items-start justify-between gap-4 p-4 md:flex-row">
                {/* TODO: 戻るボタンを作る */}
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
                    <SelectedSeats
                        selectedSeats={selectedSeats}
                        limitSeats={limitSeats}
                        onClick={handleReserve}
                    />
                </div>
            </div>
        </>
    );
}
