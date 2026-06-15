import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { ENDPOINTS } from "../../../api/routes";
import type { Station } from "../types/Station";

export function useStations() {
  const { data: stations } = useSuspenseQuery({
    queryKey: ["station"],
    queryFn: async () => {
      const response = await axios.get<Station[]>(ENDPOINTS.STATIONS());
      return response.data;
    },
  });

  return { stations };
}
