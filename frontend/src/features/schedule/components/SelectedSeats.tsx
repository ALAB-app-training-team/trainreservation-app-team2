import { Fragment } from "react";
import type { SeatResponseDto } from "../types/SeatResponseDto";

type SelectedSeatsProps = {
  selectedSeats: SeatResponseDto[];
};

export function SelectedSeats({ selectedSeats }: SelectedSeatsProps) {
  return (
    <>
      <div className="w-full p-8 border-2 rounded-2xl border-primary-light text-left">
        <h1 className="!text-lg !mt-0 !mb-4">選択した座席</h1>
        {selectedSeats.length !== 0 ? (
          selectedSeats
            .sort((a, b) => a.train_car_number - b.train_car_number)
            .sort((a, b) => a.seat_column.localeCompare(b.seat_column))
            .sort((a, b) => a.seat_number - b.seat_number)
            .map((selectedSeat) => {
              return (
                <Fragment key={selectedSeat.seat_cd}>
                  <div>
                    {`${selectedSeat.train_car_number}号車 ${selectedSeat.seat_number + selectedSeat.seat_column}`}
                  </div>
                </Fragment>
              );
            })
        ) : (
          <div>座席が選択されていません</div>
        )}
      </div>
    </>
  );
}
