// import type { ReservedSeatDto } from "@/features/reservation/types/ReservedSeatDto";
import type { ReservedSeatDto } from "../types/ReservedSeatDto";

export type ReservationListResponseDto = {
  trainTypeName: string;
  departureTime: string;
  departureStationName: string;
  arrivalStationName: string;
  rideDate: string;
  seats: ReservedSeatDto[];
};
