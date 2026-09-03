import { BsTrainFreightFrontFill } from 'react-icons/bs';
import { MdAirlineSeatReclineExtra } from 'react-icons/md';
import { RiMoneyCnyBoxLine } from 'react-icons/ri';
import { tv, type VariantProps } from 'tailwind-variants';

import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';

const reservedSeatsStyle = tv({
    base: 'flex items-center gap-1 px-2',
    variants: {
        id: {
            reservationList: 'rounded-lg border-primary-ink border',
            updateReservation: 'rounded-lg border-primary-ink border',
            reservationDetail:
                'rounded-lg border-primary-light text-primary-ink bg-success-subtle border-2',
            reservationChange: 'border-primary-ink border-l-2',
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
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <MdAirlineSeatReclineExtra className="mt-0.5" />
                            <label>座席</label>
                        </div>
                        {seats.some((seat) => !seat.name) && (
                            <div className="text-warning mx-auto w-fit rounded-full px-2">
                                同行者が割り当てられていない座席があります
                            </div>
                        )}
                    </div>
                )}
                <div
                    className="flex flex-wrap gap-2"
                    data-testid="reserved-seats"
                >
                    {seats.length !== 0 ? (
                        seats
                            .sort(
                                (a, b) =>
                                    a.trainCarNumber - b.trainCarNumber ||
                                    a.seatNumber - b.seatNumber ||
                                    a.seatColumn.localeCompare(b.seatColumn),
                            )
                            .map((seat) => {
                                return (
                                    <div
                                        key={
                                            seat.trainCarNumber +
                                            seat.seatNumber +
                                            seat.seatColumn
                                        }
                                        className={`${reservedSeatsStyle({ id })} flex shrink-0 items-center gap-2`}
                                    >
                                        <div className="text-fg-secondary flex items-center gap-2">
                                            {id === 'reservationDetail' && (
                                                <BsTrainFreightFrontFill className="text-primary-ink" />
                                            )}
                                            <div>{`${seat.trainCarNumber}号車`}</div>
                                            {id === 'reservationDetail' && (
                                                <div>
                                                    {seat.trainCarTypeName}
                                                </div>
                                            )}
                                            <div>
                                                {`${seat.seatNumber}番` +
                                                    `${seat.seatColumn}席`}
                                            </div>
                                        </div>
                                        {id === 'reservationDetail' && (
                                            <>
                                                <div className="bg-primary h-3.5 w-[1px] self-center" />
                                                <div className="text-primary-ink flex items-center text-xl font-bold whitespace-nowrap">
                                                    <RiMoneyCnyBoxLine />
                                                    {(
                                                        seat.seatFare || 0
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
                    <p className="text-danger text-left text-sm">
                        {getFieldError(id)}
                    </p>
                )}
            </div>
        </>
    );
}
