import type { ReservedSeatDto } from "../types/ReservedSeatDto";
import { BsTrainFreightFrontFill } from "react-icons/bs";

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
      <div className="flex flex-col gap-2 w-full items-start">
        <label htmlFor={id}>{title}</label>
        <div className="flex flex-wrap gap-2">
          {seats.length !== 0 ? (
            seats
              .sort(
                (a, b) =>
                  a.trainCarNumber - b.trainCarNumber ||
                  a.seatNumber - b.seatNumber ||
                  a.seatColumn.localeCompare(b.seatColumn),
              )
              .map((reservedSeats) => {
                return (
                  <div
                    key={
                      reservedSeats.trainCarNumber +
                      reservedSeats.seatNumber +
                      reservedSeats.seatColumn
                    }
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center px-2 border-2 rounded-lg border-primary-light gap-1 bg-green-100 text-primary">
                      <BsTrainFreightFrontFill />
                      <div>{`${reservedSeats.trainCarNumber}号車`}</div>
                      <div>{reservedSeats.trainCarTypeName}</div>
                      <div>
                        {`${reservedSeats.seatNumber}番` +
                          `${reservedSeats.seatColumn}席`}
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
          <p className="text-left text-sm text-red-600 ">{getFieldError(id)}</p>
        )}
      </div>
    </>
  );
}
