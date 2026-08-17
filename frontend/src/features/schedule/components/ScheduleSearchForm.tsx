import type { SetStateAction } from 'react';
import {
    HiOutlineSwitchHorizontal,
    HiOutlineSwitchVertical,
} from 'react-icons/hi';

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
    setIsArrivalTime: React.Dispatch<SetStateAction<boolean>>;
    switchDepartureAndArrivalStation: () => void;
    searchRequestDto: SearchRequestDto;
    getFieldError: (field: string) => string;
    maxDate: Date;
    minDate: Date;
    isOnlyAvailable: boolean;
    setIsOnlyAvailable: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ScheduleSearchForm({
    stations,
    departureDtos,
    arrivalDtos,
    setTime,
    setDate,
    setDepartureStation,
    setArrivalStation,
    setIsArrivalTime,
    switchDepartureAndArrivalStation,
    searchRequestDto,
    getFieldError,
    maxDate,
    minDate,
    isOnlyAvailable,
    setIsOnlyAvailable,
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
                            <div className="w-full text-center md:w-fit">
                                <button
                                    onClick={switchDepartureAndArrivalStation}
                                    className="w-fit rounded-full border-1 bg-white p-1 text-xl md:mt-8"
                                >
                                    <HiOutlineSwitchHorizontal className="hidden md:block" />
                                    <HiOutlineSwitchVertical className="block md:hidden" />
                                </button>
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
                                label="乗車日"
                                type="date"
                                value={searchRequestDto.date}
                                setValue={setDate}
                                getFieldError={getFieldError}
                                maxDate={maxDate}
                                minDate={minDate}
                            />
                            <DepartureDateAndTimePicker
                                id="time"
                                label="時刻"
                                type="time"
                                value={searchRequestDto.time}
                                setValue={setTime}
                                getFieldError={getFieldError}
                                children={
                                    <div className="border-primary inline-flex items-center overflow-hidden rounded border">
                                        <label
                                            className={`cursor-pointer p-1 text-sm ${!searchRequestDto.isArrivalTime ? 'bg-primary text-white' : 'bg-gray-50'}`}
                                        >
                                            <input
                                                type="radio"
                                                checked={
                                                    !searchRequestDto.isArrivalTime
                                                }
                                                onChange={() =>
                                                    setIsArrivalTime(false)
                                                }
                                                className="sr-only"
                                            />
                                            出発
                                        </label>
                                        <label
                                            className={`cursor-pointer p-1 text-sm ${searchRequestDto.isArrivalTime ? 'bg-primary text-white' : 'bg-gray-50'}`}
                                        >
                                            <input
                                                type="radio"
                                                checked={
                                                    searchRequestDto.isArrivalTime
                                                }
                                                onChange={() =>
                                                    setIsArrivalTime(true)
                                                }
                                                className="sr-only"
                                            />
                                            到着
                                        </label>
                                    </div>
                                }
                            />
                        </div>
                        <div className="flex gap-2 bg-transparent text-left">
                            <input
                                type="checkbox"
                                id="isOnlyAvailable"
                                checked={isOnlyAvailable}
                                onChange={(e) =>
                                    setIsOnlyAvailable(e.target.checked)
                                }
                                className="accent-primary"
                            />
                            <label htmlFor="isOnlyAvailable">
                                空席がある列車のみ表示する
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
