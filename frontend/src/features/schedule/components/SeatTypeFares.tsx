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
        { label: SEAT_TYPE_LABELS.SEAT01, fare: reservedFare },
        { label: SEAT_TYPE_LABELS.SEAT02, fare: greenFare },
        { label: SEAT_TYPE_LABELS.SEAT03, fare: gcFare },
    ];

    if (fareList.every((seat) => seat.fare === null)) {
        return null;
    }

    return (
        <div className="divide-line flex divide-x">
            {fareList.map(
                (seat) =>
                    seat.fare !== null && (
                        <div
                            key={seat.label}
                            className="flex flex-col px-3 first:pl-0 last:pr-0"
                        >
                            <span>{seat.label}</span>
                            <span>{`${seat.fare.toLocaleString()}円`}</span>
                        </div>
                    ),
            )}
        </div>
    );
}
