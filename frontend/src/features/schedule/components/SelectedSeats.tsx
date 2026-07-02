import { IoCardOutline } from 'react-icons/io5';

import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';

type SelectedSeatsProps = {
    selectedSeats: SeatResponseDto[];
    limitSeats: number;
    onClick: () => void;
};

export function SelectedSeats({
    selectedSeats,
    limitSeats,
    onClick,
}: SelectedSeatsProps) {
    return (
        <>
            <div className="border-primary-light flex w-full flex-col gap-4 rounded-2xl border-2 p-8 text-left">
                <h1 className="!mt-0 !mb-0 !text-lg">選択した座席</h1>
                <div className="flex flex-col gap-2">
                    {selectedSeats.length !== 0 ? (
                        selectedSeats
                            .sort(
                                (a, b) =>
                                    a.train_car_number - b.train_car_number ||
                                    a.seat_number - b.seat_number ||
                                    a.seat_column.localeCompare(b.seat_column),
                            )
                            .map((selectedSeat) => {
                                return (
                                    <div
                                        key={selectedSeat.seat_cd}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="border-primary-light rounded-lg border-2 px-2">{`${selectedSeat.train_car_number}号車`}</div>
                                        <div>
                                            {selectedSeat.seat_number +
                                                selectedSeat.seat_column}
                                        </div>
                                    </div>
                                );
                            })
                    ) : (
                        <div>座席が選択されていません</div>
                    )}
                    {selectedSeats.length >= limitSeats && (
                        <p className="text-left text-sm text-red-600">
                            一度に予約できる座席は{limitSeats}席までです
                        </p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={onClick}
                    className="bg-primary w-full rounded-lg p-2 text-white"
                    disabled={selectedSeats.length === 0}
                >
                    <div className="flex items-center justify-center gap-4">
                        <IoCardOutline />
                        予約を確定
                    </div>
                </button>
            </div>
        </>
    );
}
