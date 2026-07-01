import { FiArrowRight } from "react-icons/fi";
import { DepartureDateAndTimePicker } from "./DepartureDateAndTimePicker";
import { StationSelect } from "./StationSelect";
import type { Station } from "../types/Station";
import type { SetStateAction } from "react";
import type { SearchRequestDto } from "../types/SearchRequestDto";

type ScheduleSearchFormProps = {
  stations: Station[];
  setTime: (time: string) => void;
  setDate: React.Dispatch<SetStateAction<string>>;
  setDepartureStation: React.Dispatch<SetStateAction<string>>;
  setArrivalStation: React.Dispatch<SetStateAction<string>>;
  searchRequestDto: SearchRequestDto;
  getFieldError: (field: string) => string;
};

export function ScheduleSearchForm({
  stations,
  setTime,
  setDate,
  setDepartureStation,
  setArrivalStation,
  searchRequestDto,
  getFieldError,
}: ScheduleSearchFormProps) {
  return (
    <>
      <div className="flex justify-center">
        <div className="w-full max-w-5xl flex flex-col gap-4">
          <div className="flex flex-col justify-between bg-primary-light rounded-2xl p-8 gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <StationSelect
                id="departureStation"
                label="乗車駅"
                list={stations}
                value={searchRequestDto.departure_station_cd}
                setValue={setDepartureStation}
              />
              <div className="hidden md:block text-xl mt-4">
                <FiArrowRight />
              </div>
              <StationSelect
                id="arrivalStation"
                label="降車駅"
                list={stations}
                value={searchRequestDto.arrival_station_cd}
                setValue={setArrivalStation}
                getFieldError={getFieldError}
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-4">
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
          </div>
        </div>
      </div>
    </>
  );
}
