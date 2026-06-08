import { useState } from "react";
import type { SearchRequestDto } from "../types/SearchRequestDto";

export function useSearchRequestDto() {
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
    return { time, date, departureStation, arrivalStation, setTime, setDate, searchRequestDto }
}