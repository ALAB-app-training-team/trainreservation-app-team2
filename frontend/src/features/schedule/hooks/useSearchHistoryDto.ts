import { useQuery } from '@tanstack/react-query';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import type { SearchHistoryDto } from '@/features/schedule/types/SearchHistoryDto';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';

export function useSearchHistoryDto(searchRequestDto: SearchRequestDto) {
    const info = localStorage.getItem('name');

    const { data: searchHistoryDtos = [] } = useQuery({
        // TODO: queryKeyを検討する
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
        enabled: !!info,
    });

    const handleSaveHistory = async () => {
        if (!info) {
            return null;
        }
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
