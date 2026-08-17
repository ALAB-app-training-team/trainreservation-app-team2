import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';
import type { Station } from '@/features/schedule/types/Station';
import { VALIDATION_MESSAGE } from '@/shared/constants/ValidationMessages';

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
    const [isArrival, setIsArrival] = useState<boolean>(false);

    const searchRequestDto: SearchRequestDto = useMemo<SearchRequestDto>(() => {
        return {
            date,
            time,
            departureStationCd: departureStation,
            arrivalStationCd: arrivalStation,
            isArrivalTime: isArrival,
        };
    }, [date, time, departureStation, arrivalStation, isArrival]);

    const handleTime = (time: string) => {
        if (time === '') {
            setTime('00:00');
        } else {
            setTime(time);
        }
    };

    const switchDepartureAndArrivalStation = () => {
        const currentDepartureStation = departureStation;
        setDepartureStation(arrivalStation);
        setArrivalStation(currentDepartureStation);
    };

    type InvalidMessage = {
        field: 'date' | 'arrivalStation';
        message: string;
    };

    const maxDate = dayjs().add(1, 'month').endOf(`day`).toDate();
    const minDate = dayjs().startOf(`day`).toDate();

    const isDateEmpty: boolean = date === '';
    const isDateOutsideOneMonth: boolean =
        new Date(date) < minDate || new Date(date) > maxDate;
    const isStationSame: boolean = departureStation === arrivalStation;

    const isInvalid: boolean =
        isDateEmpty || isDateOutsideOneMonth || isStationSame;

    const invalidMessages: InvalidMessage[] = useMemo(() => {
        const messages: InvalidMessage[] = [];
        if (isDateEmpty) {
            messages.push({
                field: 'date',
                message: VALIDATION_MESSAGE.EMPTY_DATE,
            });
        }
        if (isDateOutsideOneMonth) {
            messages.push({
                field: 'date',
                message: VALIDATION_MESSAGE.OUTSIDE_ONE_MONTH,
            });
        }
        if (isStationSame) {
            messages.push({
                field: 'arrivalStation',
                message: VALIDATION_MESSAGE.SAME_STATION,
            });
        }

        return messages;
    }, [date, departureStation, arrivalStation]);

    const getFieldError = (field: string) => {
        return (
            invalidMessages.find((item) => item.field === field)?.message ?? ''
        );
    };

    return {
        setTime: handleTime,
        setDate,
        setDepartureStation,
        setArrivalStation,
        setIsArrival,
        switchDepartureAndArrivalStation,
        searchRequestDto,
        isInvalid,
        getFieldError,
        maxDate,
        minDate,
    };
}
