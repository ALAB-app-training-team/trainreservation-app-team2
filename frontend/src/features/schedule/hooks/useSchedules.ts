import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "../api/route";
import type { SearchRequestDto } from "../types/SearchRequestDto";
import type { SearchResponseDto } from "../types/SearchResponseDto";

export function useSchedules(searchRequestDto: SearchRequestDto) {
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

    return { schedules }
}
