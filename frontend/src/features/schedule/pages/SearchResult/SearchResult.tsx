import { Suspense, useState } from "react";
import { ScheduleList } from "../../components/ScheduleList/ScheduleList";
import { ScheduleListSkeleton } from "../../components/ScheduleList/ScheduleListSkeleton";
import type { SearchRequestDto } from "../../types/SearchRequestDto";

export function SearchResult() {
  // TODO: 検索画面ができたら、useLocationで取り出すようにする
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [departureStation, setDepartureStation] = useState<string>("");
  const [arrivalStation, setArrivalStation] = useState<string>("");
  const searchRequestDto: SearchRequestDto = {
    time,
    date,
    departureStation,
    arrivalStation,
  };

  return (
    <>
      <div>こんちゃっちゃー</div>
      {/* <Suspense fallback={<ScheduleListSkeleton />}> */}
      <ScheduleList searchRequestDto={searchRequestDto} />
      {/* </Suspense> */}
    </>
  );
}
