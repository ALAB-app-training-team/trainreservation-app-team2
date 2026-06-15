import { useMemo, useState } from "react";
import type { SearchRequestDto } from "../types/SearchRequestDto";
import type { Station } from "../types/Station";

type useSearchRequestDtoProps = {
  condition?: SearchRequestDto;
  stations?: Station[];
};

export function useSearchRequestDto({
  condition,
  stations = [],
}: useSearchRequestDtoProps = {}) {
  const [date, setDate] = useState<string>(
    condition?.date ?? new Date().toISOString().split("T")[0],
  );
  const [time, setTime] = useState<string>(
    condition?.time ?? new Date().toTimeString().slice(0, 5),
  );
  const [departureStation, setDepartureStation] = useState<string>(
    condition?.departure_station_name ?? stations[0]?.name ?? "",
  );
  const [arrivalStation, setArrivalStation] = useState<string>(
    condition?.arrival_station_name ?? stations[1]?.name ?? "",
  );

  const searchRequestDto: SearchRequestDto = useMemo<SearchRequestDto>(() => {
    return {
      date,
      time,
      departure_station_name: departureStation,
      arrival_station_name: arrivalStation,
    };
  }, [date, time, departureStation, arrivalStation]);

  type InValidMessage = {
    field: "date" | "time" | "arrivalStation";
    message: string;
  };

  const isInvalid: boolean =
    date === "" || time === "" || departureStation === arrivalStation;

  const inValidMessages: InValidMessage[] = useMemo(() => {
    const messages: InValidMessage[] = [];
    if (date === "") {
      messages.push({ field: "date", message: "日付を入力してください" });
    }
    if (time === "") {
      messages.push({ field: "time", message: "時間を入力してください" });
    }
    if (departureStation === arrivalStation) {
      messages.push({
        field: "arrivalStation",
        message: "乗車駅と異なる駅を選択してください。",
      });
    }

    return messages;
  }, [date, time, departureStation, arrivalStation]);

  const getFieldError = (field: string) => {
    return inValidMessages.find((item) => item.field === field)?.message ?? "";
  };

  return {
    setTime,
    setDate,
    setDepartureStation,
    setArrivalStation,
    searchRequestDto,
    isInvalid,
    getFieldError,
  };
}
