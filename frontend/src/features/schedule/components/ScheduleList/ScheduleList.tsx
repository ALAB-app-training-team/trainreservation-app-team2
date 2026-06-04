import { useId, useState } from "react";
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
      departure_station_name: "東京",
      departure_time: "06:32",
      arrival_station_name: "上野",
      arrival_time: "06:39",
    },
    {
      train_type_name: "やまびこ41号",
      departure_station_name: "東京",
      departure_time: "06:40",
      arrival_station_name: "上野",
      arrival_time: "06:47",
    },
  ]);

  return (
    <>
      <div className=" flex flex-col gap-4">
        <div className="self-end">
          {schedules.length}件の列車が見つかりました
        </div>
        {schedules.map((suchedule) => {
          const id = useId();
          return <ScheduleItem key={id} suchedule={suchedule} />;
        })}
      </div>
    </>
  );
}
