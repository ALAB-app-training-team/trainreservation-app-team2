import { useState } from "react";
import _ReactPaginate from "react-paginate";
const ReactPaginate = (_ReactPaginate as any).default || _ReactPaginate;
import "tailwindcss";
import useSchedules from "../../hooks/useSchedules";
import type { SearchRequestDto } from "../../types/SearchRequestDto";
import { ScheduleItem } from "../ScheduleItem/ScheduleItem";

type ScheduleListProps = { searchRequestDto: SearchRequestDto };

export function ScheduleList({ searchRequestDto }: ScheduleListProps) {
  const { schedules } = useSchedules();

  const [offset, setOffset] = useState(0);
  const perPage: number = 10;
  const handlePageChange = (data: { selected: number }) => {
    let pageNumber = data["selected"];
    setOffset(pageNumber * perPage);
  };

  return (
    <>
      <div className=" flex flex-col gap-4">
        <div className="self-end">
          {schedules.length}件の列車が見つかりました
        </div>
        {schedules.slice(offset, offset + perPage).map((schedule, index) => {
          return (
            <ScheduleItem
              key={index}
              schedule={schedule}
              departure_station_name={searchRequestDto.departure_station_name}
              arrival_station_name={searchRequestDto.arrival_station_name}
            />
          );
        })}
        <ReactPaginate
          pageCount={Math.ceil(schedules.length / perPage)}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={handlePageChange}
          previousLabel={"前へ"}
          nextLabel={"次へ"}
          containerClassName="flex justify-center space-x-2"
          pageLinkClassName="border-2 border-primary-transparent rounded-lg px-4 py-2 cursor-pointer"
          activeLinkClassName="bg-primary text-white cursor-not-allowed"
          previousLinkClassName="border-2 border-primary-transparent rounded-lg px-4 py-2 cursor-pointer"
          nextLinkClassName="border-2 border-primary-transparent rounded-lg px-4 py-2 cursor-pointer"
          disabledLinkClassName="bg-gray-300 cursor-not-allowed"
        />
      </div>
    </>
  );
}
