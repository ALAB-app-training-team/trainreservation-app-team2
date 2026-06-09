import { useState } from "react";
import type { SearchRequestDto } from "../types/SearchRequestDto";

type useSearchRequestDtoProps = { condition?: SearchRequestDto };

export function useSearchRequestDto({
  condition,
}: useSearchRequestDtoProps = {}) {
  const [time, setTime] = useState<string>(condition?.time ?? "");
  const [date, setDate] = useState<string>(condition?.date ?? "");
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
    setTime,
    setDate,
    setDepartureStation,
    setArrivalStation,
    searchRequestDto,
  };
}
