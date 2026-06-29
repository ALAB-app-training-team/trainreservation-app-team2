type SelectedSeats = {
  train_car_cd: string;
  seat_cd: string;
};

export type ReserveRequestDto = {
  schedule_cd: string;
  ride_date: string;
  departure_station_cd: string;
  arrival_station_cd: string;
  seats: SelectedSeats[];
};
