import { useMemo } from 'react';

import type { Station } from '@/features/schedule/types/Station';
import type { StationResponseDto } from '@/features/schedule/types/StationResponseDto';

const formatStations = (
    rawDtos: StationResponseDto[],
    allStations: Station[],
    selectedStationCd: string,
): Station[] => {
    if (!selectedStationCd) return allStations;

    const selectDto = rawDtos.find(
        (dto) => dto.stationCd === selectedStationCd,
    );
    if (!selectDto) return [];

    const targetCategories = selectDto.categories;

    return rawDtos
        .filter((dto) => dto.stationCd !== selectedStationCd)

        .filter((dto) =>
            dto.categories.some((c) => targetCategories.includes(c)),
        )

        .map((dto) => allStations.find((s) => s.stationCd === dto.stationCd))

        .filter((station): station is Station => !!station);
};

export function useStationFilter(
    stations: Station[],
    departureDtos: StationResponseDto[],
    arrivalDtos: StationResponseDto[],
    departureStationCd: string,
    arrivalStationCd: string,
) {
    const availableArrivalStations = useMemo(() => {
        if (!departureStationCd || departureDtos.length === 0) return stations;

        return formatStations(departureDtos, stations, departureStationCd);
    }, [stations, departureStationCd, departureDtos]);

    const availableDepartureStations = useMemo(() => {
        if (!arrivalStationCd || arrivalDtos.length === 0) return stations;

        return formatStations(arrivalDtos, stations, arrivalStationCd);
    }, [stations, arrivalStationCd, arrivalDtos]);

    return {
        availableArrivalStations,
        availableDepartureStations,
    };
}
