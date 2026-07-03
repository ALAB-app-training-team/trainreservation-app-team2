type SelectedSeats = {
    train_car_cd: string;
    seat_cd: string;
};

export type ReserveRequestDto = {
    schedule_cd: string;
    ride_date: string;
    departureStationCd: string;
    arrivalStationCd: string;
    seats: SelectedSeats[];
};
