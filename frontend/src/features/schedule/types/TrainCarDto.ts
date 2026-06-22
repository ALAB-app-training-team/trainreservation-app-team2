export type TrainCarDto = {
  train_car_cd: string;
  train_car_number: number;
  seat_type_cd: "SEAT01" | "SEAT02" | "SEAT03";
  availableSeats: number;
};
