import { Suspense, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';

import { ScheduleList } from '@/features/schedule/components/ScheduleList/ScheduleList';
import { ScheduleListSkeleton } from '@/features/schedule/components/ScheduleList/ScheduleListSkeleton';
import { ScheduleSearchForm } from '@/features/schedule/components/ScheduleSearchForm';
import { useSearchRequestDto } from '@/features/schedule/hooks/useSearchRequestDto';
import { useStations } from '@/features/schedule/hooks/useStations';
import { useStopStations } from '@/features/schedule/hooks/useStopStations';
import type { ScheduleSearchLocationState } from '@/features/schedule/types/SchduleSearchLocationState';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';

export function ScheduleSearchBody() {
    const location = useLocation();
    const navigate = useNavigate();
    const { searchRequestDto: initialDto, isBack = false } =
        (location.state as ScheduleSearchLocationState | null) ?? {};
    const { stations } = useStations();
    const { stationResponseDtos } = useStopStations();
    const {
        setTime,
        setDate,
        setDepartureStation,
        setArrivalStation,
        searchRequestDto,
        isInvalid,
        getFieldError,
        maxDate,
        minDate,
    } = useSearchRequestDto({ stations, initialDto });
    const departureDtos = stationResponseDtos;
    const arrivalDtos = stationResponseDtos;
    const [isOnlyAvailable, setIsOnlyAvailable] = useState<boolean>(true);

    return (
        <>
            <div className="flex justify-center">
                <div className="mx-8 my-4 flex w-full max-w-5xl flex-col gap-4">
                    {isBack && (
                        <button
                            type="button"
                            onClick={() => {
                                navigate('/reservationList');
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <LuArrowLeft />
                                予約一覧へ戻る
                            </div>
                        </button>
                    )}
                    <ScheduleSearchForm
                        stations={stations}
                        departureDtos={departureDtos}
                        arrivalDtos={arrivalDtos}
                        setTime={setTime}
                        setDate={setDate}
                        setDepartureStation={setDepartureStation}
                        setArrivalStation={setArrivalStation}
                        searchRequestDto={searchRequestDto}
                        getFieldError={getFieldError}
                        maxDate={maxDate}
                        minDate={minDate}
                        isOnlyAvailable={isOnlyAvailable}
                        setIsOnlyAvailable={setIsOnlyAvailable}
                    />
                    <Suspense fallback={<ScheduleListSkeleton />}>
                        <ScheduleList
                            key={JSON.stringify(searchRequestDto)}
                            searchRequestDto={searchRequestDto}
                            isInvalid={isInvalid}
                            departureStationCd={
                                searchRequestDto.departureStationCd
                            }
                            departureStationName={
                                stations.find(
                                    (station) =>
                                        station.stationCd ===
                                        searchRequestDto.departureStationCd,
                                )?.name || ERROR_MESSAGE.ERROR
                            }
                            arrivalStationCd={searchRequestDto.arrivalStationCd}
                            arrivalStationName={
                                stations.find(
                                    (station) =>
                                        station.stationCd ===
                                        searchRequestDto.arrivalStationCd,
                                )?.name || ERROR_MESSAGE.ERROR
                            }
                            isOnlyAvailable={isOnlyAvailable}
                        />
                    </Suspense>
                </div>
            </div>
        </>
    );
}
