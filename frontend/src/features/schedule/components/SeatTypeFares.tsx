import { SEAT_TYPE_LABELS } from '@/features/schedule/constants/SeatTypeLabel';

type SeatTypeFaresProps = {
    reservedFare: number | null;
    greenFare: number | null;
    gcFare: number | null;
};

export function SeatTypeFares({
    reservedFare,
    greenFare,
    gcFare,
}: SeatTypeFaresProps) {
    const fareList = [
        {
            seatTypeCd: 'SEAT01',
            label: SEAT_TYPE_LABELS.SEAT01,
            fare: reservedFare,
            colorClass: 'text-reserved-seat',
        },
        {
            seatTypeCd: 'SEAT02',
            label: SEAT_TYPE_LABELS.SEAT02,
            fare: greenFare,
            colorClass: 'text-green-seat',
        },
        {
            seatTypeCd: 'SEAT03',
            label: SEAT_TYPE_LABELS.SEAT03,
            fare: gcFare,
            colorClass: 'text-gc-seat',
        },
    ];

    if (fareList.every((seat) => seat.fare === null)) {
        return null;
    }

    return (
        <div
            data-testid="seat-type-fares"
            className="divide-line flex divide-x"
        >
            {fareList.map((seat) => (
                <div
                    key={seat.seatTypeCd}
                    data-testid={`seat-type-fare-${seat.seatTypeCd}`}
                    className="flex flex-col px-3 first:pl-0 last:pr-0"
                >
                    <span>
                        <span className={seat.colorClass}>{seat.label}</span>
                        <br className="md:hidden" />
                        {seat.fare === null
                            ? ' -'
                            : ` ${seat.fare.toLocaleString()}円`}
                    </span>
                </div>
            ))}
        </div>
    );
}
