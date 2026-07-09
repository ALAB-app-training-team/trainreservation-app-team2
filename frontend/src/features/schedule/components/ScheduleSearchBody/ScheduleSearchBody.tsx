import { Suspense } from 'react';
import { useLocation } from 'react-router-dom';

import { ScheduleList } from '@/features/schedule/components/ScheduleList/ScheduleList';
import { ScheduleListSkeleton } from '@/features/schedule/components/ScheduleList/ScheduleListSkeleton';
import { ScheduleSearchForm } from '@/features/schedule/components/ScheduleSearchForm';
import { useSearchRequestDto } from '@/features/schedule/hooks/useSearchRequestDto';
import { useStations } from '@/features/schedule/hooks/useStations';
import { useStopStations } from '@/features/schedule/hooks/useStopStations';

export function ScheduleSearchBody() {
    const location = useLocation();
    const initialDto = location.state?.searchRequestDto;
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

    return (
        <>
            <div className="flex justify-center">
                <div className="mx-8 my-4 flex w-full max-w-5xl flex-col gap-4">
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
                                )?.name || 'エラー'
                            }
                            arrivalStationCd={searchRequestDto.arrivalStationCd}
                            arrivalStationName={
                                stations.find(
                                    (station) =>
                                        station.stationCd ===
                                        searchRequestDto.arrivalStationCd,
                                )?.name || 'エラー'
                            }
                        />
                    </Suspense>
                </div>
            </div>
        </>
    );
}
