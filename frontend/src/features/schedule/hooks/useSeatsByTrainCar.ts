import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { ENDPOINTS } from "../../../api/routes";
import type { SeatsResponseDto } from "../types/SeatsResponseDto";

export function useSeatsByTrainCar(trainCarCd: string) {
  // TODO: BEできたらコメントアウト解除する
  //   const { data: seats } = useSuspenseQuery({
  //     queryKey: ["seat", trainCarCd],
  //     queryFn: async () => {
  //       const response = await axios.get<SeatsResponseDto[]>(
  //         ENDPOINTS.SEATS_SELECT(),
  //         {
  //           params: trainCarCd,
  //         },
  //       );
  //       return response.data;
  //     },
  //   });

  const seats = [
    {
      train_car_cd: "E5SER01",
      train_car_number: 1,
      seat_cd: "SEAT01001",
      seat_number: 1,
      seat_row: "A",
    },
    {
      train_car_cd: "E5SER01",
      train_car_number: 1,
      seat_cd: "SEAT01001",
      seat_number: 2,
      seat_row: "A",
    },
    {
      train_car_cd: "E5SER01",
      train_car_number: 1,
      seat_cd: "SEAT01001",
      seat_number: 1,
      seat_row: "B",
    },
    {
      train_car_cd: "E5SER01",
      train_car_number: 1,
      seat_cd: "SEAT01001",
      seat_number: 2,
      seat_row: "B",
    },
    {
      train_car_cd: "E5SER01",
      train_car_number: 1,
      seat_cd: "SEAT01001",
      seat_number: 1,
      seat_row: "",
    },
  ];

  return { seats };
}
