import type { SeatResponseDto } from "../types/SeatResponseDto";

type SelectedSeatsProps = {
  selectedSeats: SeatResponseDto[];
  limitSeats: number;
};

export function SelectedSeats({
  selectedSeats,
  limitSeats,
}: SelectedSeatsProps) {
  return (
    <>
      <div className="w-full p-8 border-2 rounded-2xl border-primary-light text-left">
        <h1 className="!text-lg !mt-0 !mb-4">選択した座席</h1>
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
                    <div className="px-2 border-2 rounded-lg border-primary-light">{`${selectedSeat.train_car_number}号車`}</div>
                    <div>
                      {selectedSeat.seat_number + selectedSeat.seat_column}
                    </div>
                  </div>
                );
              })
          ) : (
            <div>座席が選択されていません</div>
          )}
          {selectedSeats.length >= limitSeats && (
            <p className="text-left text-sm text-red-600 ">
              一度に予約できる座席は{limitSeats}席までです
            </p>
          )}
        </div>
      </div>
    </>
  );
}
