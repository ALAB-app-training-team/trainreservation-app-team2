type SelectedSeat = {
    trainCarCd: string;
    seatCd: string;
    seatFare: number;
};

export type ReserveRequestDto = {
    scheduleCd: string;
    rideDate: string;
    departureStationCd: string;
    arrivalStationCd: string;
    seats: SelectedSeat[];
    reserverName: string;
    reserverMail: string;
    paymentToken: string;
};
