import { FaTrashCan } from 'react-icons/fa6';

import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';

type SelectedSeatsProps = {
    selectedSeats: SeatResponseDto[];
    limitSeats: number;
    handleClear: () => void;
};

export function SelectedSeats({
    selectedSeats,
    limitSeats,
    handleClear,
}: SelectedSeatsProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <h1 className="!mt-0 !mb-0 !text-lg">選択した座席</h1>
                <button
                    type="button"
                    onClick={handleClear}
                    className="border-primary text-primary rounded-lg border-2 p-1"
                >
                    <FaTrashCan />
                </button>
            </div>
            <div className="flex flex-col gap-2">
                {selectedSeats.length !== 0 ? (
                    selectedSeats
                        .sort(
                            (a, b) =>
                                a.trainCarNumber - b.trainCarNumber ||
                                a.seatNumber - b.seatNumber ||
                                a.seatColumn.localeCompare(b.seatColumn),
                        )
                        .map((selectedSeat) => {
                            return (
                                <div
                                    key={
                                        selectedSeat.trainCarCd +
                                        selectedSeat.seatCd
                                    }
                                    className="flex items-center gap-2"
                                >
                                    <div className="border-primary-light rounded-lg border-2 px-2">{`${selectedSeat.trainCarNumber}号車`}</div>
                                    <div>
                                        {selectedSeat.seatNumber +
                                            selectedSeat.seatColumn}
                                    </div>
                                    <div className="ml-auto">{`￥${selectedSeat.seatFare !== null || selectedSeat.seatFare !== undefined ? selectedSeat.seatFare.toLocaleString() : '0'}`}</div>
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
        </div>
    );
}
