import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "../../api/route";
import type { SearchResultDto } from "../../types/SearchResultDto";

type ScheduleListProps = {
  time: string;
  date: string;
  departureStation: string;
  arrivalStation: string;
};
export function ScheduleList({
  time,
  date,
  departureStation,
  arrivalStation,
}: ScheduleListProps) {
  const { data } = useSuspenseQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      // await new Promise(resolve => setTimeout(resolve, 5000))
      const response = await axios.get<SearchResultDto>(API);
      return response.data;
    },
  });

  return (
    <>
      <div>{time}</div>
      <div>{date}</div>
      <div>{departureStation}</div>
      <div>{arrivalStation}</div>
    </>
  );
}
