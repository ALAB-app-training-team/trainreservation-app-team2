import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { ENDPOINTS } from "../../../api/routes";
import type { SeatsRequestDto } from "../types/SeatsRequestDto";
import type { SeatResponseDto } from "../types/SeatResponseDto";

export function useSeatsByTrainCar(seatsRequestDto: SeatsRequestDto) {
  const { data: seats } = useSuspenseQuery({
    queryKey: ["seat", seatsRequestDto],
    queryFn: async () => {
      const response = await axios.get<SeatResponseDto[]>(
        ENDPOINTS.SEATS_SELECT(),
        {
          params: seatsRequestDto,
        },
      );
      return response.data;
    },
  });

  return { seats };
}
