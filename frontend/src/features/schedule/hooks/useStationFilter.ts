import { useMemo } from "react";

import type { Station } from "@/features/schedule/types/Station";
import type { StationResponseDto } from "@/features/schedule/types/StationResponseDto"

const formatStations = (
    rawDtos: StationResponseDto[],
    allStations: Station[],
    selectedStationCd: string
):Station[] => {
    const seen= new Set<string>();

    return [...rawDtos]
      .sort((a, b) => {
        const codeA = a.stopStationCd ?? "";
        const codeB = b.stopStationCd ?? "";
        return codeA.localeCompare(codeB);
      })

      .filter((dto) => dto.stationCd !== selectedStationCd)

      .filter((dto) => {
        if (seen.has(dto.stationCd)) return false;
        seen.add(dto.stationCd);
        return true;
      })

      .map((dto) => allStations.find((s) => s.stationCd === dto.stationCd))

      .filter((station): station is Station => !!station);
};

export function useStationFilter(
    stations: Station[],
    departureDtos:StationResponseDto[],
    arrivalDtos: StationResponseDto[],
    departureStationCd: string,
    arrivalStationCd: string
){
    const availableArrivalStations = useMemo(() => {
        if(!departureStationCd || departureDtos.length === 0) return stations;

       return formatStations(departureDtos, stations, departureStationCd);
    }, [stations, departureStationCd, departureDtos]);

    const availableDepartureStations = useMemo(() => {
        if(!arrivalStationCd || arrivalDtos.length === 0) return stations;

       return formatStations(arrivalDtos, stations, arrivalStationCd);
    }, [stations, arrivalStationCd, arrivalDtos]);

    return {
        availableArrivalStations,
        availableDepartureStations
    };
}
