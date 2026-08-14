import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { ReservedSeats } from '@/features/reservation/components/ReservedSeats';
import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';

type UpdatedReservationInfo = {
    detail: ScheduleInfoDto;
    seats: ReservedSeatDto[];
};

export function UpdatedReservationInfo({
    detail,
    seats,
}: UpdatedReservationInfo) {
    dayjs.extend(customParseFormat);
    return (
        <div className={'border-primary-mid-light rounded-2xl border-2 p-3'}>
            <div className="p-2">
                <div className="flex gap-3">
                    <span className="text-xl font-bold">
                        {dayjs(detail.date).format('YYYY年MM月DD日')}
                    </span>
                    <span className="text-gray-500">
                        {detail.trainTypeName}
                    </span>
                </div>

                <div className="flex gap-3 text-2xl font-bold">
                    <div className="flex-col">
                        {detail.departureStationName}
                        <br />
                        {dayjs(detail.departureTime, 'HH:mm:ss').format(
                            'HH:mm',
                        )}
                    </div>
                    →
                    <div className="flex-col">
                        {detail.arrivalStationName}
                        <br />
                        {dayjs(detail.arrivalTime, 'HH:mm:ss').format('HH:mm')}
                    </div>
                </div>
            </div>

            <ReservedSeats id={'updateReservation'} title="" seats={seats} />
        </div>
    );
}
