export type SeatsRequestDto = {
  schedule_cd: string;
  date: string;
  departure_station_cd: string;
  departure_time: string;
  arrival_station_cd: string;
  arrival_time: string;
  train_car_cd: string;
};
