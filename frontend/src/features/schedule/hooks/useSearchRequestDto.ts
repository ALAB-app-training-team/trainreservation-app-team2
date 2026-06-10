import { useEffect, useMemo, useState } from "react";
import type { SearchRequestDto } from "../types/SearchRequestDto";
import type { Station } from "../types/Station";

type useSearchRequestDtoProps = {
  condition?: SearchRequestDto;
  stations?: Station[];
};

export function useSearchRequestDto({
  condition,
  stations = [],
}: useSearchRequestDtoProps = {}) {
  const [time, setTime] = useState<string>(
    condition?.time ?? new Date().toTimeString().slice(0, 5),
  );
  const [date, setDate] = useState<string>(
    condition?.date ?? new Date().toISOString().split("T")[0],
  );
  const [departureStation, setDepartureStation] = useState<string>(
    condition?.departure_station_name ?? stations[0]?.name ?? "",
  );
  const [arrivalStation, setArrivalStation] = useState<string>(
    condition?.arrival_station_name ?? stations[1]?.name ?? "",
  );

  const searchRequestDto: SearchRequestDto = useMemo<SearchRequestDto>(() => {
    return {
      date,
      time,
      departure_station_name: departureStation,
      arrival_station_name: arrivalStation,
    };
  }, [date, time, departureStation, arrivalStation]);

  const isInvalid: boolean = departureStation === arrivalStation;

  return {
    setTime,
    setDate,
    setDepartureStation,
    setArrivalStation,
    searchRequestDto,
    isInvalid,
  };
}
