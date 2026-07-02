export type ReservationListResponseDto = {
  train_car_number: number;//号車番号
  seat_number: number;
  seat_column: string;
  train_type_name: string;//やまびこ1号
  departure_time: string;
  departure_station_name: string;
  arrival_station_name: string;
  ride_date: string;
};
