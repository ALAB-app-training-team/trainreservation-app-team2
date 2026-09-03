import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { SetStateAction } from 'react';
import {
    HiOutlineArrowNarrowRight,
    HiOutlinePlus,
    HiOutlineSwitchHorizontal,
    HiOutlineSwitchVertical,
} from 'react-icons/hi';

import { AvailableOnlyFilter } from '@/features/schedule/components/AvailableOnlyFilter';
import { DepartureDateAndTimePicker } from '@/features/schedule/components/DepartureDateAndTimePicker';
import { SeatTypeAndPassengersSelect } from '@/features/schedule/components/SeatTypeAndPassengersSelect';
import { StationSelect } from '@/features/schedule/components/StationSelect';
import { useSearchHistoryDto } from '@/features/schedule/hooks/useSearchHistoryDto';
import { useStationFilter } from '@/features/schedule/hooks/useStationFilter';
import type { SearchHistoryDto } from '@/features/schedule/types/SearchHistoryDto';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';
import type { Station } from '@/features/schedule/types/Station';
import type { StationResponseDto } from '@/features/schedule/types/StationResponseDto';
import { CustomAccordion } from '@/shared/components/CustomAccordion';

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
    seatType: string;
    passengers: string;
    isSeatTypeSpecified: boolean;
    setSeatType: React.Dispatch<SetStateAction<string>>;
    setPassengers: React.Dispatch<SetStateAction<string>>;
    isOnlyAvailable: boolean;
    setIsOnlyAvailable: (value: boolean) => void;
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
    seatType,
    passengers,
    isSeatTypeSpecified,
    setSeatType,
    setPassengers,
}: ScheduleSearchFormProps) {
    dayjs.extend(customParseFormat);

    const info = localStorage.getItem('name');

    const { availableDepartureStations, availableArrivalStations } =
        useStationFilter(
            stations,
            departureDtos,
            arrivalDtos,
            searchRequestDto.departureStationCd,
            searchRequestDto.arrivalStationCd,
        );
    const isPassengersSpecified = passengers !== '-' && passengers !== '';
    const isFilteeForced = isSeatTypeSpecified || isPassengersSpecified;

    const { searchHistoryDtos, handleSaveHistory, isSubmitting } =
        useSearchHistoryDto(searchRequestDto);

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
                                    className="border-primary-ink bg-surface w-fit rounded-full border p-1 text-xl md:mt-8"
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
                                    <div className="border-primary-ink inline-flex items-center overflow-hidden rounded border">
                                        <label
                                            tabIndex={0}
                                            className={`cursor-pointer p-1 text-sm ${!searchRequestDto.isArrivalTime ? 'bg-primary text-white' : 'bg-surface-subtle'}`}
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
                                                tabIndex={-1}
                                            />
                                            出発
                                        </label>
                                        <label
                                            tabIndex={0}
                                            className={`cursor-pointer p-1 text-sm ${searchRequestDto.isArrivalTime ? 'bg-primary text-white' : 'bg-surface-subtle'}`}
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
                                                tabIndex={-1}
                                            />
                                            到着
                                        </label>
                                    </div>
                                }
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex w-full flex-col justify-between md:flex-row">
                                <SeatTypeAndPassengersSelect
                                    seatType={seatType}
                                    passengers={passengers}
                                    onSeatTypeChange={setSeatType}
                                    onPassengersChange={setPassengers}
                                />
                            </div>
                            <div className="flex flex-col items-start gap-1">
                                <div className="flex w-full justify-start md:w-1/2">
                                    <AvailableOnlyFilter
                                        isChecked={
                                            isFilteeForced
                                                ? true
                                                : isOnlyAvailable
                                        }
                                        isDisabled={isFilteeForced}
                                        onChange={setIsOnlyAvailable}
                                    />
                                </div>
                                {info && (
                                    <div className="flex flex-col gap-4">
                                        <CustomAccordion
                                            title="お気に入り経路"
                                            children={
                                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                                    {searchHistoryDtos.map(
                                                        (
                                                            dto: SearchHistoryDto,
                                                        ) => {
                                                            const departureStationName =
                                                                stations.find(
                                                                    (s) =>
                                                                        s.stationCd ===
                                                                        dto.departureStationCd,
                                                                )?.name;
                                                            const arrivalStationName =
                                                                stations.find(
                                                                    (s) =>
                                                                        s.stationCd ===
                                                                        dto.arrivalStationCd,
                                                                )?.name;

                                                            return (
                                                                <button
                                                                    key={dto.id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setDepartureStation(
                                                                            dto.departureStationCd,
                                                                        );
                                                                        setArrivalStation(
                                                                            dto.arrivalStationCd,
                                                                        );
                                                                        setTime(
                                                                            dayjs(
                                                                                dto.time,
                                                                                'HH:mm:ss',
                                                                            ).format(
                                                                                'HH:mm',
                                                                            ),
                                                                        );
                                                                        setIsArrivalTime(
                                                                            dto.isArrivalTime,
                                                                        );
                                                                    }}
                                                                    className="border-primary-ink hover:bg-primary-light bg-surface flex w-fit items-center gap-4 rounded-lg border px-4 py-1 text-left"
                                                                >
                                                                    <span className="flex items-center gap-2 font-medium">
                                                                        <span>
                                                                            {
                                                                                departureStationName
                                                                            }
                                                                        </span>
                                                                        <HiOutlineArrowNarrowRight className="text-primary-ink shrink-0" />
                                                                        <span>
                                                                            {
                                                                                arrivalStationName
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                    <span className="flex items-center gap-1 text-sm">
                                                                        <span className="bg-primary rounded px-2 py-0.5 text-xs text-white">
                                                                            {dto.isArrivalTime
                                                                                ? '到着'
                                                                                : '出発'}
                                                                        </span>
                                                                        <span>
                                                                            {dayjs(
                                                                                dto.time,
                                                                                'HH:mm:ss',
                                                                            ).format(
                                                                                'HH:mm',
                                                                            )}
                                                                        </span>
                                                                    </span>
                                                                </button>
                                                            );
                                                        },
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleSaveHistory()
                                                        }
                                                        disabled={isSubmitting}
                                                        data-testid="history-save-button"
                                                        className="border-primary-ink hover:bg-primary-light text-primary-ink bg-surface flex w-fit items-center rounded-lg border px-2 py-1"
                                                    >
                                                        <HiOutlinePlus className="text-lg" />
                                                    </button>
                                                    <span className="text-sm">
                                                        ※5件以上の場合、古いものから削除されます
                                                    </span>
                                                </div>
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
