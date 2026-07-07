type SelectedSeats = {
    trainCarCd: string;
    seatCd: string;
};

export type ReserveRequestDto = {
    scheduleCd: string;
    rideDate: string;
    departureStationCd: string;
    arrivalStationCd: string;
    seats: SelectedSeats[];
    reserverName: string;
    reserverMail: string;
};
