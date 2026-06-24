import { FaClock } from "react-icons/fa";
import type { ReservationResponseDto } from "../../types/ReservationResponseDto";
import { DepartureAndArrivalInfo } from "../DepartureAndArrivalInfo";
import { ReservedSeats } from "../ReservedSeats";

type ReservedTicketInfoProps = {
  ticketInfo: ReservationResponseDto;
};

export function ReservedTicketInfo({ ticketInfo }: ReservedTicketInfoProps) {
  const formatter = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
  return (
    <>
      <div className="flex justify-center">
        <div className="w-full max-w-5xl flex flex-col gap-4 m-8">
          <div className="flex flex-col justify-between border-2 border-primary-light rounded-2xl p-8 gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <DepartureAndArrivalInfo
                id="departureInfo"
                title="出発"
                time={ticketInfo.departure_time}
                station={ticketInfo.departure_station_name}
              />
              <DepartureAndArrivalInfo
                id="arrivalInfo"
                title="到着"
                time={ticketInfo.arrival_time}
                station={ticketInfo.arrival_station_name}
              />
            </div>
            <div className="flex items-center gap-2">
              <div>{formatter.format(new Date(ticketInfo.ride_date))}</div>
              <FaClock />
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <ReservedSeats
                id="seats"
                title="座席"
                seats={ticketInfo.reserved_seats}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
