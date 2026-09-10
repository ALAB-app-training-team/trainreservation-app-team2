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
    const totalFare = seats.reduce(
        (accumulator, seat) => accumulator + seat.seatFare,
        0,
    );
    return (
        <div
            className={
                'border-primary-mid-light flex flex-col gap-1 rounded-2xl border-2 p-4'
            }
        >
            <div>
                <div className="flex justify-between">
                    <div className="flex gap-3">
                        <span className="text-base font-bold">
                            {dayjs(detail.date).format('YYYY年MM月DD日')}
                        </span>
                        <span className="text-gray-500">
                            {detail.trainTypeName}
                        </span>
                    </div>
                    <div className="hidden md:inline">
                        <span>合計 </span>
                        <span className="font-bold">
                            ￥{totalFare.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="flex gap-3 text-lg font-bold">
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
            <div className="border-primary-mid-light flex justify-between border-t pt-2 md:hidden">
                <span>合計</span>
                <span className="font-bold">
                    ￥{totalFare.toLocaleString()}
                </span>
            </div>
        </div>
    );
}
