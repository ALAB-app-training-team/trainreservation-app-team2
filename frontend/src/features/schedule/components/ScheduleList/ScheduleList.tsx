import 'tailwindcss';

import dayjs from 'dayjs';
import { useState } from 'react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { FaArrowTrendUp } from 'react-icons/fa6';
import type { ReactPaginateProps } from 'react-paginate';
import _ReactPaginate from 'react-paginate';

import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
import { EmptySeatCount } from '@/features/schedule/components/EmptySeatCount';
import { ScheduleItem } from '@/features/schedule/components/ScheduleItem';
import { useSchedules } from '@/features/schedule/hooks/useSchedules';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';
import { VALIDATION_MESSAGE } from '@/shared/constants/ValidationMessages';

type PaginateType = React.ComponentType<ReactPaginateProps>;
const ReactPaginate =
    (_ReactPaginate as unknown as { default: PaginateType }).default ||
    (_ReactPaginate as unknown as PaginateType);

type ScheduleListProps = {
    searchRequestDto: SearchRequestDto;
    isInvalid: boolean;
    departureStationCd: string;
    departureStationName: string;
    arrivalStationCd: string;
    arrivalStationName: string;
    isOnlyAvailable: boolean;
    reservationId: string | null;
    reservedSeats: ReservedSeatDto[];
    preChangeScheduleInfo: ScheduleInfoDto | null;
    isChanging: boolean | undefined;
    isBack: boolean | undefined;
    handleNextDate: () => void;
    maxDate: Date;
};

export function ScheduleList({
    searchRequestDto,
    isInvalid,
    departureStationCd,
    departureStationName,
    arrivalStationCd,
    arrivalStationName,
    isOnlyAvailable,
    reservationId,
    reservedSeats,
    preChangeScheduleInfo,
    isChanging,
    isBack,
    handleNextDate,
    maxDate,
}: ScheduleListProps) {
    const { schedules } = useSchedules(searchRequestDto, isInvalid);

    const [offset, setOffset] = useState(0);
    const perPage: number = 10;
    const handlePageChange = (data: { selected: number }) => {
        window.scrollTo(0, 0);
        const pageNumber = data['selected'];
        setOffset(pageNumber * perPage);
    };

    const filteredSchedules = (schedules || [])
        .filter((schedule) => {
            const isTimeValid = searchRequestDto.isArrivalTime
                ? schedule.arrivalTime.slice(0, 5) <=
                  searchRequestDto.time.slice(0, 5)
                : schedule.departureTime.slice(0, 5) >=
                  searchRequestDto.time.slice(0, 5);

            const hasAvailableSeat =
                !isOnlyAvailable ||
                schedule.reservedSeats !== 0 ||
                schedule.greenSeats !== 0 ||
                schedule.gcSeats !== 0;
            return isTimeValid && hasAvailableSeat;
        })
        .sort((a, b) => {
            if (searchRequestDto.isArrivalTime) {
                return b.arrivalTime.localeCompare(a.arrivalTime);
            } else {
                return a.departureTime.localeCompare(b.departureTime);
            }
        });

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap justify-between gap-4">
                    <div>
                        {filteredSchedules.length}件の列車が見つかりました
                    </div>
                    <EmptySeatCount />
                </div>
                {filteredSchedules.length ? (
                    <>
                        {filteredSchedules
                            .slice(offset, offset + perPage)
                            .map((schedule, index) => {
                                return (
                                    <ScheduleItem
                                        key={index}
                                        schedule={schedule}
                                        date={searchRequestDto.date}
                                        departureStationCd={departureStationCd}
                                        departureStationName={
                                            departureStationName
                                        }
                                        arrivalStationCd={arrivalStationCd}
                                        arrivalStationName={arrivalStationName}
                                        searchRequestDto={searchRequestDto}
                                        reservationId={reservationId ?? null}
                                        reservedSeats={reservedSeats ?? []}
                                        preChangeScheduleInfo={
                                            preChangeScheduleInfo ?? null
                                        }
                                        isChanging={isChanging}
                                        isBack={isBack}
                                    />
                                );
                            })}
                        <ReactPaginate
                            pageCount={Math.ceil(
                                filteredSchedules.length / perPage,
                            )}
                            forcePage={Math.floor(offset / perPage)}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={2}
                            onPageChange={handlePageChange}
                            previousLabel={'前へ'}
                            nextLabel={'次へ'}
                            containerClassName="flex justify-center space-x-2"
                            pageLinkClassName="border-2 border-primary-light rounded-lg px-4 py-2 cursor-pointer"
                            activeLinkClassName="bg-primary text-white cursor-not-allowed"
                            previousLinkClassName="border-2 border-primary-light rounded-lg px-4 py-2 cursor-pointer"
                            nextLinkClassName="border-2 border-primary-light rounded-lg px-4 py-2 cursor-pointer"
                            disabledLinkClassName="bg-surface-disabled cursor-not-allowed"
                        />
                    </>
                ) : (
                    <div className="border-primary-light flex h-96 items-center justify-center rounded-2xl border-2 p-8">
                        <div className="flex w-full max-w-xs flex-col items-center gap-4">
                            <div className="bg-primary-light h-fit w-fit rounded-full p-3 text-5xl">
                                <AiOutlineExclamationCircle />
                            </div>
                            <div className="text-xl font-bold">
                                {isInvalid
                                    ? VALIDATION_MESSAGE.INVALID_SEARCH_FORM
                                    : ERROR_MESSAGE.NO_SCHEDULE}
                            </div>
                            <div className="text-base">
                                {isInvalid ? (
                                    VALIDATION_MESSAGE.FIX_SEARCH_FORM
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <div>
                                            {
                                                ERROR_MESSAGE.NO_SPECIFIED_DATETIME_SCHEDULE
                                            }
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleNextDate();
                                                }}
                                                disabled={
                                                    !dayjs(
                                                        searchRequestDto.date,
                                                    ).isBefore(
                                                        dayjs(maxDate),
                                                        'day',
                                                    )
                                                }
                                                className="bg-primary flex w-fit items-center gap-2 rounded-lg px-4 py-2 text-white"
                                            >
                                                <FaArrowTrendUp />
                                                翌日の始発を検索
                                            </button>
                                            {!dayjs(
                                                searchRequestDto.date,
                                            ).isBefore(
                                                dayjs(maxDate),
                                                'day',
                                            ) && (
                                                <div className="text-fg-muted text-sm">
                                                    {
                                                        ERROR_MESSAGE.SEARCH_NEXTDAY_ERROR
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
