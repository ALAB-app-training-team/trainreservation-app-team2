import { useMemo } from "react";
import type { StationResponseDto } from "@/features/schedule/types/StationResponseDto"


//特定の駅CDがもつ重複のない停車分類のリストを取得
const getStopCategoriesByStationCd = (
    stations: StationResponseDto[],
    stationCd: string | undefined
): string[] => {
    if(!stationCd) return [];

    return stations
      .filter((s) => s.stationCd === stationCd)
      .map((s) => s.stopCategory)
      .filter((c): c is string => typeof c === "string" && c !== "");
};

//駅CDの重複を削除したユニークな駅リストを取得
const getUniqueStations = (stations: StationResponseDto[]): StationResponseDto[] => {
    const seen = new Set<string>();
    return stations.filter((station) => {
        if(!station.stationCd) return false;
        if(seen.has(station.stationCd)){
            return false;
        }
        seen.add(station.stationCd);
        return true;
    });
};

export function useStationFilter(
    stations: StationResponseDto[],
    departureStationCd: string,
    arrivalStationCd: string
){
    const departureCategories =useMemo(() => {
        return getStopCategoriesByStationCd(stations, departureStationCd);
    }, [stations, departureStationCd]);

    const arrivalCategories =useMemo(() => {
        return getStopCategoriesByStationCd(stations, arrivalStationCd);
    }, [stations, arrivalStationCd]);

    const availableArrivalStations = useMemo(() => {
        const uniqueStations = getUniqueStations(stations);

        if(!departureStationCd || departureCategories.length === 0) return uniqueStations;

       return uniqueStations.filter((station) => {
        if(station.stationCd === departureStationCd) return false;

        const candidateCategories = getStopCategoriesByStationCd(stations, station.stationCd);
        return candidateCategories.some((c) => departureCategories.includes(c));
       })
    }, [stations, departureStationCd, departureCategories]);

    const availableDepartureStations = useMemo(() => {
        const uniqueStations = getUniqueStations(stations);

        if(!arrivalStationCd || arrivalCategories.length === 0) return uniqueStations;

        return uniqueStations.filter((station) => {
        if(station.stationCd === arrivalStationCd) return false;

        const candidateCategories = getStopCategoriesByStationCd(stations, station.stationCd);
        return candidateCategories.some((c) => arrivalCategories.includes(c));
       })
    }, [stations, arrivalStationCd, arrivalCategories]);

    return {
        availableArrivalStations,
        availableDepartureStations
    };
}
