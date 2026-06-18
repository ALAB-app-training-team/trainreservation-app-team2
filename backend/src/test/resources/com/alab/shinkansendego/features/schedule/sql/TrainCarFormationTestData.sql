CREATE TABLE M_TrainCar
(
    train_car_cd     VARCHAR(7) NOT NULL PRIMARY KEY,
    train_series_cd  VARCHAR(5) NOT NULL,
    train_car_number INT        NOT NULL,
    seat_type_cd     VARCHAR(6) NOT NULL,
    UNIQUE (train_series_cd, train_car_number)
);

INSERT INTO M_TrainCar (train_car_cd, train_series_cd, train_car_number, seat_type_cd)
VALUES ('E5SER01', 'E5SER', 1, 'SEAT01'),
       ('E5SER02', 'E5SER', 2, 'SEAT01'),
       ('E5SER03', 'E5SER', 3, 'SEAT02'),
       ('E5SER04', 'E5SER', 4, 'SEAT03');

CREATE TABLE M_TrainSeries
(
    train_series_cd VARCHAR(10) NOT NULL PRIMARY KEY,
    name            VARCHAR(50) NOT NULL
);

CREATE TABLE M_TrainCarType
(
    train_car_type_cd VARCHAR(10) NOT NULL PRIMARY KEY,
    name              VARCHAR(50) NOT NULL
);

CREATE TABLE M_SeatType
(
    seat_type_cd      VARCHAR(10) NOT NULL PRIMARY KEY,
    name              VARCHAR(50) NOT NULL,
    train_car_type_cd VARCHAR(10) NOT NULL
);

CREATE TABLE M_TrainCar
(
    train_car_cd     VARCHAR(20) NOT NULL PRIMARY KEY,
    train_series_cd  VARCHAR(10) NOT NULL,
    train_car_number INT         NOT NULL,
    seat_type_cd     VARCHAR(10) NOT NULL
);

INSERT INTO M_TrainSeries(train_series_cd, name)
VALUES ('E5SER', 'E5系');

INSERT INTO M_TrainCarType(train_car_type_cd, name)
VALUES ('CAR01', '指定席');

INSERT INTO M_SeatType (seat_type_cd, name, train_car_type_cd)
VALUES ('SEAT01', '指定席', 'CAR01');

INSERT
M_TrainCar(train_car_cd, train_series_cd, train_car_number, seat_type_cd)
       VALUES('E5SER01', 'E5SER', 1, 'SEAT01'),
       ('E5SER02', 'E5SER', 2, 'SEAT01')
