import type { SetStateAction } from 'react';
import { FiArrowRight } from 'react-icons/fi';

import { DepartureDateAndTimePicker } from '@/features/schedule/components/DepartureDateAndTimePicker';
import { StationSelect } from '@/features/schedule/components/StationSelect';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';
import type { Station } from '@/features/schedule/types/Station';

type ScheduleSearchFormProps = {
    stations: Station[];
    setTime: (time: string) => void;
    setDate: React.Dispatch<SetStateAction<string>>;
    setDepartureStation: React.Dispatch<SetStateAction<string>>;
    setArrivalStation: React.Dispatch<SetStateAction<string>>;
    searchRequestDto: SearchRequestDto;
    getFieldError: (field: string) => string;
};

export function ScheduleSearchForm({
    stations,
    setTime,
    setDate,
    setDepartureStation,
    setArrivalStation,
    searchRequestDto,
    getFieldError,
}: ScheduleSearchFormProps) {
    return (
        <>
            <div className="flex justify-center">
                <div className="flex w-full max-w-5xl flex-col gap-4">
                    <div className="bg-primary-light flex flex-col justify-between gap-4 rounded-2xl p-8">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                            <StationSelect
                                id="departureStation"
                                label="乗車駅"
                                list={stations}
                                value={searchRequestDto.departure_station_cd}
                                setValue={setDepartureStation}
                            />
                            <div className="mt-4 hidden text-xl md:block">
                                <FiArrowRight />
                            </div>
                            <StationSelect
                                id="arrivalStation"
                                label="降車駅"
                                list={stations}
                                value={searchRequestDto.arrival_station_cd}
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
