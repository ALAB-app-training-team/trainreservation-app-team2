import { useSuspenseQuery } from '@tanstack/react-query';

import type { StationResponseDto } from '@/features/schedule/types/StationResponseDto';

const MOCK_STATION_RESPONSE_DTO: StationResponseDto[] = [
    {
        stationCd: 'THK01',
        stationName: '東京駅',
        categories: ['HB', 'YM', 'NS'],
    },
    { stationCd: 'THK02', stationName: '上野駅', categories: ['HB'] },
    { stationCd: 'THK03', stationName: '小山駅', categories: ['HB'] },
    { stationCd: 'CMN01', stationName: '大宮駅', categories: ['NS'] },
];

export function MockStationResponseDto() {
    const { data: stationResponseDtos } = useSuspenseQuery({
        queryKey: ['stationResponseDtos'],
        queryFn: async () => MOCK_STATION_RESPONSE_DTO,
    });

    return { stationResponseDtos };
}
