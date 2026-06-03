import { useId, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "../../api/route";
import type { SearchResponseDto } from "../../types/SearchResponseDto";
import type { SearchRequestDto } from "../../types/SearchRequestDto";
import { ScheduleItem } from "../ScheduleItem/ScheduleItem";

type ScheduleListProps = { searchRequestDto: SearchRequestDto };

export function ScheduleList({ searchRequestDto }: ScheduleListProps) {
  const id = useId();

  const { data } = useSuspenseQuery({
    queryKey: ["schedule"],
    queryFn: async () => {
      // await new Promise(resolve => setTimeout(resolve, 5000))
      const response = await axios.get<SearchResponseDto[]>(API, {
        params: searchRequestDto,
      });
      return response.data;
    },
  });
  const [suchedules, setSchedules] = useState<SearchResponseDto[]>(data);

  return (
    <>
      {suchedules.map((suchedule) => {
        <ScheduleItem key={id} suchedule={suchedule} />;
      })}
    </>
  );
}
