import { BsTrainFreightFrontFill } from 'react-icons/bs';
import { MdAirlineSeatReclineExtra } from 'react-icons/md';
import { RiMoneyCnyBoxLine } from 'react-icons/ri';
import { tv, type VariantProps } from 'tailwind-variants';

import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';

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
                {title && (
                    <div className="flex items-center gap-2">
                        <MdAirlineSeatReclineExtra className="mt-0.5" />
                        <label>座席</label>
                    </div>
                )}
                <div
                    className="flex flex-wrap gap-2"
                    data-testId="reserved-seats"
                >
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
                                        className={`${reservedSeatsStyle({ id })} flex shrink-0 items-center gap-2`}
                                    >
                                        <div className="flex items-center gap-2 text-gray-700">
                                            {id === 'reservationDetail' && (
                                                <BsTrainFreightFrontFill className="text-primary" />
                                            )}
                                            <div>{`${reservedSeats.trainCarNumber}号車`}</div>
                                            {id === 'reservationDetail' && (
                                                <div>
                                                    {
                                                        reservedSeats.trainCarTypeName
                                                    }
                                                </div>
                                            )}
                                            <div>
                                                {`${reservedSeats.seatNumber}番` +
                                                    `${reservedSeats.seatColumn}席`}
                                            </div>
                                        </div>
                                        {id === 'reservationDetail' && (
                                            <>
                                                <div className="bg-primary h-3.5 w-[1px] self-center" />
                                                <div className="text-primary flex items-center text-xl font-bold whitespace-nowrap">
                                                    <RiMoneyCnyBoxLine />
                                                    {(
                                                        reservedSeats.seatFare ||
                                                        0
                                                    ).toLocaleString()}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })
                    ) : (
                        <div>{ERROR_MESSAGE.NO_RESERVED_SEAT}</div>
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
