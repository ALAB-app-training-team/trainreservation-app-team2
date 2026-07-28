import { useSuspenseQuery } from '@tanstack/react-query';

import { ENDPOINTS } from '@/api/routes';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';
import type { SearchResponseDto } from '@/features/schedule/types/SearchResponseDto';
import apiClient from '@/shared/apis/apiClient';

export function useSchedules(
    searchRequestDto: SearchRequestDto,
    isInvalid: boolean,
) {
    const { data: schedules } = useSuspenseQuery({
        queryKey: ['schedule', searchRequestDto],
        queryFn: async () => {
            if (isInvalid) {
                return [];
            }
            const response = await apiClient.get<SearchResponseDto[]>(
                ENDPOINTS.SCHEDULES_SEARCH(),
                {
                    params: searchRequestDto,
                },
            );
            return response.data;
        },
    });

    return { schedules };
}
