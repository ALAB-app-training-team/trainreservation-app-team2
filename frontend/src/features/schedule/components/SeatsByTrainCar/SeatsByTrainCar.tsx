import { Fragment } from "react";
import { useSeatsByTrainCar } from "../../hooks/useSeatsByTrainCar";

export function SeatsByTrainCar() {
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
                  <div
                    key={seat.seat_cd}
                    className="px-4 py-3 border-2 rounded-lg border-primary-light"
                  >
                    {seat.seat_number + seat.seat_column}
                  </div>
                ) : (
                  <div key={column + row}></div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
