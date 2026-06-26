CREATE TABLE M_TrainSeries
(
    train_series_cd VARCHAR(5)   NOT NULL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL
);
INSERT INTO M_TrainSeries (train_series_cd, name)
VALUES ('E5SER', 'E5系');

CREATE TABLE M_TrainType
(
    train_type_cd   VARCHAR(5)   NOT NULL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    train_series_cd VARCHAR(5)   NOT NULL REFERENCES M_TrainSeries (train_series_cd) ON DELETE RESTRICT
);
INSERT INTO M_TrainType (train_type_cd, name, train_series_cd)
VALUES ('YM001', 'やまびこ11号', 'E5SER');

CREATE TABLE M_Schedule
(
    schedule_cd   VARCHAR(6) NOT NULL PRIMARY KEY,
    train_type_cd VARCHAR(5) NOT NULL REFERENCES M_TrainType (train_type_cd)
);
INSERT INTO M_Schedule (schedule_cd, train_type_cd)
VALUES ('TEST01', 'YM001');

CREATE TABLE M_Station
(
    station_cd VARCHAR(5)   NOT NULL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    UNIQUE (name)
);
INSERT INTO M_Station (station_cd, name)
VALUES ('Test0', 'TestStation00'),
       ('Test1', 'TestStation01');

CREATE TABLE M_TrainCarType
(
    train_car_type_cd VARCHAR(5)   NOT NULL PRIMARY KEY,
    name              VARCHAR(255) NOT NULL UNIQUE
);
INSERT INTO M_TrainCarType (train_car_type_cd, name)
VALUES ('CAR01', '指定席');

CREATE TABLE M_SeatType
(
    seat_type_cd      VARCHAR(6)   NOT NULL PRIMARY KEY,
    name              VARCHAR(255) NOT NULL,
    train_car_type_cd VARCHAR(5)   NOT NULL REFERENCES M_TrainCarType (train_car_type_cd) ON DELETE RESTRICT
);
INSERT INTO M_SeatType (seat_type_cd, name, train_car_type_cd)
VALUES ('SEAT01', '指定席構成', 'CAR01');

CREATE TABLE M_TrainCar
(
    train_car_cd     VARCHAR(7) NOT NULL PRIMARY KEY,
    train_series_cd  VARCHAR(5) NOT NULL REFERENCES M_TrainSeries (train_series_cd) ON DELETE RESTRICT,
    train_car_number INT        NOT NULL,
    seat_type_cd     VARCHAR(6) NOT NULL REFERENCES M_SeatType (seat_type_cd) ON DELETE RESTRICT,
    UNIQUE (train_series_cd, train_car_number)
);
INSERT INTO M_TrainCar (train_car_cd, train_series_cd, train_car_number, seat_type_cd)
VALUES ('E5SER01', 'E5SER', 1, 'SEAT01');

CREATE TABLE M_Seat
(
    seat_cd      VARCHAR(9) NOT NULL PRIMARY KEY,
    seat_type_cd VARCHAR(6) NOT NULL REFERENCES M_SeatType (seat_type_cd) ON DELETE CASCADE,
    seat_number  INT        NOT NULL,
    seat_column  VARCHAR(1) NOT NULL,
    UNIQUE (seat_type_cd, seat_number, seat_column)
);
INSERT INTO M_Seat (seat_cd, seat_type_cd, seat_number, seat_column)
VALUES ('SEAT01001', 'SEAT01', 1, 'A'),
       ('SEAT01002', 'SEAT01', 1, 'B');

CREATE TABLE T_Purchase
(
    id                   UUID PRIMARY KEY,
    ride_date            DATE       NOT NULL,
    schedule_cd          VARCHAR(6) NOT NULL REFERENCES M_Schedule (schedule_cd) ON DELETE RESTRICT,
    departure_station_cd VARCHAR(5) NOT NULL REFERENCES M_Station (station_cd) ON DELETE RESTRICT,
    arrival_station_cd   VARCHAR(5) NOT NULL REFERENCES M_Station (station_cd) ON DELETE RESTRICT
);
INSERT INTO T_Purchase (id, ride_date, schedule_cd, departure_station_cd, arrival_station_cd)
VALUES ('123e4567-e89b-12d3-a456-426614174000', '2026-06-30', 'TEST01', 'Test0', 'Test1');

CREATE TABLE T_PurchasedSeat
(
    id           UUID PRIMARY KEY,
    purchase_id  UUID       NOT NULL REFERENCES T_Purchase (id) ON DELETE CASCADE,
    train_car_cd VARCHAR(7) NOT NULL REFERENCES M_TrainCar (train_car_cd) ON DELETE RESTRICT,
    seat_cd      VARCHAR(9) NOT NULL REFERENCES M_Seat (seat_cd) ON DELETE RESTRICT,
    code_token   UUID       NOT NULL UNIQUE,
    UNIQUE (purchase_id, train_car_cd, seat_cd)
);
