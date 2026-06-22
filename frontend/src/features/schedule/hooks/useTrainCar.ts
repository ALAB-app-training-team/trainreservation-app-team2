import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import type { TrainCarFormationResponseDto } from "../types/TrainCarFormationResponseDto";
import { ENDPOINTS } from "../../../api/routes";

export function useTrainCar(schedule_cd: string) {
  const { data: trainCarsData } = useSuspenseQuery({
    queryKey: ["ScheduleCd", schedule_cd],
    queryFn: async () => {
      const response = await axios.get<TrainCarFormationResponseDto[]>(
        ENDPOINTS.TRAINCAR(),
        {
          params: {schedule_cd: schedule_cd}
        },
      );
      return response.data;
    },
  });

  return { trainCarsData };
};
