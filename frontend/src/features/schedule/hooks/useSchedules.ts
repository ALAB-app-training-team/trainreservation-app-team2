import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "../api/route";
import type { SearchRequestDto } from "../types/SearchRequestDto";
import type { SearchResponseDto } from "../types/SearchResponseDto";

export function useSchedules(searchRequestDto: SearchRequestDto) {
    // TODO: バックエンドができたら接続確認する
    const { data } = useSuspenseQuery({
        queryKey: ["schedule"],
        queryFn: async () => {
            console.log(API)
            await new Promise(resolve => setTimeout(resolve, 5000))
            const response = await axios.get<SearchResponseDto[]>(API, {
                params: searchRequestDto,
            });
            return response.data;
        },
    });
    const [schedules, setSchedules] = useState<SearchResponseDto[]>(data);
    // const [schedules, setSchedules] = useState<SearchResponseDto[]>([
    //     {
    //         train_type_name: "はやぶさ1号",
    //         departure_time: "06:32",
    //         arrival_time: "06:39",
    //     },
    //     {
    //         train_type_name: "やまびこ41号",
    //         departure_time: "06:40",
    //         arrival_time: "06:47",
    //     },
    //     {
    //         train_type_name: "やまびこ41号",
    //         departure_time: "06:40",
    //         arrival_time: "06:47",
    //     },
    //     {
    //         train_type_name: "やまびこ41号",
    //         departure_time: "06:40",
    //         arrival_time: "06:47",
    //     },
    //     {
    //         train_type_name: "やまびこ41号",
    //         departure_time: "06:40",
    //         arrival_time: "06:47",
    //     },
    //     {
    //         train_type_name: "やまびこ41号",
    //         departure_time: "06:40",
    //         arrival_time: "06:47",
    //     },
    //     {
    //         train_type_name: "やまびこ41号",
    //         departure_time: "06:40",
    //         arrival_time: "06:47",
    //     },
    //     {
    //         train_type_name: "やまびこ41号",
    //         departure_time: "06:40",
    //         arrival_time: "06:47",
    //     },
    //     {
    //         train_type_name: "やまびこ41号",
    //         departure_time: "06:40",
    //         arrival_time: "06:47",
    //     },
    //     {
    //         train_type_name: "やまびこ41号",
    //         departure_time: "06:40",
    //         arrival_time: "06:47",
    //     },
    //     {
    //         train_type_name: "やまびこ41号",
    //         departure_time: "06:40",
    //         arrival_time: "06:47",
    //     },
    //     {
    //         train_type_name: "やまびこ41号",
    //         departure_time: "06:40",
    //         arrival_time: "06:47",
    //     },
    // ]);

    return { schedules }
}