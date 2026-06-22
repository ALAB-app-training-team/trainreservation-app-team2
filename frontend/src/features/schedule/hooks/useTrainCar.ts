import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import type { TrainCarFormationResponseDto } from "../types/TrainCarFormationResponseDto";
import { ENDPOINTS } from "../../../api/routes";

/*function fetchTrainCar (schedule_cd: TrainCarFormationResponseDto){
  const {data: trainCarsData} = useSuspenseQuery({
    queryKey: ["trainCar", schedule_cd],
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
return {trainCarsData}
};

const MOCK_TRAIN_CARS: TrainCarFormationResponseDto[] = [
  {train_car_number: 1, train_car_cd: "E5SER01", seat_type_cd: "SEAT01", train_car_type_name:12},
  {train_car_number: 2, train_car_cd: "E5SER02", seat_type_cd: "SEAT01", train_car_type_name:45},
  {train_car_number: 3, train_car_cd: "E5SER03", seat_type_cd: "SEAT01", train_car_type_name:0},
  {train_car_number: 4, train_car_cd: "E5SER04", seat_type_cd: "SEAT02", train_car_type_name:8},
  {train_car_number: 5, train_car_cd: "E5SER05", seat_type_cd: "SEAT03", train_car_type_name:2}
];*/

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
