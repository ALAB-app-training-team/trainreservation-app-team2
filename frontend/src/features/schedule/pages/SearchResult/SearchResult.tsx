import { Suspense, useState } from "react";
import "tailwindcss";
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
      <div className="flex justify-center">
        <div className="w-full max-w-7xl flex flex-col gap-4">
          <h1 className="text-left">
            {departureStation}→{arrivalStation}
          </h1>
          <div className="flex justify-between bg-primary-light rounded-2xl p-8 gap-4">
            <div className="flex flex-col w-1/2 items-start">
              <label htmlFor="date">出発日</label>
              <input
                id="date"
                type="date"
                className="w-full bg-white"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              ></input>
            </div>
            <div className="flex flex-col w-1/2 items-start">
              <label htmlFor="time">出発時刻</label>
              <input
                id="time"
                type="time"
                className="w-full bg-white"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              ></input>
            </div>
          </div>
          {/* <Suspense fallback={<ScheduleListSkeleton />}> */}
          <ScheduleList searchRequestDto={searchRequestDto} />
          {/* </Suspense> */}
        </div>
      </div>
    </>
  );
}
