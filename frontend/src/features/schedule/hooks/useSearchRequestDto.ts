import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';
import type { Station } from '@/features/schedule/types/Station';

type useSearchRequestDtoProps = {
    stations: Station[];
    initialDto?: SearchRequestDto;
};

export function useSearchRequestDto({
    stations = [],
    initialDto,
}: useSearchRequestDtoProps) {
    const [date, setDate] = useState<string>(
        initialDto?.date || dayjs().format('YYYY-MM-DD'),
    );
    const [time, setTime] = useState<string>(
        initialDto?.time || dayjs().format('HH:mm'),
    );
    const [departureStation, setDepartureStation] = useState<string>(
        initialDto?.departureStationCd || stations[0].stationCd,
    );
    const [arrivalStation, setArrivalStation] = useState<string>(
        initialDto?.arrivalStationCd || stations[1].stationCd,
    );

    const searchRequestDto: SearchRequestDto = useMemo<SearchRequestDto>(() => {
        return {
            date,
            time,
            departureStationCd: departureStation,
            arrivalStationCd: arrivalStation,
        };
    }, [date, time, departureStation, arrivalStation]);

    const handleTime = (time: string) => {
        if (time === '') {
            setTime('00:00');
        } else {
            setTime(time);
        }
    };

    type InValidMessage = {
        field: 'date' | 'arrivalStation';
        message: string;
    };

    const maxDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate(),
    );
    const minDate = new Date();
    minDate.setHours(0, 0, 0, 0);

    const isDateEmpty: boolean = date === '';
    const isDateOutsideOneMonth: boolean =
        new Date(date) < minDate || new Date(date) > maxDate;
    const isStationSame: boolean = departureStation === arrivalStation;

    const isInvalid: boolean =
        isDateEmpty || isDateOutsideOneMonth || isStationSame;

    const inValidMessages: InValidMessage[] = useMemo(() => {
        const messages: InValidMessage[] = [];
        if (isDateEmpty) {
            messages.push({ field: 'date', message: '日付を入力してください' });
        }
        if (isDateOutsideOneMonth) {
            messages.push({
                field: 'date',
                message: '出発日は本日から1か月以内の日付を指定してください',
            });
        }
        if (isStationSame) {
            messages.push({
                field: 'arrivalStation',
                message: '乗車駅と異なる駅を選択してください。',
            });
        }

        return messages;
    }, [date, departureStation, arrivalStation]);

    const getFieldError = (field: string) => {
        return (
            inValidMessages.find((item) => item.field === field)?.message ?? ''
        );
    };

    return {
        setTime: handleTime,
        setDate,
        setDepartureStation,
        setArrivalStation,
        searchRequestDto,
        isInvalid,
        getFieldError,
        maxDate,
        minDate,
    };
}
