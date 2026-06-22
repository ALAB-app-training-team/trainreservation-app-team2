import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { ENDPOINTS } from "../../../api/routes";
import type { SearchRequestDto } from "../types/SearchRequestDto";
import type { SearchResponseDto } from "../types/SearchResponseDto";

export function useSchedules(searchRequestDto: SearchRequestDto) {
  const { data: schedules } = useSuspenseQuery({
    queryKey: ["schedule", searchRequestDto],
    queryFn: async () => {
      const response = await axios.get<SearchResponseDto[]>(
        ENDPOINTS.SCHEDULES_SEARCH(),
        {
          params: searchRequestDto,
        },
      );
      return response.data;
    },
  });

  return { schedules };
}
