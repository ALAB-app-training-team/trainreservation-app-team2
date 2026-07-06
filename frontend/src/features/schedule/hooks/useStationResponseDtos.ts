import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

import { ENDPOINTS } from '@/api/routes';
import type { StationResponseDto } from '../types/StationResponseDto';

export function useStationResponseDtos() {
    const { data: stationResponseDtos } = useSuspenseQuery({
        queryKey: ['stationResponseDtos'],
        queryFn: async () => {
            const response = await axios.get<StationResponseDto[]>(ENDPOINTS.STATIONS());
            return response.data;
        },
    });

    return { stationResponseDtos };
}
