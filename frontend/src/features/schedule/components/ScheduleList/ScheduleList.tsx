import { useState } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import _ReactPaginate from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
type PaginateType = React.ComponentType<ReactPaginateProps>;
const ReactPaginate =
  (_ReactPaginate as unknown as { default: PaginateType }).default ||
  (_ReactPaginate as unknown as PaginateType);
import "tailwindcss";
import { useSchedules } from "../../hooks/useSchedules";
import type { SearchRequestDto } from "../../types/SearchRequestDto";
import { ScheduleItem } from "../ScheduleItem";

type ScheduleListProps = {
  searchRequestDto: SearchRequestDto;
  isInvalid: boolean;
  departureStationName: string;
  arrivalStationName: string;
};

export function ScheduleList({
  searchRequestDto,
  isInvalid,
  departureStationName,
  arrivalStationName,
}: ScheduleListProps) {
  const { schedules } = useSchedules(searchRequestDto, isInvalid);

  const [offset, setOffset] = useState(0);
  const perPage: number = 10;
  const handlePageChange = (data: { selected: number }) => {
    window.scrollTo(0, 0);
    const pageNumber = data["selected"];
    setOffset(pageNumber * perPage);
  };

  return (
    <>
      <div className=" flex flex-col gap-4">
        <div className="self-end">
          {schedules.length}件の列車が見つかりました
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
                    departure_station_name={departureStationName}
                    arrival_station_name={arrivalStationName}
                  />
                );
              })}
            <ReactPaginate
              pageCount={Math.ceil(schedules.length / perPage)}
              forcePage={Math.floor(offset / perPage)}
              marginPagesDisplayed={1}
              pageRangeDisplayed={2}
              onPageChange={handlePageChange}
              previousLabel={"前へ"}
              nextLabel={"次へ"}
              containerClassName="flex justify-center space-x-2"
              pageLinkClassName="border-2 border-primary-light rounded-lg px-4 py-2 cursor-pointer"
              activeLinkClassName="bg-primary text-white cursor-not-allowed"
              previousLinkClassName="border-2 border-primary-light rounded-lg px-4 py-2 cursor-pointer"
              nextLinkClassName="border-2 border-primary-light rounded-lg px-4 py-2 cursor-pointer"
              disabledLinkClassName="bg-gray-300 cursor-not-allowed"
            />
          </>
        ) : (
          <div className="flex justify-center items-center h-96 border-2 rounded-2xl border-primary-light p-8">
            <div className="w-full max-w-xs flex flex-col items-center gap-4">
              <div className="w-fit h-fit p-3 bg-primary-light rounded-full text-5xl">
                <AiOutlineExclamationCircle />
              </div>
              <div className="text-xl font-bold">
                指定日時の列車はありません
              </div>
              <div className="text-base">
                お選びいただいた日時以降の列車が見つかりませんでした。条件を変更するか翌日の列車を検索してください。
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
