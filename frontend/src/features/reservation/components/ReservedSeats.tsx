import { BsTrainFreightFrontFill } from 'react-icons/bs';
import { tv, type VariantProps } from 'tailwind-variants';

import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';

const reservedSeatsStyle = tv({
    base: 'flex items-center gap-1 rounded-lg px-2',
    variants: {
        id: {
            reservationList: 'border-primary border',
            reservationDetail:
                'border-primary-light text-primary bg-green-100 border-2',
        },
    },
    defaultVariants: {
        id: 'reservationList',
    },
});

type ReservedSeatsProps = {
    id: string;
    title: string;
    seats: ReservedSeatDto[];
    getFieldError?: (field: string) => string;
} & VariantProps<typeof reservedSeatsStyle>;

export function ReservedSeats({
    id,
    title,
    seats,
    getFieldError: getFieldError,
}: ReservedSeatsProps) {
    return (
        <>
            <div className="flex w-full flex-col items-start gap-2">
                <label htmlFor={id}>{title}</label>
                <div className="flex flex-wrap gap-2">
                    {seats.length !== 0 ? (
                        seats
                            .sort(
                                (a, b) =>
                                    a.trainCarNumber - b.trainCarNumber ||
                                    a.seatNumber - b.seatNumber ||
                                    a.seatColumn.localeCompare(b.seatColumn),
                            )
                            .map((reservedSeats) => {
                                return (
                                    <div
                                        key={
                                            reservedSeats.trainCarNumber +
                                            reservedSeats.seatNumber +
                                            reservedSeats.seatColumn
                                        }
                                        className="flex items-center gap-2"
                                    >
                                        <div
                                            className={reservedSeatsStyle({
                                                id,
                                            })}
                                        >
                                            {id === 'reservationDetail' ? (
                                                <BsTrainFreightFrontFill />
                                            ) : null}
                                            <div>{`${reservedSeats.trainCarNumber}号車`}</div>
                                            {id === 'reservationDetail' ? (
                                                <div>
                                                    {
                                                        reservedSeats.trainCarTypeName
                                                    }
                                                </div>
                                            ) : null}
                                            <div>
                                                {`${reservedSeats.seatNumber}番` +
                                                    `${reservedSeats.seatColumn}席`}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                    ) : (
                        <div>購入済座席が存在しません</div>
                    )}
                </div>
                {getFieldError?.(id) && (
                    <p className="text-left text-sm text-red-600">
                        {getFieldError(id)}
                    </p>
                )}
            </div>
        </>
    );
}
