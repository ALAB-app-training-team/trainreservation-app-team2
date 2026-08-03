import { RxPeople } from 'react-icons/rx';

import { SEAT_TYPE_LABELS } from '@/features/schedule/constants/SeatTypeLabel';

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
    const seatTypeist = [
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

    if (reservedSeats === 0 && greenSeats === 0 && gcSeats === 0) {
        return (
            <>
                <div className="text-red-500">満席</div>
            </>
        );
    }

    return (
        <>
            <div className="flex flex-wrap gap-1">
                {seatTypeist.map((seat) => {
                    const seatColorClass =
                        seat.count === 0
                            ? 'border-gray-400 bg-gray-200'
                            : {
                                  'reserved-seat':
                                      'border-reserved-seat text-reserved-seat',
                                  'green-seat':
                                      'border-green-seat text-green-seat',
                                  'gc-seat': 'border-gc-seat text-gc-seat',
                              }[seat.name] || '';
                    return (
                        <div
                            key={seat.label}
                            className={`flex items-center gap-2 rounded-full border-1 px-2 ${seatColorClass}`}
                        >
                            <RxPeople />
                            {seat.count === undefined ? seat.label : seat.count}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
