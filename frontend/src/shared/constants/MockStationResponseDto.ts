import { useSuspenseQuery } from '@tanstack/react-query';
import type { StationResponseDto } from '@/features/schedule/types/StationResponseDto'

const MOCK_STATION_RESPONSE_DTO: StationResponseDto[] = [
    {stopStationCd: 'THK0001', stationCd: 'THK01', stopCategory: 'HY'},
    {stopStationCd: 'THK0011', stationCd: 'THK01', stopCategory: 'YM'}
];

export function MockStationResponseDto() {
    const {data: stationResponseDto} = useSuspenseQuery({
        queryKey: ['stationResponseDto'],
        queryFn: async() => MOCK_STATION_RESPONSE_DTO
    });

    return { stationResponseDto };
};
