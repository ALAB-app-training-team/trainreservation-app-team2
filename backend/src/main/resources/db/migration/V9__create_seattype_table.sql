CREATE TABLE M_SeatType
(
    seat_type_cd VARCHAR(6)   NOT NULL PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    car_type_cd  VARCHAR(5)   NOT NULL REFERENCES M_TrainCarType (car_type_cd) ON DELETE RESTRICT
);
