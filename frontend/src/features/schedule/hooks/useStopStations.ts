import { useSuspenseQuery } from '@tanstack/react-query';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import type { StationResponseDto } from '@/features/schedule/types/StationResponseDto';

export function useStopStations() {
    const { data: stationResponseDtos } = useSuspenseQuery({
        queryKey: ['stationResponseDtos'],
        queryFn: async () => {
            const response = await apiClient.get<StationResponseDto[]>(
                ENDPOINTS.STOPSTATIONS(),
            );
            return response.data;
        },
    });

    return { stationResponseDtos };
}
