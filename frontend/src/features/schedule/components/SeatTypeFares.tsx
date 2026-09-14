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
        },
        {
            seatTypeCd: 'SEAT02',
            label: SEAT_TYPE_LABELS.SEAT02,
            fare: greenFare,
        },
        { seatTypeCd: 'SEAT03', label: SEAT_TYPE_LABELS.SEAT03, fare: gcFare },
    ];

    if (fareList.every((seat) => seat.fare === null)) {
        return null;
    }

    return (
        <div
            data-testid="seat-type-fares"
            className="divide-line flex divide-x"
        >
            {fareList.map(
                (seat) =>
                    seat.fare !== null && (
                        <div
                            key={seat.seatTypeCd}
                            data-testid={`seat-type-fare-${seat.seatTypeCd}`}
                            className="flex flex-col px-3 first:pl-0 last:pr-0"
                        >
                            <span>
                                {seat.label}
                                <br className="md:hidden" />
                                {`${seat.fare.toLocaleString()}円`}
                            </span>
                        </div>
                    ),
            )}
        </div>
    );
}
