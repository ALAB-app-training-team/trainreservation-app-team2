import { use, useId, useState } from "react";
import _ReactPaginate from "react-paginate";
const ReactPaginate = (_ReactPaginate as any).default || _ReactPaginate;
import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import "tailwindcss";
import { API } from "../../api/route";
import type { SearchResponseDto } from "../../types/SearchResponseDto";
import type { SearchRequestDto } from "../../types/SearchRequestDto";
import { ScheduleItem } from "../ScheduleItem/ScheduleItem";

type ScheduleListProps = { searchRequestDto: SearchRequestDto };

export function ScheduleList({ searchRequestDto }: ScheduleListProps) {
  // const { data } = useSuspenseQuery({
  //   queryKey: ["schedule"],
  //   queryFn: async () => {
  //     // await new Promise(resolve => setTimeout(resolve, 5000))
  //     const response = await axios.get<SearchResponseDto[]>(API, {
  //       params: searchRequestDto,
  //     });
  //     return response.data;
  //   },
  // });
  // const [suchedules, setSchedules] = useState<SearchResponseDto[]>(data);
  const [schedules, setSchedules] = useState<SearchResponseDto[]>([
    {
      train_type_name: "はやぶさ1号",
      departure_time: "06:32",
      arrival_time: "06:39",
    },
    {
      train_type_name: "やまびこ41号",
      departure_time: "06:40",
      arrival_time: "06:47",
    },
    {
      train_type_name: "やまびこ41号",
      departure_time: "06:40",
      arrival_time: "06:47",
    },
    {
      train_type_name: "やまびこ41号",
      departure_time: "06:40",
      arrival_time: "06:47",
    },
    {
      train_type_name: "やまびこ41号",
      departure_time: "06:40",
      arrival_time: "06:47",
    },
    {
      train_type_name: "やまびこ41号",
      departure_time: "06:40",
      arrival_time: "06:47",
    },
    {
      train_type_name: "やまびこ41号",
      departure_time: "06:40",
      arrival_time: "06:47",
    },
    {
      train_type_name: "やまびこ41号",
      departure_time: "06:40",
      arrival_time: "06:47",
    },
    {
      train_type_name: "やまびこ41号",
      departure_time: "06:40",
      arrival_time: "06:47",
    },
    {
      train_type_name: "やまびこ41号",
      departure_time: "06:40",
      arrival_time: "06:47",
    },
    {
      train_type_name: "やまびこ41号",
      departure_time: "06:40",
      arrival_time: "06:47",
    },
    {
      train_type_name: "やまびこ41号",
      departure_time: "06:40",
      arrival_time: "06:47",
    },
  ]);

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
