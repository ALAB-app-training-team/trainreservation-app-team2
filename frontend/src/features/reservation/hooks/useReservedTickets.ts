import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { ENDPOINTS } from "../../../api/routes";
import type { ReservationResponseDto } from "../types/ReservationResponseDto";

export function useReservedTickets(purchaseId: string) {
  const { data: reservedTickets } = useSuspenseQuery({
    queryKey: ["reservedTickets", purchaseId],
    queryFn: async () => {
      const response = await axios.get<ReservationResponseDto>(
        ENDPOINTS.RESERVATION(),
        {
          params: { purchaseId: purchaseId },
        },
      );
      return response.data;
    },
  });

  return { reservedTickets };
}
