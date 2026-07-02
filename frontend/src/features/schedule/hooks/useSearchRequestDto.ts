import { useMemo, useState } from "react";
import type { SearchRequestDto } from "../types/SearchRequestDto";
import type { Station } from "../types/Station";

type useSearchRequestDtoProps = {
  stations: Station[];
};

export function useSearchRequestDto({
  stations = [],
}: useSearchRequestDtoProps) {
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [time, setTime] = useState<string>(
    new Date().toTimeString().slice(0, 5),
  );
  const [departureStation, setDepartureStation] = useState<string>(
    stations[0].station_cd,
  );
  const [arrivalStation, setArrivalStation] = useState<string>(
    stations[1].station_cd,
  );

  const searchRequestDto: SearchRequestDto = useMemo<SearchRequestDto>(() => {
    return {
      date,
      time,
      departure_station_cd: departureStation,
      arrival_station_cd: arrivalStation,
    };
  }, [date, time, departureStation, arrivalStation]);

  const handleTime = (time: string) => {
    if (time === "") {
      setTime("00:00");
    } else {
      setTime(time);
    }
  };

  type InValidMessage = {
    field: "date" | "arrivalStation";
    message: string;
  };

  const isInvalid: boolean = date === "" || departureStation === arrivalStation;

  const inValidMessages: InValidMessage[] = useMemo(() => {
    const messages: InValidMessage[] = [];
    if (date === "") {
      messages.push({ field: "date", message: "日付を入力してください" });
    }
    if (departureStation === arrivalStation) {
      messages.push({
        field: "arrivalStation",
        message: "乗車駅と異なる駅を選択してください。",
      });
    }

    return messages;
  }, [date, departureStation, arrivalStation]);

  const getFieldError = (field: string) => {
    return inValidMessages.find((item) => item.field === field)?.message ?? "";
  };

  return {
    setTime: handleTime,
    setDate,
    setDepartureStation,
    setArrivalStation,
    searchRequestDto,
    isInvalid,
    getFieldError,
  };
}
