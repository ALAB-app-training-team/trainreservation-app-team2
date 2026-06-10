import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { ENDPOINTS } from "../../../../api/routes";
import { DepartureDateAndTimePicker } from "../DepartureDateAndTimePicker";
import { useSearchRequestDto } from "../../hooks/useSearchRequestDto";
import type { Station } from "../../types/Station";

export function SearchScheduleBody() {
  const {
    setTime,
    setDate,
    setDepartureStation,
    setArrivalStation,
    searchRequestDto,
  } = useSearchRequestDto();

  /*   const { data } = useSuspenseQuery({
    queryKey: ["station"],
    queryFn: async () => {
      const response = await axios.get<Station[]>(ENDPOINTS.STATIONS());
      return response.data;
    },
  });
  const [stations, setStations] = useState<Station[]>(data); */
  const [stations, setStations] = useState<Station[]>([
    { station_cd: "tokyo", name: "東京" },
    { station_cd: "ueno", name: "上野" },
  ]);

  return (
    <>
      <div className="flex justify-center">
        <div className="w-full m-8">
          <div className="flex flex-col justify-between border-2 border-primary-light rounded-2xl p-8 gap-4">
            <h1 className="text-left !text-3xl !m-0">新幹線をさがす</h1>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex flex-col gap-2 w-full items-start">
                <label htmlFor="date">乗車駅</label>
                <select>
                  {stations.map((station) => {
                    return <option value={station.name}>{station.name}</option>;
                  })}
                </select>
              </div>
              <div className="flex flex-col gap-2 w-full items-start">
                <label htmlFor="date">降車駅</label>
                <select>
                  {stations.map((station, index) => {
                    return (
                      <option key={index} value={station.name}>
                        {station.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-4">
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
            <button>列車を検索</button>
            {/* SearchResultにNavigateする（検索条件をstateで渡す） */}
          </div>
        </div>
      </div>
    </>
  );
}
