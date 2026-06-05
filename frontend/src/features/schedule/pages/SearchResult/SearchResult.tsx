import { Suspense, useState } from "react";
import "tailwindcss";
import { ScheduleList } from "../../components/ScheduleList/ScheduleList";
import { ScheduleListSkeleton } from "../../components/ScheduleList/ScheduleListSkeleton";
import { DepartureDateAndTimePicker } from "../../components/DepartureDateAndTimePicker/DepartureDateAndTimePicker";
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
    departure_station_name: departureStation,
    arrival_station_name: arrivalStation,
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="w-full max-w-5xl flex flex-col gap-4 my-8">
          <h1 className="text-left !text-3xl !m-0">
            {departureStation}→{arrivalStation}
          </h1>
          <div className="flex flex-col md:flex-row justify-between bg-primary-light rounded-2xl p-8 gap-4">
            <DepartureDateAndTimePicker
              id="date"
              label="出発日"
              type="date"
              value={date}
              setValue={setDate}
            />
            <DepartureDateAndTimePicker
              id="time"
              label="出発時刻"
              type="time"
              value={time}
              setValue={setTime}
            />
          </div>
          {/* <Suspense fallback={<ScheduleListSkeleton />}> */}
          <ScheduleList searchRequestDto={searchRequestDto} />
          {/* </Suspense> */}
        </div>
      </div>
    </>
  );
}
