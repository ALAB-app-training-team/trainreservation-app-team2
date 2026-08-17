import { useNavigate } from 'react-router-dom';

import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';

export function useChangeModal(
    onModalRequestClose: () => void,
    isBack: boolean,
    isFromReservedTicket: boolean,
    detail?: ReservationResponseDto,
) {
    const navigate = useNavigate();
    const handleChangeTrain = () => {
        if (detail === undefined) {
            return;
        }
        const searchRequestDto: SearchRequestDto = {
            date: detail.rideDate,
            time: detail.departureTime,
            departureStationCd: detail.departureStationCd,
            arrivalStationCd: detail.arrivalStationCd,
        };
        const preChangeScheduleInfo = {
            scheduleCd: detail.scheduleCd,
            date: detail.rideDate,
            departureTime: detail.departureTime,
            arrivalTime: detail.arrivalTime,
            trainTypeName: detail.trainTypeName,
            departureStationCd: detail.departureStationCd,
            arrivalStationCd: detail.arrivalStationCd,
            departureStationName: detail.departureStationName,
            arrivalStationName: detail.arrivalStationName,
        };
        navigate('/scheduleSearch', {
            state: {
                searchRequestDto,
                isBack,
                reservationId: detail.reservationId,
                isFromReservedTicket,
                reservedSeats: detail.reservedSeats,
                preChangeScheduleInfo: preChangeScheduleInfo,
            },
        });
    };

    const handleChangeSeat = async () => {
        if (detail === undefined) {
            return;
        }
        const scheduleInfoDto: ScheduleInfoDto = {
            scheduleCd: detail.scheduleCd,
            date: detail.rideDate,
            departureTime: detail.departureTime,
            arrivalTime: detail.arrivalTime,
            trainTypeName: detail.trainTypeName,
            departureStationCd: detail.departureStationCd,
            arrivalStationCd: detail.arrivalStationCd,
            departureStationName: detail.departureStationName,
            arrivalStationName: detail.arrivalStationName,
        };
        const searchRequestDto: SearchRequestDto | null = null;
        navigate('/selectSeat', {
            state: {
                scheduleInfoDto,
                searchRequestDto,
                reservedSeats: detail.reservedSeats,
                reservationId: detail.reservationId,
                isFromReservedTicket,
            },
        });
        window.scrollTo(0, 0);
        onModalRequestClose();
    };

    return { handleChangeTrain, handleChangeSeat };
}
