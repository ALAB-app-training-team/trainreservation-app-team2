import { useMemo } from "react";
import type { StationResponseDto } from "@/features/schedule/types/StationResponseDto"

export function useStationFilter(
    stations: StationResponseDto[],
    departureStationCd: string,
    arrivalStationCd: string
){
    const selectedDeparture = useMemo(() => {
        return stations.find((s) => s.stationCd === departureStationCd);
    }, [stations, departureStationCd]);

    const selectedArrival = useMemo(() => {
        return stations.find((s) => s.stationCd === arrivalStationCd);
    }, [stations, arrivalStationCd]);

    const availableArrivalStations = useMemo(() => {
        if(!selectedDeparture) return stations;

        return stations.filter((station) => {
            if(station.stationCd === selectedDeparture.stationCd) return false;

            return station.stopCategory.some((stopCategory) => 
            selectedDeparture.stopCategory.includes(stopCategory));
        });
    }, [stations, selectedDeparture]);

    const availableDepartureStations = useMemo(() => {
        if(!selectedArrival) return stations;

        return stations.filter((station) => {
            if(station.stationCd === selectedArrival.stationCd) return false;

            return station.stopCategory.some((stopCategory) => 
            selectedArrival.stopCategory.includes(stopCategory))
        })
    })

    return {
        availableArrivalStations,
        availableDepartureStations
    };
}
