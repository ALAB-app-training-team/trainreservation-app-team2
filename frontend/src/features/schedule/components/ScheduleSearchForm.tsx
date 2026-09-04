import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { type SetStateAction, useState } from 'react';
import {
    HiOutlineArrowNarrowRight,
    HiOutlineMinusCircle,
    HiOutlinePlus,
    HiOutlinePlusCircle,
    HiOutlineSwitchHorizontal,
    HiOutlineSwitchVertical,
} from 'react-icons/hi';

import { AvailableOnlyFilter } from '@/features/schedule/components/AvailableOnlyFilter';
import { CustomDatePicker } from '@/features/schedule/components/CustomDatePicker';
import { CustomTimePicker } from '@/features/schedule/components/CustomTimePicker';
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

    const [isExpanded, setIsExpanded] = useState(false);

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
                                    className="border-primary w-fit rounded-full border bg-white p-1 text-xl md:mt-8"
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
                            <CustomDatePicker
                                id="date"
                                label="乗車日"
                                value={searchRequestDto.date}
                                setValue={setDate}
                                getFieldError={getFieldError}
                                maxDate={maxDate}
                                minDate={minDate}
                            />
                            <CustomTimePicker
                                id="time"
                                label="時刻"
                                value={searchRequestDto.time}
                                setValue={setTime}
                                getFieldError={getFieldError}
                                children={
                                    <div className="border-primary inline-flex items-center overflow-hidden rounded border">
                                        <label
                                            className={`cursor-pointer p-1 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gray-900 has-[:focus-visible]:ring-inset ${!searchRequestDto.isArrivalTime ? 'bg-primary text-white' : 'bg-gray-50'}`}
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
                                            className={`cursor-pointer p-1 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gray-900 has-[:focus-visible]:outline-none has-[:focus-visible]:ring-inset ${searchRequestDto.isArrivalTime ? 'bg-primary text-white' : 'bg-gray-50'}`}
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
                        <div className="flex flex-col gap-2">
                            <div
                                className={`relative overflow-hidden ${
                                    isExpanded ? 'h-fit' : 'max-h-12'
                                }`}
                            >
                                {/* 検索オプション項目div */}
                                <div
                                    className={`flex flex-col gap-2 ${
                                        !isExpanded && 'opacity-50'
                                    }`}
                                >
                                    <div className="flex w-full flex-col justify-between md:flex-row">
                                        <SeatTypeAndPassengersSelect
                                            seatType={seatType}
                                            passengers={passengers}
                                            onSeatTypeChange={setSeatType}
                                            onPassengersChange={setPassengers}
                                        />
                                    </div>
                                    <div className="flex w-full justify-start">
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
                                                                        key={
                                                                            dto.id
                                                                        }
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
                                                                        className="border-primary hover:bg-primary-light flex w-fit items-center gap-4 rounded-lg border bg-white px-4 py-1 text-left"
                                                                    >
                                                                        <span className="flex items-center gap-2 font-medium">
                                                                            <span>
                                                                                {
                                                                                    departureStationName
                                                                                }
                                                                            </span>
                                                                            <HiOutlineArrowNarrowRight className="text-primary shrink-0" />
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
                                                            disabled={
                                                                isSubmitting
                                                            }
                                                            data-testid="history-save-button"
                                                            className="border-primary hover:bg-primary-light text-primary flex w-fit items-center rounded-lg border bg-white px-2 py-1"
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
                                {/* グラデーションdiv */}
                                {!isExpanded && (
                                    <div className="from-primary-light absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t to-transparent" />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsExpanded((prev) => !prev)}
                                className="text-primary flex items-center gap-1 self-center font-medium"
                            >
                                {isExpanded ? (
                                    <>
                                        <HiOutlineMinusCircle className="text-lg" />
                                        閉じる
                                    </>
                                ) : (
                                    <>
                                        <HiOutlinePlusCircle className="text-lg" />
                                        検索オプションを表示する
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
