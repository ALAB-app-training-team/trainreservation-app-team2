import type { SetStateAction } from 'react';
import { FiArrowRight } from 'react-icons/fi';

import { DepartureDateAndTimePicker } from '@/features/schedule/components/DepartureDateAndTimePicker';
import { StationSelect } from '@/features/schedule/components/StationSelect';
import { useStationFilter } from '@/features/schedule/hooks/useStationFilter';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';
import type { Station } from '@/features/schedule/types/Station';
import type { StationResponseDto } from '@/features/schedule/types/StationResponseDto';

type ScheduleSearchFormProps = {
    stations: Station[];
    departureDtos: StationResponseDto[];
    arrivalDtos: StationResponseDto[];
    setTime: (time: string) => void;
    setDate: React.Dispatch<SetStateAction<string>>;
    setDepartureStation: React.Dispatch<SetStateAction<string>>;
    setArrivalStation: React.Dispatch<SetStateAction<string>>;
    searchRequestDto: SearchRequestDto;
    getFieldError: (field: string) => string;
    maxDate: Date;
    minDate: Date;
};

export function ScheduleSearchForm({
    stations,
    departureDtos,
    arrivalDtos,
    setTime,
    setDate,
    setDepartureStation,
    setArrivalStation,
    searchRequestDto,
    getFieldError,
    maxDate,
    minDate,
}: ScheduleSearchFormProps) {
    const { availableDepartureStations, availableArrivalStations } =
        useStationFilter(
            stations,
            departureDtos,
            arrivalDtos,
            searchRequestDto.departureStationCd,
            searchRequestDto.arrivalStationCd,
        );

    return (
        <>
            <div className="flex justify-center">
                <div className="flex w-full max-w-5xl flex-col gap-4">
                    <div className="bg-primary-light flex flex-col justify-between gap-4 rounded-2xl p-8">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                            <StationSelect
                                id="departureStation"
                                label="乗車駅"
                                list={availableDepartureStations}
                                value={searchRequestDto.departureStationCd}
                                setValue={setDepartureStation}
                            />
                            <div className="mt-4 hidden text-xl md:block">
                                <FiArrowRight />
                            </div>
                            <StationSelect
                                id="arrivalStation"
                                label="降車駅"
                                list={availableArrivalStations}
                                value={searchRequestDto.arrivalStationCd}
                                setValue={setArrivalStation}
                                getFieldError={getFieldError}
                            />
                        </div>
                        <div className="flex flex-col justify-between gap-4 md:flex-row">
                            <DepartureDateAndTimePicker
                                id="date"
                                label="出発日"
                                type="date"
                                value={searchRequestDto.date}
                                setValue={setDate}
                                getFieldError={getFieldError}
                                maxDate={maxDate}
                                minDate={minDate}
                            />
                            <DepartureDateAndTimePicker
                                id="time"
                                label="出発時刻"
                                type="time"
                                value={searchRequestDto.time}
                                setValue={setTime}
                                getFieldError={getFieldError}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
