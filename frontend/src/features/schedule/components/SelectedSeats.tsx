import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';

type SelectedSeatsProps = {
    selectedSeats: SeatResponseDto[];
    limitSeats: number;
};

export function SelectedSeats({
    selectedSeats,
    limitSeats,
}: SelectedSeatsProps) {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="!mt-0 !mb-0 !text-lg">選択した座席</h1>
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
                                    key={selectedSeat.seatCd}
                                    className="flex items-center gap-2"
                                >
                                    <div className="border-primary-light rounded-lg border-2 px-2">{`${selectedSeat.trainCarNumber}号車`}</div>
                                    <div>
                                        {selectedSeat.seatNumber +
                                            selectedSeat.seatColumn}
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
        </div>
    );
}
