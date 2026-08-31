import { useSuspenseQuery } from '@tanstack/react-query';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import type { SearchHistoryDto } from '@/features/schedule/types/SearchHistoryDto';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';

export function useSearchHistoryDto(searchRequestDto: SearchRequestDto) {
    const info = localStorage.getItem('name');

    if (!info) {
        return;
    }

    const { data: searchHistoryDtos } = useSuspenseQuery({
        queryKey: ['searchHistory', searchRequestDto],
        queryFn: async () => {
            const response = await apiClient.get<SearchHistoryDto[]>(
                ENDPOINTS.HISTORY(),
                {
                    params: searchRequestDto,
                },
            );
            return response.data;
        },
    });

    const handleSaveHistory = async () => {
        const searchHistoryDto: SearchHistoryDto = {
            id: '',
            date: searchRequestDto.date,
            time: searchRequestDto.time,
            departureStationCd: searchRequestDto.departureStationCd,
            arrivalStationCd: searchRequestDto.arrivalStationCd,
            isArrivalTime: searchRequestDto.isArrivalTime,
            createdAt: '',
        };
        await apiClient.post(ENDPOINTS.HISTORY(), searchHistoryDto);
        return;
    };

    return { searchHistoryDtos, handleSaveHistory };
}
