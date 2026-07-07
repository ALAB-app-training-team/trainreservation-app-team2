import { useSuspenseQuery } from '@tanstack/react-query';

import type { StationResponseDto } from '@/features/schedule/types/StationResponseDto'

const MOCK_STATION_RESPONSE_DTO: StationResponseDto[] = [
    {stopStationCd: 'THK0001', stationCd: 'THK01', stopCategory: 'HB'},//東京駅 はやぶさ
    {stopStationCd: 'THK0011', stationCd: 'THK01', stopCategory: 'YM'},//東京駅 やまびこ
    {stopStationCd: 'THK0029', stationCd: 'THK01', stopCategory: 'NS'},//東京駅 なすの
    {stopStationCd: 'AKT0002', stationCd: 'THK02', stopCategory: 'HB'},//上野駅 はやぶさ
    {stopStationCd: 'AKT0002', stationCd: 'THK03', stopCategory: 'HB'},//小山駅 はやぶさ
    {stopStationCd: 'THK0003', stationCd: 'CMN01', stopCategory: 'NS'},//大宮駅 なすの
];

export function MockStationResponseDto() {
    const {data: stationResponseDtos} = useSuspenseQuery({
        queryKey: ['stationResponseDtos'],
        queryFn: async() => MOCK_STATION_RESPONSE_DTO
    });

    return { stationResponseDtos };
};
