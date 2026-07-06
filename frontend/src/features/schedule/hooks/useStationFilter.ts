import { useMemo } from "react";
import type { StationResponseDto } from "@/features/schedule/types/StationResponseDto"


//特定の駅CDがもつすべての停車分類を取得
const getStopCategoriesByStationCd = (stations: StationResponseDto[], stationCd: string): string[] => {
    if(!stationCd) return [];
    return stations
      .filter((s) => s.stationCd === stationCd)
      .map((s) => s.stopCategory)
      .filter((cat):cat is string => !!cat);
};

//駅CDの重複を削除した駅リストを取得
const getUniqueStations = (stations: StationResponseDto[]): StationResponseDto[] => {
    const seen = new Set<string>();
    return stations.filter((station) => {
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
        return candidateCategories.some((cat) => departureCategories.includes(cat));
       })
    }, [stations, departureStationCd, departureCategories]);

    const availableDepartureStations = useMemo(() => {
        const uniqueStations = getUniqueStations(stations);

        if(!arrivalStationCd || arrivalCategories.length === 0) return uniqueStations;

        return uniqueStations.filter((station) => {
        if(station.stationCd === arrivalStationCd) return false;

        const candidateCategories = getStopCategoriesByStationCd(stations, station.stationCd);
        return candidateCategories.some((cat) => arrivalCategories.includes(cat));
       })
    }, [stations, arrivalStationCd, arrivalCategories]);

    return {
        availableArrivalStations,
        availableDepartureStations
    };
}
