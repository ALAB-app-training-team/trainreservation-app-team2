import { FaTrashCan } from 'react-icons/fa6';

import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';
import { LIMIT } from '@/shared/constants/Limit';

type SelectedSeatsProps = {
    selectedSeats: SeatResponseDto[];
    handleClear: () => void;
};

export function SelectedSeats({
    selectedSeats,
    handleClear,
}: SelectedSeatsProps) {
    return (
        <div className="flex flex-col gap-4" data-testid="selected-seats">
            <div className="flex items-center gap-4">
                <h1 className="!mt-0 !mb-0 !text-lg">選択した座席</h1>
                <button
                    type="button"
                    onClick={handleClear}
                    className="border-primary-ink text-primary-ink rounded-lg border-2 p-1"
                    data-testid="trash-button"
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
                                    <div className="ml-auto">{`￥${selectedSeat.seatFare === null || selectedSeat.seatFare === undefined ? '0' : selectedSeat.seatFare.toLocaleString()}`}</div>
                                </div>
                            );
                        })
                ) : (
                    <div>{ERROR_MESSAGE.NO_SELECTED_SEAT}</div>
                )}
                {selectedSeats.length >= LIMIT.SEATS && (
                    <p className="text-danger text-left text-sm">
                        {ERROR_MESSAGE.LIMIT_SELECTED_SEAT}
                    </p>
                )}
            </div>
        </div>
    );
}
