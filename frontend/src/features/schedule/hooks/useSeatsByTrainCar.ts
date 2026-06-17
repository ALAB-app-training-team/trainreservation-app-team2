// import { useSuspenseQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { ENDPOINTS } from "../../../api/routes";
// import type { SeatsResponseDto } from "../types/SeatsResponseDto";

export function useSeatsByTrainCar(trainCarCd: string) {
  // TODO: BEできたらコメントアウト解除する
  //   const { data: seats } = useSuspenseQuery({
  //     queryKey: ["seat", trainCarCd],
  //     queryFn: async () => {
  //       const response = await axios.get<SeatsResponseDto[]>(
  //         ENDPOINTS.SEATS_SELECT(),
  //         {
  //           params: { trainCarCd: trainCarCd },
  //         },
  //       );
  //       return response.data;
  //     },
  //   });
  console.log(trainCarCd);

  const seats = [
    {
      train_car_cd: "E5SER01",
      train_car_number: 1,
      seat_cd: "SEAT01001",
      seat_number: 1,
      seat_column: "A",
    },
    {
      train_car_cd: "E5SER01",
      train_car_number: 1,
      seat_cd: "SEAT01002",
      seat_number: 2,
      seat_column: "A",
    },
    {
      train_car_cd: "E5SER01",
      train_car_number: 1,
      seat_cd: "SEAT01003",
      seat_number: 1,
      seat_column: "B",
    },
    {
      train_car_cd: "E5SER01",
      train_car_number: 1,
      seat_cd: "SEAT01004",
      seat_number: 3,
      seat_column: "B",
    },
    {
      train_car_cd: "E5SER01",
      train_car_number: 1,
      seat_cd: "SEAT01005",
      seat_number: 2,
      seat_column: "C",
    },
  ];

  return { seats };
}
