import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { ReservedSeats } from '@/features/reservation/components/ReservedSeats';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

type ReservationInfoProps = {
    details: ReservationResponseDto;
    id: 'reservationDetail' | 'reservationList' | 'reservationChange';
};

export function ReservationInfo({ details, id }: ReservationInfoProps) {
    dayjs.extend(customParseFormat);
    return (
        <>
            <div>
                <span className="text-xl font-bold">
                    {dayjs(details.rideDate).format('YYYY年MM月DD日')}
                    <br />
                    {dayjs(details.departureTime, 'HH:mm:ss').format('HH:mm')}発
                </span>
            </div>
            <div className="text-2xl font-bold">
                {details.departureStationName} → {details.arrivalStationName}
            </div>
            <ReservedSeats id={id} title="" seats={details.reservedSeats} />
        </>
    );
}
