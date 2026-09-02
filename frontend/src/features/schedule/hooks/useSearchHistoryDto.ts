import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import type { SearchHistoryDto } from '@/features/schedule/types/SearchHistoryDto';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';

export function useSearchHistoryDto(searchRequestDto: SearchRequestDto) {
    const info = localStorage.getItem('name');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { data: searchHistoryDtos = [] } = useQuery({
        queryKey: ['searchHistory'],
        queryFn: async () => {
            const response = await apiClient.get<SearchHistoryDto[]>(
                ENDPOINTS.HISTORY(),
            );

            return response.data;
        },
        enabled: !!info && !isSubmitting,
    });

    const handleSaveHistory = async () => {
        if (!info) {
            return null;
        }
        if (isSubmitting) return;
        try {
            setIsSubmitting(true);
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
        } catch {
            toast.error(ERROR_MESSAGE.SAVE_HISTORY_ERROR, {
                duration: Infinity,
                action: {
                    label: 'OK',
                    onClick: () => {},
                },
                classNames: {
                    title: 'text-left whitespace-pre-line',
                    actionButton: '!px-4 !py-2 !text-base !h-auto',
                },
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return { searchHistoryDtos, handleSaveHistory, isSubmitting };
}
