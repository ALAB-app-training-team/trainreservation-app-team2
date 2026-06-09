import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "../api/route";
import type { SearchRequestDto } from "../types/SearchRequestDto";
import type { SearchResponseDto } from "../types/SearchResponseDto";

export function useSchedules(searchRequestDto: SearchRequestDto) {
  const { data: schedules } = useSuspenseQuery({
    queryKey: ["schedule", searchRequestDto],
    queryFn: async () => {
      const response = await axios.get<SearchResponseDto[]>(API, {
        params: searchRequestDto,
      });
      return response.data;
    },
  });

  return { schedules };
}
