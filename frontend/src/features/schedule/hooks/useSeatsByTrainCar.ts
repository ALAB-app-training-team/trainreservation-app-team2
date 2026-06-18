import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { ENDPOINTS } from "../../../api/routes";
import type { SeatResponseDto } from "../types/SeatResponseDto";

export function useSeatsByTrainCar(trainCarCd: string) {
  const { data: seats } = useSuspenseQuery({
    queryKey: ["seat", trainCarCd],
    queryFn: async () => {
      const response = await axios.get<SeatResponseDto[]>(
        ENDPOINTS.SEATS_SELECT(),
        {
          params: { trainCarCd: trainCarCd },
        },
      );
      return response.data;
    },
  });

  return { seats };
}
