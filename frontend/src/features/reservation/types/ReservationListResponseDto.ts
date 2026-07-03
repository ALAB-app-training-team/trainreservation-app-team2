// import type { ReservedSeatDto } from "@/features/reservation/types/ReservedSeatDto";
import type { ReservedSeatDto } from "../types/ReservedSeatDto";

export type ReservationListResponseDto = {
  trainTypeName: string; //やまびこ1号
  departureTime: string;
  departureStationName: string;
  arrivalStationName: string;
  rideDate: string;
  seats: ReservedSeatDto[];
};
