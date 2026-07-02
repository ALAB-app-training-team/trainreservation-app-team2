import 'tailwindcss';

import { Suspense, useState } from 'react';
import { GoHome } from 'react-icons/go';
import { useLocation, useNavigate } from 'react-router-dom';

import { DepartureDateAndTimePicker } from '@/features/schedule/components/DepartureDateAndTimePicker';
import { ScheduleList } from '@/features/schedule/components/ScheduleList/ScheduleList';
import { ScheduleListSkeleton } from '@/features/schedule/components/ScheduleList/ScheduleListSkeleton';
import { useSearchRequestDto } from '@/features/schedule/hooks/useSearchRequestDto';

export function SearchResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const { dto, departure_station_name, arrival_station_name } =
        location.state;
    const [departureStationName] = useState(departure_station_name);
    const [arrivalStationName] = useState(arrival_station_name);
    const { setTime, setDate, searchRequestDto, isInvalid, getFieldError } =
        useSearchRequestDto({
            condition: dto,
        });

    return (
        <>
            <div className="flex justify-center">
                <div className="mx-8 my-4 flex w-full max-w-5xl flex-col gap-4">
                    <div className="flex justify-between">
                        <h1 className="!m-0 text-left !text-3xl">
                            {departureStationName}→{arrivalStationName}
                        </h1>
                        <button
                            onClick={() => {
                                navigate('/searchSchedule');
                            }}
                            className="border-primary-light flex items-center gap-2 rounded-xl border-2 px-4"
                        >
                            <div>ホーム</div>
                            <GoHome />
                        </button>
                    </div>
                    <div className="bg-primary-light flex flex-col justify-between gap-4 rounded-2xl p-8 md:flex-row">
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
                    <Suspense fallback={<ScheduleListSkeleton />}>
                        <ScheduleList
                            key={JSON.stringify(searchRequestDto)}
                            searchRequestDto={searchRequestDto}
                            isInvalid={isInvalid}
                            departureStationCd={
                                searchRequestDto.departure_station_cd
                            }
                            departureStationName={departureStationName}
                            arrivalStationCd={
                                searchRequestDto.arrival_station_cd
                            }
                            arrivalStationName={arrivalStationName}
                        />
                    </Suspense>
                </div>
            </div>
        </>
    );
}
