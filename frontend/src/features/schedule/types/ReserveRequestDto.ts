type SelectedSeats = {
  train_car_nd: string;
  seat_cd: string;
};

export type ReserveRequestDto = {
  schedule_cd: string;
  date: string;
  departure_station_cd: string;
  arrival_station_cd: string;
  seats: SelectedSeats[];
};
