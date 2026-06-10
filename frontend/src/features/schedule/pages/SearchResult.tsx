import { Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoHome } from "react-icons/go";
import "tailwindcss";
import { DepartureDateAndTimePicker } from "../components/DepartureDateAndTimePicker";
import { ScheduleList } from "../components/ScheduleList/ScheduleList";
import { ScheduleListSkeleton } from "../components/ScheduleList/ScheduleListSkeleton";
import { useSearchRequestDto } from "../hooks/useSearchRequestDto";

export function SearchResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const condition = location.state;
  const { setTime, setDate, searchRequestDto } = useSearchRequestDto({
    condition,
  });

  return (
    <>
      <div className="flex justify-center">
        <div className="w-full max-w-5xl flex flex-col gap-4 m-8">
          <div className="flex justify-between">
            <h1 className="text-left !text-3xl !m-0">
              {searchRequestDto.departure_station_name}→
              {searchRequestDto.arrival_station_name}
            </h1>
            <button
              onClick={() => {
                navigate("/searchSchedule");
              }}
              className="flex items-center gap-2 px-4 border-2 rounded-xl border-primary-light cursor-pointer"
            >
              <GoHome />
              <div>ホーム</div>
            </button>
          </div>
          <div className="flex flex-col md:flex-row justify-between bg-primary-light rounded-2xl p-8 gap-4">
            <DepartureDateAndTimePicker
              id="date"
              label="出発日"
              type="date"
              value={searchRequestDto.date}
              setValue={setDate}
            />
            <DepartureDateAndTimePicker
              id="time"
              label="出発時刻"
              type="time"
              value={searchRequestDto.time}
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
