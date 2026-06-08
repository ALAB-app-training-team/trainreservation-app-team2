import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "../api/route";
import type { SearchRequestDto } from "../types/SearchRequestDto";
import type { SearchResponseDto } from "../types/SearchResponseDto";

export function useSchedules(searchRequestDto: SearchRequestDto) {
    const [schedules, setSchedules] = useState<SearchResponseDto[]>([
        {
            train_type_name: "はやぶさ1号",
            departure_time: "06:32",
            arrival_time: "06:39",
        },
        {
            train_type_name: "やまびこ41号",
            departure_time: "06:40",
            arrival_time: "06:47",
        },
        {
            train_type_name: "やまびこ41号",
            departure_time: "06:40",
            arrival_time: "06:47",
        },
        {
            train_type_name: "やまびこ41号",
            departure_time: "06:40",
            arrival_time: "06:47",
        },
        {
            train_type_name: "やまびこ41号",
            departure_time: "06:40",
            arrival_time: "06:47",
        },
        {
            train_type_name: "やまびこ41号",
            departure_time: "06:40",
            arrival_time: "06:47",
        },
        {
            train_type_name: "やまびこ41号",
            departure_time: "06:40",
            arrival_time: "06:47",
        },
        {
            train_type_name: "やまびこ41号",
            departure_time: "06:40",
            arrival_time: "06:47",
        },
        {
            train_type_name: "やまびこ41号",
            departure_time: "06:40",
            arrival_time: "06:47",
        },
        {
            train_type_name: "やまびこ41号",
            departure_time: "06:40",
            arrival_time: "06:47",
        },
        {
            train_type_name: "やまびこ41号",
            departure_time: "06:40",
            arrival_time: "06:47",
        },
        {
            train_type_name: "やまびこ41号",
            departure_time: "06:40",
            arrival_time: "06:47",
        },
    ]);

    return { schedules }
}
