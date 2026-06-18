CREATE TABLE M_TrainSeries
(
    train_series_cd VARCHAR(5)   NOT NULL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL
);

CREATE TABLE M_TrainCarType
(
    train_car_type_cd VARCHAR(5)   NOT NULL PRIMARY KEY,
    name              VARCHAR(255) NOT NULL
);

CREATE TABLE M_TrainType
(
    train_type_cd    VARCHAR(5)   NOT NULL PRIMARY KEY ,
    name             VARCHAR(255) NOT NULL,
    train_series_cd VARCHAR(5)   NOT NULL
);

CREATE TABLE M_SeatType
(
    seat_type_cd      VARCHAR(6)   NOT NULL PRIMARY KEY,
    name              VARCHAR(255) NOT NULL,
    train_car_type_cd VARCHAR(5)   NOT NULL
);

CREATE TABLE M_TrainCar
(
    train_car_cd     VARCHAR(7) NOT NULL PRIMARY KEY,
    train_series_cd  VARCHAR(5) NOT NULL,
    train_car_number INT        NOT NULL,
    seat_type_cd     VARCHAR(6) NOT NULL
);

CREATE TABLE M_Schedule
(
    schedule_cd   VARCHAR(6) NOT NULL PRIMARY KEY,
    train_type_cd VARCHAR(5) NOT NULL
);

INSERT INTO M_TrainSeries(train_series_cd, name)
VALUES ('E5SER', 'E5系');

INSERT INTO M_TrainCarType(train_car_type_cd, name)
VALUES ('CAR01', '指定席');

INSERT INTO M_TrainType(train_type_cd, name, train_series_cd)
VALUES ('YM001', 'やまびこ1号', 'E5SER');

INSERT INTO M_SeatType (seat_type_cd, name, train_car_type_cd)
VALUES ('SEAT01', '指定席', 'CAR01');

INSERT INTO M_Schedule(schedule_cd, train_type_cd)
VALUES ('TEST01', 'YM001');

INSERT INTO M_TrainCar(train_car_cd, train_series_cd, train_car_number, seat_type_cd)
VALUES ('E5SER01', 'E5SER', 1, 'SEAT01'),
       ('E5SER02', 'E5SER', 2, 'SEAT01');