import { useQuery } from "@tanstack/react-query";
//import axios from "axios";
import type { TrainCarDto } from "../types/TrainCarDto";

/*const fetchTrainCar = async (schedule_cd: string): Promise<TrainCarDto[]> => {
  if(!schedule_cd) return [];
  const response = await axios.get<TrainCarDto[]>(`api/shinkansen-traincar/${schedule_cd}`);
  return response.data;
};*/

const MOCK_TRAIN_CARS: TrainCarDto[] = [
  {train_car_number: 1, train_car_cd: "E5SER01", seat_type_cd: "SEAT01", availableSeats:12},
  {train_car_number: 2, train_car_cd: "E5SER02", seat_type_cd: "SEAT01", availableSeats:45},
  {train_car_number: 3, train_car_cd: "E5SER03", seat_type_cd: "SEAT01", availableSeats:0},
  {train_car_number: 4, train_car_cd: "E5SER04", seat_type_cd: "SEAT02", availableSeats:8},
  {train_car_number: 5, train_car_cd: "E5SER05", seat_type_cd: "SEAT03", availableSeats:2}
];

export function useTrainCar(schedule_cd: string){
  const { data: trainCarsData, isLoading, error } = useQuery<TrainCarDto[]>({
    queryKey: ["TrainCars", schedule_cd],
    //queryFn: () => fetchTrainCar(schedule_cd),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return MOCK_TRAIN_CARS;
    },
    enabled: !!schedule_cd
  });

  return{
    trainCarsData,
    isLoading,
    error
  };
}