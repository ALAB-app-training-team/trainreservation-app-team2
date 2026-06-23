DELETE
FROM T_ReservedSeatSection;


CREATE TABLE T_Purchase
(
    id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ride_date            DATE       NOT NULL,
    schedule_cd          VARCHAR(6) NOT NULL REFERENCES M_Schedule (schedule_cd) ON DELETE CASCADE,
    departure_station_cd VARCHAR(5) NOT NULL REFERENCES M_Station (station_cd) ON DELETE CASCADE,
    arrival_station_cd   VARCHAR(5) NOT NULL REFERENCES M_Station (station_cd) ON DELETE CASCADE,
);

CREATE TABLE T_PurchasedSeat
(
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    purchase_id  UUID       NOT NULL REFERENCES T_Purchase (id) ON DELETE CASCADE,
    train_car_cd VARCHAR(7) NOT NULL REFERENCES M_TrainCar (train_car_cd) ON DELETE CASCADE,
    seat_cd      VARCHAR(9) NOT NULL REFERENCES M_Seat (seat_cd) ON DELETE CASCADE,
);
