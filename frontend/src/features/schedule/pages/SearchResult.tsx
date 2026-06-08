import { Suspense } from "react";
import "tailwindcss";
import { DepartureDateAndTimePicker } from "../components/DepartureDateAndTimePicker";
import { ScheduleList } from "../components/ScheduleList/ScheduleList";
import { ScheduleListSkeleton } from "../components/ScheduleList/ScheduleListSkeleton";
import { useSearchRequestDto } from "../hooks/useSearchRequestDto";

export function SearchResult() {
  // TODO: 検索画面ができたら検索画面で生成する
  const {
    time,
    date,
    departureStation,
    arrivalStation,
    setTime,
    setDate,
    searchRequestDto,
  } = useSearchRequestDto();

  return (
    <>
      <div className="flex justify-center">
        <div className="w-full max-w-5xl flex flex-col gap-4 m-8">
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
          <Suspense fallback={<ScheduleListSkeleton />}>
            <ScheduleList searchRequestDto={searchRequestDto} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
