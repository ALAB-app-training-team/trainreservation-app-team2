import { useSuspenseQuery } from '@tanstack/react-query';

import type { StationResponseDto } from '@/features/schedule/types/StationResponseDto'

const MOCK_STATION_RESPONSE_DTO: StationResponseDto[] = [
    {stopStationCd: 'THK0001', stationCd: 'THK01', stopCategory: 'HB'},//東京駅 はやぶさ
    {stopStationCd: 'THK0011', stationCd: 'THK01', stopCategory: 'YM'},//東京駅 やまびこ
    {stopStationCd: 'THK0029', stationCd: 'THK01', stopCategory: 'NS'},//東京駅 なすの
    {stopStationCd: 'AKT0002', stationCd: 'THK02', stopCategory: 'KM'},//上野駅 こまち
    {stopStationCd: 'AKT0002', stationCd: 'THK03', stopCategory: 'HB'},//小山駅 こまち
    {stopStationCd: 'THK0003', stationCd: 'CMN01', stopCategory: 'KM'},//大宮駅 こまち
    {stopStationCd: 'AKT0004', stationCd: 'THK09', stopCategory: 'KM'},//仙台駅 こまち
    {stopStationCd: 'AKT0005', stationCd: 'THK10', stopCategory: 'KM'},//古川駅 こまち
    {stopStationCd: 'AKT0006', stationCd: 'THK11', stopCategory: 'KM'}//くりこま高原駅 こまち
];

export function MockStationResponseDto() {
    const {data: stationResponseDtos} = useSuspenseQuery({
        queryKey: ['stationResponseDtos'],
        queryFn: async() => MOCK_STATION_RESPONSE_DTO
    });

    return { stationResponseDtos };
};
