import { Suspense, useState } from "react";
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
  const { dto, departure_station_name, arrival_station_name } = location.state;
  const [departureStationName] = useState(departure_station_name);
  const [arrivalStationName] = useState(arrival_station_name);
  const { setTime, setDate, searchRequestDto, isInvalid, getFieldError } =
    useSearchRequestDto({
      condition: dto,
    });

  return (
    <>
      <div className="flex justify-center">
        <div className="w-full max-w-5xl flex flex-col gap-4 mx-8 my-4">
          <div className="flex justify-between">
            <h1 className="text-left !text-3xl !m-0">
              {departureStationName}→{arrivalStationName}
            </h1>
            <button
              onClick={() => {
                navigate("/searchSchedule");
              }}
              className="flex items-center gap-2 px-4 border-2 rounded-xl border-primary-light cursor-pointer"
            >
              <div>ホーム</div>
              <GoHome />
            </button>
          </div>
          <div className="flex flex-col md:flex-row justify-between bg-primary-light rounded-2xl p-8 gap-4">
            <DepartureDateAndTimePicker
              id="date"
              label="出発日"
              type="date"
              value={searchRequestDto.date}
              setValue={setDate}
              getFieldError={getFieldError}
            />
            <DepartureDateAndTimePicker
              id="time"
              label="出発時刻"
              type="time"
              value={searchRequestDto.time}
              setValue={setTime}
              getFieldError={getFieldError}
            />
          </div>
          <Suspense fallback={<ScheduleListSkeleton />}>
            <ScheduleList
              key={JSON.stringify(searchRequestDto)}
              searchRequestDto={searchRequestDto}
              isInvalid={isInvalid}
              departureStationCd={searchRequestDto.departure_station_cd}
              departureStationName={departureStationName}
              arrivalStationCd={searchRequestDto.arrival_station_cd}
              arrivalStationName={arrivalStationName}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}
