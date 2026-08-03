import 'tailwindcss';

import { useState } from 'react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import type { ReactPaginateProps } from 'react-paginate';
import _ReactPaginate from 'react-paginate';

import { EmptySeatCount } from '@/features/schedule/components/EmptySeatCount';
import { ScheduleItem } from '@/features/schedule/components/ScheduleItem';
import { useSchedules } from '@/features/schedule/hooks/useSchedules';
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
};

export function ScheduleList({
    searchRequestDto,
    isInvalid,
    departureStationCd,
    departureStationName,
    arrivalStationCd,
    arrivalStationName,
}: ScheduleListProps) {
    const { schedules } = useSchedules(searchRequestDto, isInvalid);

    const [offset, setOffset] = useState(0);
    const perPage: number = 10;
    const handlePageChange = (data: { selected: number }) => {
        window.scrollTo(0, 0);
        const pageNumber = data['selected'];
        setOffset(pageNumber * perPage);
    };

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap justify-between gap-4">
                    <div>{schedules.length}件の列車が見つかりました</div>
                    <EmptySeatCount />
                </div>
                {schedules.length ? (
                    <>
                        {schedules
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
                                    />
                                );
                            })}
                        <ReactPaginate
                            pageCount={Math.ceil(schedules.length / perPage)}
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
                            disabledLinkClassName="bg-gray-300 cursor-not-allowed"
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
                                {isInvalid
                                    ? VALIDATION_MESSAGE.FIX_SEARCH_FORM
                                    : ERROR_MESSAGE.NO_SPECIFIED_DATETIME_SCHEDULE}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
