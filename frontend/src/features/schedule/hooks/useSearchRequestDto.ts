import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

import { useSearchRequestValidation } from '@/features/schedule/hooks/useSearchRequestValidation';
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
        initialDto?.time
            ? initialDto.time.slice(0, 5)
            : dayjs().format('HH:mm'),
    );
    const [departureStation, setDepartureStation] = useState<string>(
        initialDto?.departureStationCd || stations[0].stationCd,
    );
    const [arrivalStation, setArrivalStation] = useState<string>(
        initialDto?.arrivalStationCd || stations[1].stationCd,
    );
    const [isArrivalTime, setIsArrivalTime] = useState<boolean>(
        initialDto?.isArrivalTime ?? false,
    );
    const [seatType, setSeatType] = useState<string>(
        initialDto?.seatType ?? '-',
    );
    const [passengers, setPassengers] = useState<string>(
        initialDto?.passengers != null ? String(initialDto.passengers) : '-',
    );
    const [isOnlyAvailable, setIsOnlyAvailable] = useState<boolean>(
        initialDto?.isOnlyAvailable ?? true,
    );
    const isSeatTypeSpecified = seatType !== '-' && seatType !== '';

    const searchRequestDto: SearchRequestDto = useMemo<SearchRequestDto>(() => {
        return {
            date,
            time,
            departureStationCd: departureStation,
            arrivalStationCd: arrivalStation,
            isArrivalTime,
            seatType,
            passengers: passengers === '-' ? null : Number(passengers),
            isOnlyAvailable: isSeatTypeSpecified ? true : isOnlyAvailable,
        };
    }, [
        date,
        time,
        departureStation,
        arrivalStation,
        isArrivalTime,
        seatType,
        passengers,
        isOnlyAvailable,
        isSeatTypeSpecified,
    ]);

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

    const { isInvalid, getFieldError, maxDate, minDate } =
        useSearchRequestValidation(date, departureStation, arrivalStation);

    const handleNextDate = () => {
        setDate((currentDate) =>
            dayjs(currentDate).add(1, 'day').format('YYYY-MM-DD'),
        );
        handleTime('');
        setIsArrivalTime(false);
    };

    return {
        setTime: handleTime,
        setDate,
        setDepartureStation,
        setArrivalStation,
        setIsArrivalTime,
        setSeatType,
        setPassengers,
        isOnlyAvailable,
        setIsOnlyAvailable,
        seatType,
        passengers,
        isSeatTypeSpecified,
        switchDepartureAndArrivalStation,
        searchRequestDto,
        isInvalid,
        getFieldError,
        maxDate,
        minDate,
        handleNextDate,
    };
}
