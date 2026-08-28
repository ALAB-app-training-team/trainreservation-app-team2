import { Suspense } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';

import {
    RESERVEDTICKET_MODE,
    RESERVEDTICKET_ROLE,
} from '@/features/reservation/constants/ReservedTicketState';
import { ScheduleList } from '@/features/schedule/components/ScheduleList/ScheduleList';
import { ScheduleListSkeleton } from '@/features/schedule/components/ScheduleList/ScheduleListSkeleton';
import { ScheduleSearchForm } from '@/features/schedule/components/ScheduleSearchForm';
import { useSearchRequestDto } from '@/features/schedule/hooks/useSearchRequestDto';
import { useStations } from '@/features/schedule/hooks/useStations';
import { useStopStations } from '@/features/schedule/hooks/useStopStations';
import type { ScheduleSearchLocationState } from '@/features/schedule/types/ScheduleSearchLocationState';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';

export function ScheduleSearchBody() {
    const location = useLocation();
    const navigate = useNavigate();
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
                <div className="mx-8 my-4 flex w-full max-w-5xl flex-col gap-4">
                    {isBack ? (
                        <button
                            data-testid={'back-button-in-scheduleSearch'}
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
                    ) : isFromReservedTicket || isChanging ? (
                        <button
                            data-testid={'back-button-in-scheduleSearch'}
                            type="button"
                            onClick={() => {
                                navigate('/reservedTicket', {
                                    state: {
                                        reservationId: reservationId,
                                        mode: RESERVEDTICKET_MODE.detail,
                                        role: RESERVEDTICKET_ROLE.account,
                                    },
                                });
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <LuArrowLeft />
                                予約詳細へ戻る
                            </div>
                        </button>
                    ) : null}
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
