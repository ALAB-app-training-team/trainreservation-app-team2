import { useSuspenseQuery } from '@tanstack/react-query';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';
import type { SearchResponseDto } from '@/features/schedule/types/SearchResponseDto';

export function useSchedules(
    searchRequestDto: SearchRequestDto,
    isInvalid: boolean,
) {
    const { date, departureStationCd, arrivalStationCd } = searchRequestDto;

    const { data } = useSuspenseQuery<SearchResponseDto>({
        queryKey: ['schedule', date, departureStationCd, arrivalStationCd],
        queryFn: async () => {
            if (isInvalid) {
                return {
                    reservedFare: null,
                    greenFare: null,
                    gcFare: null,
                    schedules: [],
                };
            }
            const response = await apiClient.get<SearchResponseDto>(
                ENDPOINTS.SCHEDULES_SEARCH(),
                {
                    params: { date, departureStationCd, arrivalStationCd },
                },
            );
            return response.data;
        },
    });

    const { schedules, reservedFare, greenFare, gcFare } = data;

    return { schedules, reservedFare, greenFare, gcFare };
}
