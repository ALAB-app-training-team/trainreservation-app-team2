import type { TrainDirection } from '@/features/schedule/types/TrainDirection';

export type ScheduleDto = {
    scheduleCd: string;
    trainTypeName: string;
    departureTime: string;
    arrivalTime: string;
    reservedSeats: number;
    greenSeats: number;
    gcSeats: number;
    direction: TrainDirection;
};
