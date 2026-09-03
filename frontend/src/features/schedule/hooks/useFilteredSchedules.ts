import { useMemo } from 'react';

import type { SearchResponseDto } from '@/features/schedule/types/SearchResponseDto';

type UseFilteredSchedulesParams = {
    schedules: SearchResponseDto[];
    seatType: string;
    passengers: string;
    isOnlyAvailable: boolean;
};

const isValueSpecified = (value: string): boolean =>
    value !== '-' && value !== '';

export function useFilteredSchedules({
    schedules,
    seatType,
    passengers,
    isOnlyAvailable,
}: UseFilteredSchedulesParams) {
    const filteredSchedules = useMemo(() => {
        const isSeatTypeSpecified = isValueSpecified(seatType);
        const isPassengersSpecified = isValueSpecified(passengers);
        const requiredSeats = isPassengersSpecified ? Number(passengers) : 1;

        return schedules.filter((schedule) => {
            const { reservedSeats, greenSeats, gcSeats } = schedule;

            if (isSeatTypeSpecified) {
                switch (seatType) {
                    case '指定席':
                        return reservedSeats >= requiredSeats;
                    case 'グリーン車':
                        return greenSeats >= requiredSeats;
                    case 'グランクラス':
                        return gcSeats >= requiredSeats;
                    default:
                        return false;
                }
            }

            if (isPassengersSpecified) {
                return reservedSeats + greenSeats + gcSeats >= requiredSeats;
            }

            if (isOnlyAvailable) {
                return reservedSeats > 0 || greenSeats > 0 || gcSeats > 0;
            }

            return true;
        });
    }, [schedules, seatType, passengers, isOnlyAvailable]);

    return { filteredSchedules };
}
