import type { TrainDirection } from '@/features/schedule/types/TrainDirection';

export type ScheduleInfoDto = {
    scheduleCd: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
    trainTypeName: string;
    departureStationCd: string;
    arrivalStationCd: string;
    departureStationName: string;
    arrivalStationName: string;
    direction: TrainDirection;
};
