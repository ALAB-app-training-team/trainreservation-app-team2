import { useState } from "react";
import type { SearchRequestDto } from "../types/SearchRequestDto";

type useSearchRequestDtoProps = { condition?: SearchRequestDto };

export function useSearchRequestDto({
  condition,
}: useSearchRequestDtoProps = {}) {
  const [time, setTime] = useState<string>(
    condition?.time ?? new Date().toTimeString().slice(0, 5),
  );
  const [date, setDate] = useState<string>(
    condition?.date ?? new Date().toISOString().split("T")[0],
  );
  const [departureStation, setDepartureStation] = useState<string>(
    condition?.departure_station_name ?? "",
  );
  const [arrivalStation, setArrivalStation] = useState<string>(
    condition?.arrival_station_name ?? "",
  );

  const searchRequestDto: SearchRequestDto = {
    date,
    time,
    departure_station_name: departureStation,
    arrival_station_name: arrivalStation,
  };

  return {
    time,
    date,
    departureStation,
    arrivalStation,
    setTime,
    setDate,
    setDepartureStation,
    setArrivalStation,
    searchRequestDto,
  };
}
