import { Suspense, useState } from "react";
import { ScheduleList } from "../../components/ScheduleList/ScheduleList";
import { ScheduleListSkeleton } from "../../components/ScheduleList/ScheduleListSkeleton";
import type { SearchRequestDto } from "../../types/SearchRequestDto";

export function SearchResult() {
  // TODO: 検索画面ができたら、useLocationで取り出すようにする
  const [time, setTime] = useState<string>("12:00");
  const [date, setDate] = useState<string>("2026-02-05");
  const [departureStation, setDepartureStation] = useState<string>("東京");
  const [arrivalStation, setArrivalStation] = useState<string>("上野");
  // const [time, setTime] = useState<string>("");
  // const [date, setDate] = useState<string>("");
  // const [departureStation, setDepartureStation] = useState<string>("");
  // const [arrivalStation, setArrivalStation] = useState<string>("");
  const searchRequestDto: SearchRequestDto = {
    time,
    date,
    departureStation,
    arrivalStation,
  };

  return (
    <>
      <div>
        {departureStation}→{arrivalStation}
      </div>
      <div>
        <label>出発日</label>
        <input type="date"></input>
      </div>
      <div>
        <label>出発時刻</label>
        <input type="time"></input>
      </div>
      {/* <Suspense fallback={<ScheduleListSkeleton />}> */}
      <ScheduleList searchRequestDto={searchRequestDto} />
      {/* </Suspense> */}
    </>
  );
}
