import { useMemo } from "react";

import type { Station } from "@/features/schedule/types/Station";
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

export function useStationFilter(
    stations: Station[], //表示用(nameあり、重複なし)の駅リスト
    stationResponseDtos: StationResponseDto[], //停車分類判定用のレコードリスト
    departureStationCd: string,
    arrivalStationCd: string
){
    const departureCategories =useMemo(() => {
        return getStopCategoriesByStationCd(stationResponseDtos, departureStationCd);
    }, [stationResponseDtos, departureStationCd]);

    const arrivalCategories =useMemo(() => {
        return getStopCategoriesByStationCd(stationResponseDtos, arrivalStationCd);
    }, [stationResponseDtos, arrivalStationCd]);

    const availableArrivalStations = useMemo(() => {
        if(!departureStationCd || departureCategories.length === 0) return stations;

       return stations.filter((station) => {
        if(station.stationCd === departureStationCd) return false;

        const candidateCategories = getStopCategoriesByStationCd(stationResponseDtos, station.stationCd);

        return candidateCategories.some((c) => departureCategories.includes(c));
       })
    }, [stations, stationResponseDtos, departureStationCd, departureCategories]);

    const availableDepartureStations = useMemo(() => {
        if(!arrivalStationCd || arrivalCategories.length === 0) return stations;

        return stations.filter((station) => {
        if(station.stationCd === arrivalStationCd) return false;

        const candidateCategories = getStopCategoriesByStationCd(stationResponseDtos, station.stationCd);

        return candidateCategories.some((c) => arrivalCategories.includes(c));
       })
    }, [stations, stationResponseDtos, arrivalStationCd, arrivalCategories]);

    return {
        availableArrivalStations,
        availableDepartureStations
    };
}
