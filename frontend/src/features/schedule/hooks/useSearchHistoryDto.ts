import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import type { SearchHistoryDto } from '@/features/schedule/types/SearchHistoryDto';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';

const showHistoryErrorToast = (message: string) => {
    toast.error(message, {
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
};

export function useSearchHistoryDto(searchRequestDto: SearchRequestDto) {
    const info = localStorage.getItem('name');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const queryClient = useQueryClient();

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
            await queryClient.invalidateQueries({
                queryKey: ['searchHistory'],
            });
        } catch {
            showHistoryErrorToast(ERROR_MESSAGE.SAVE_HISTORY_ERROR);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteHistory = async (id: string) => {
        if (!info) {
            return;
        }
        if (isSubmitting) return;
        try {
            setIsSubmitting(true);
            await apiClient.delete(ENDPOINTS.HISTORY(id));
            await queryClient.invalidateQueries({
                queryKey: ['searchHistory'],
            });
        } catch {
            showHistoryErrorToast(ERROR_MESSAGE.DELETE_HISTORY_ERROR);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        searchHistoryDtos,
        handleSaveHistory,
        handleDeleteHistory,
        isSubmitting,
    };
}
