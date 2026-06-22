import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { ENDPOINTS } from "../../../api/routes";
import type { SearchRequestDto } from "../types/SearchRequestDto";
import type { SearchResponseDto } from "../types/SearchResponseDto";

export function useSchedules(
  searchRequestDto: SearchRequestDto,
  isInvalid: boolean,
) {
  const { data: schedules } = useSuspenseQuery({
    queryKey: ["schedule", searchRequestDto],
    queryFn: async () => {
      if (isInvalid) {
        return [];
      }
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
