import { BsCircle, BsDashLg, BsTriangle, BsXLg } from 'react-icons/bs';

import { FEW_LEFT_SEATS } from '@/features/schedule/constants/FewLeftSeats';
import { SEAT_TYPE_LABELS } from '@/features/schedule/constants/SeatTypeLabel';
import type { SeatType } from '@/features/schedule/types/SeatType';

type EmptySeatCountProps = {
    reservedSeats?: number;
    greenSeats?: number;
    gcSeats?: number;
};

export function EmptySeatCount({
    reservedSeats,
    greenSeats,
    gcSeats,
}: EmptySeatCountProps) {
    const seatTypeList: SeatType[] = [
        {
            label: SEAT_TYPE_LABELS.SEAT01,
            name: 'reserved-seat',
            count: reservedSeats,
        },
        {
            label: SEAT_TYPE_LABELS.SEAT02,
            name: 'green-seat',
            count: greenSeats,
        },
        {
            label: SEAT_TYPE_LABELS.SEAT03,
            name: 'gc-seat',
            count: gcSeats,
        },
    ];

    const getLeftSeatsLayout = (seat: SeatType) => {
        if (seat.count === undefined) {
            return seat.label;
        } else {
            switch (seat.label) {
                case SEAT_TYPE_LABELS.SEAT01:
                    return checkLeftSeats(seat.count, FEW_LEFT_SEATS.RESERVED);
                case SEAT_TYPE_LABELS.SEAT02:
                    return checkLeftSeats(seat.count, FEW_LEFT_SEATS.GREEN);
                case SEAT_TYPE_LABELS.SEAT03:
                    return checkLeftSeats(seat.count, FEW_LEFT_SEATS.GRANCLASS);
                default:
                    return <BsDashLg />;
            }
        }
    };

    const checkLeftSeats = (count: number, limit: number) => {
        return count > limit ? (
            <BsCircle />
        ) : count === 0 ? (
            <BsXLg />
        ) : (
            <BsTriangle />
        );
    };

    if (reservedSeats === 0 && greenSeats === 0 && gcSeats === 0) {
        return <span className="text-danger">満席</span>;
    }

    return (
        <>
            <div className="flex gap-1">
                {seatTypeList.map((seat) => (
                    <div
                        key={seat.label}
                        className={`flex items-center gap-1 p-2 md:gap-2 md:px-2 md:py-0.5`}
                    >
                        {seat.label}
                        {getLeftSeatsLayout(seat)}
                    </div>
                ))}
            </div>
        </>
    );
}
