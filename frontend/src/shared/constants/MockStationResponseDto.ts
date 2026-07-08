import { useSuspenseQuery } from '@tanstack/react-query';

import type { StationResponseDto } from '@/features/schedule/types/StationResponseDto'

const MOCK_STATION_RESPONSE_DTO: StationResponseDto[] = [
    {stopStationCd: 'THK0001', stationCd: 'THK01', stopCategory: 'HB'},//東京駅 はやぶさ
    {stopStationCd: 'THK0011', stationCd: 'THK01', stopCategory: 'YM'},//東京駅 やまびこ
    {stopStationCd: 'THK0029', stationCd: 'THK01', stopCategory: 'NS'},//東京駅 なすの
    {stopStationCd: 'AKT0002', stationCd: 'THK02', stopCategory: 'HB'},//上野駅
    {stopStationCd: 'AKT0002', stationCd: 'THK03', stopCategory: 'HB'},//小山駅
    {stopStationCd: 'THK0003', stationCd: 'CMN01', stopCategory: 'NS'},//大宮駅
    {stopStationCd: 'AKT0002', stationCd: 'THK04', stopCategory: 'HB'},//宇都宮駅
    {stopStationCd: 'AKT0002', stationCd: 'THK05', stopCategory: 'HB'},//那須高原駅
    {stopStationCd: 'AKT0002', stationCd: 'THK06', stopCategory: 'HB'},//新白河
    {stopStationCd: 'AKT0002', stationCd: 'THK07', stopCategory: 'HB'},//郡山
    {stopStationCd: 'AKT0002', stationCd: 'THK08', stopCategory: 'HB'},//白石蔵王
    {stopStationCd: 'AKT0002', stationCd: 'THK09', stopCategory: 'HB'},//仙台
    {stopStationCd: 'THK0003', stationCd: 'THK10', stopCategory: 'NS'},//古川
];

export function MockStationResponseDto() {
    const {data: stationResponseDtos} = useSuspenseQuery({
        queryKey: ['stationResponseDtos'],
        queryFn: async() => MOCK_STATION_RESPONSE_DTO
    });

    return { stationResponseDtos };
};
