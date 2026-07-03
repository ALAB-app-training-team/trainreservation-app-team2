import { Suspense } from 'react';

import { ScheduleList } from '@/features/schedule/components/ScheduleList/ScheduleList';
import { ScheduleListSkeleton } from '@/features/schedule/components/ScheduleList/ScheduleListSkeleton';
import { ScheduleSearchForm } from '@/features/schedule/components/ScheduleSearchForm';
import { useSearchRequestDto } from '@/features/schedule/hooks/useSearchRequestDto';
import { useStations } from '@/features/schedule/hooks/useStations';

export function ScheduleSearchBody() {
    const { stations } = useStations();
    const {
        setTime,
        setDate,
        setDepartureStation,
        setArrivalStation,
        searchRequestDto,
        isInvalid,
        getFieldError,
    } = useSearchRequestDto({ stations });

    return (
        <>
            <div className="flex justify-center">
                <div className="mx-8 my-4 flex w-full max-w-5xl flex-col gap-4">
                    <ScheduleSearchForm
                        stations={stations}
                        setTime={setTime}
                        setDate={setDate}
                        setDepartureStation={setDepartureStation}
                        setArrivalStation={setArrivalStation}
                        searchRequestDto={searchRequestDto}
                        getFieldError={getFieldError}
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
