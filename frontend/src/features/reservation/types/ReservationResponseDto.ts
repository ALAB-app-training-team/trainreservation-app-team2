import type { ReservedSeatDto } from "./ReservedSeatDto";

export type ReservationResponseDto = {
  train_type_name: string;
  departure_time: string;
  departure_station_name: string;
  arrival_time: string;
  arrival_station_name: string;
  ride_date: string;
  reserved_seats: ReservedSeatDto[];
};
