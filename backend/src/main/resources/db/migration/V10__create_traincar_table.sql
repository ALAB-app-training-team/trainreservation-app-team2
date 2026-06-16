CREATE TABLE M_TrainCar
(
    train_car_cd     VARCHAR(7) NOT NULL PRIMARY KEY,
    train_series_cd  VARCHAR(5) NOT NULL REFERENCES M_TrainSeries (train_series_cd) ON DELETE RESTRICT,
    train_car_number INT        NOT NULL,
    seat_type_cd     VARCHAR(6) NOT NULL REFERENCES M_SeatType (seat_type_cd) ON DELETE RESTRICT,
    UNIQUE (train_series_cd, train_car_number)
);
