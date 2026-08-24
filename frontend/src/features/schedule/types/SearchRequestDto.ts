export type SearchRequestDto = {
    date?: string;
    time?: string;
    departureStationCd: string;
    arrivalStationCd: string;
    isArrivalTime?: boolean;
};
