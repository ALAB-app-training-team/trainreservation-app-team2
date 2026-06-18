import { Fragment } from "react";
import { useSeatsByTrainCar } from "../../hooks/useSeatsByTrainCar";
import { Seat } from "../seat";

type SeatsByTrainCarProps = {
  selectedSeats: string[];
  handleSelectedSeats: (id: string) => void;
};

export function SeatsByTrainCar({
  selectedSeats,
  handleSelectedSeats,
}: SeatsByTrainCarProps) {
  // TODO: 引数を動的にする
  const { seats } = useSeatsByTrainCar("E5SER01");

  const columns: string[] = Array.from(
    new Set(seats.map((seat) => seat.seat_column)),
  ).sort();
  const rows: number[] = Array.from(
    new Set(seats.map((seat) => seat.seat_number)),
  ).sort((a, b) => a - b);

  return (
    <>
      <div className="flex flex-col justify-center items-start w-full gap-4">
        <h1 className="text-left !text-xl !m-0">
          {seats[0].train_car_number}号車
        </h1>
        <div
          className={`grid gap-2`}
          style={{
            gridTemplateColumns: `repeat(${columns.length + 1}, minmax(0, 1fr))`,
          }}
        >
          {rows.map((row) => (
            <Fragment key={row}>
              <div className="flex justify-center items-center">{row}</div>
              {columns.map((column) => {
                const seat = seats.find(
                  (seat) =>
                    seat.seat_column === column && seat.seat_number === row,
                );
                return seat ? (
                  <Seat
                    key={seat.seat_cd}
                    id={seat.seat_cd}
                    onClick={handleSelectedSeats}
                    disabled={seat.is_reserved}
                    type={
                      seat.is_reserved
                        ? "isReserved"
                        : selectedSeats.includes(seat.seat_cd)
                          ? "isSelected"
                          : "reservable"
                    }
                    isReserveMode={true}
                    name={seat.seat_number + seat.seat_column}
                  />
                ) : (
                  <div key={column + row}></div>
                );
              })}
            </Fragment>
          ))}
        </div>
        <div className="flex gap-4">
          <div className="flex gap-1 items-center">
            <Seat type="isReserved" isReserveMode={false} />
            <div className="text-sm">空席</div>
          </div>
          <div className="flex gap-1 items-center">
            <Seat type="isSelected" isReserveMode={false} />
            <div className="text-sm">選択中</div>
          </div>
          <div className="flex gap-1 items-center">
            <Seat type="reservable" isReserveMode={false} />
            <div className="text-sm">予約済み</div>
          </div>
        </div>
      </div>
    </>
  );
}
