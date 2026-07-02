import { BsTrainFreightFrontFill } from 'react-icons/bs';

import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';

type ReservedSeatsProps = {
    id: string;
    title: string;
    seats: ReservedSeatDto[];
    getFieldError?: (field: string) => string;
};

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
                                    a.train_car_number - b.train_car_number ||
                                    a.seat_number - b.seat_number ||
                                    a.seat_column.localeCompare(b.seat_column),
                            )
                            .map((reservedSeats) => {
                                return (
                                    <div
                                        key={
                                            reservedSeats.train_car_number +
                                            reservedSeats.seat_number +
                                            reservedSeats.seat_column
                                        }
                                        className="flex items-center gap-2"
                                    >
                                        <div className="border-primary-light text-primary flex items-center gap-1 rounded-lg border-2 bg-green-100 px-2">
                                            <BsTrainFreightFrontFill />
                                            <div>{`${reservedSeats.train_car_number}号車`}</div>
                                            <div>
                                                {
                                                    reservedSeats.train_car_type_name
                                                }
                                            </div>
                                            <div>
                                                {`${reservedSeats.seat_number}番` +
                                                    `${reservedSeats.seat_column}席`}
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
