import { useSuspenseQuery } from '@tanstack/react-query';

import { ENDPOINTS } from '@/api/routes';
import type { Station } from '@/features/schedule/types/Station';
import apiClient from '@/shared/apis/apiClient';

export function useStations() {
    const { data: stations } = useSuspenseQuery({
        queryKey: ['station'],
        queryFn: async () => {
            const response = await apiClient.get<Station[]>(
                ENDPOINTS.STATIONS(),
            );
            return response.data;
        },
    });

    return { stations };
}
