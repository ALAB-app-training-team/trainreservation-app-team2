import { Suspense } from 'react';
import { useLocation } from 'react-router-dom';

import { ScheduleList } from '@/features/schedule/components/ScheduleList/ScheduleList';
import { ScheduleListSkeleton } from '@/features/schedule/components/ScheduleList/ScheduleListSkeleton';
import { ScheduleSearchForm } from '@/features/schedule/components/ScheduleSearchForm';
import { ScheduleSearchHeader } from '@/features/schedule/components/ScheduleSearchHeader';
import { useSearchRequestDto } from '@/features/schedule/hooks/useSearchRequestDto';
import { useStations } from '@/features/schedule/hooks/useStations';
import { useStopStations } from '@/features/schedule/hooks/useStopStations';
import type { ScheduleSearchLocationState } from '@/features/schedule/types/ScheduleSearchLocationState';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';

export function ScheduleSearchBody() {
    const location = useLocation();
    const {
        searchRequestDto: initialDto,
        isBack = false,
        reservationId,
        isChanging,
        isFromReservedTicket,
        reservedSeats,
        preChangeScheduleInfo,
    } = (location.state as ScheduleSearchLocationState | null) ?? {};
    const { stations } = useStations();
    const { stationResponseDtos } = useStopStations();
    const {
        setTime,
        setDate,
        setDepartureStation,
        setArrivalStation,
        setIsArrivalTime,
        switchDepartureAndArrivalStation,
        searchRequestDto,
        isInvalid,
        getFieldError,
        maxDate,
        minDate,
        handleNextDate,
        seatType,
        passengers,
        isSeatTypeSpecified,
        setSeatType,
        setPassengers,
        isOnlyAvailable,
        setIsOnlyAvailable,
    } = useSearchRequestDto({ stations, initialDto });
    const departureDtos = stationResponseDtos;
    const arrivalDtos = stationResponseDtos;

    return (
        <>
            <div className="flex justify-center">
                <div className="mx-4 my-2 flex w-full max-w-5xl flex-col gap-2 md:mx-8 md:my-4 md:gap-4">
                    <ScheduleSearchHeader
                        isBack={isBack}
                        isChanging={isChanging}
                        isFromReservedTicket={isFromReservedTicket}
                        reservationId={reservationId}
                    />
                    <ScheduleSearchForm
                        stations={stations}
                        departureDtos={departureDtos}
                        arrivalDtos={arrivalDtos}
                        setTime={setTime}
                        setDate={setDate}
                        setDepartureStation={setDepartureStation}
                        setArrivalStation={setArrivalStation}
                        setIsArrivalTime={setIsArrivalTime}
                        switchDepartureAndArrivalStation={
                            switchDepartureAndArrivalStation
                        }
                        searchRequestDto={searchRequestDto}
                        getFieldError={getFieldError}
                        maxDate={maxDate}
                        minDate={minDate}
                        isOnlyAvailable={isOnlyAvailable}
                        setIsOnlyAvailable={setIsOnlyAvailable}
                        seatType={seatType}
                        passengers={passengers}
                        isSeatTypeSpecified={isSeatTypeSpecified}
                        setSeatType={setSeatType}
                        setPassengers={setPassengers}
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
                            seatType={seatType}
                            passengers={passengers}
                            isOnlyAvailable={isOnlyAvailable}
                            reservationId={reservationId ?? null}
                            reservedSeats={reservedSeats ?? []}
                            preChangeScheduleInfo={
                                preChangeScheduleInfo ?? null
                            }
                            isChanging={isChanging}
                            isBack={isBack}
                            handleNextDate={handleNextDate}
                            maxDate={maxDate}
                        />
                    </Suspense>
                </div>
            </div>
        </>
    );
}
