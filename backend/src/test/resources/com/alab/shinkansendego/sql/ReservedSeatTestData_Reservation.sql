CREATE TABLE T_ReservedSeat
(
    id             UUID PRIMARY KEY,
    reservation_id UUID       NOT NULL,
    train_car_cd   VARCHAR(7) NOT NULL,
    seat_cd        VARCHAR(9) NOT NULL,
    code_token     UUID       NOT NULL,
    seat_fare      INTEGER    NOT NULL
);

INSERT INTO T_ReservedSeat (id, reservation_id, train_car_cd, seat_cd, code_token, seat_fare)
VALUES ('e192e5f1-318e-4d10-b76d-2f2bf15e8b70', '4156b939-2e3e-46c1-92d3-7aa64b6ca575', 'E5SER01', 'SEAT01001',
        'fe529692-fbac-4332-b70f-263ab1c1e216', 5000),
       ('5372aad0-6dfd-41d9-a7dc-39e8af644253', '4156b939-2e3e-46c1-92d3-7aa64b6ca575', 'E5SER02', 'SEAT02001',
        '510b8d7b-b954-4220-be15-5b1648e36db5', 10000),
       ('e6734d0b-a178-4b6c-b52c-f48942e8e74f', '4156b939-2e3e-46c1-92d3-7aa64b6ca575', 'E5SER03', 'SEAT03001',
        'a1d64fbb-6f6e-4533-8e99-898ce9dea677', 15000);

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
       ('E5SER02', 'E5SER', 2, 'SEAT02'),
       ('E5SER03', 'E5SER', 3, 'SEAT03');

CREATE TABLE M_Seat
(
    seat_cd      VARCHAR(9) NOT NULL PRIMARY KEY,
    seat_type_cd VARCHAR(6) NOT NULL,
    seat_number  INT        NOT NULL,
    seat_column  VARCHAR(1) NOT NULL,
    UNIQUE (seat_type_cd, seat_number, seat_column)
);

INSERT INTO M_Seat (seat_cd, seat_type_cd, seat_number, seat_column)
VALUES ('SEAT01001', 'SEAT01', 1, 'A'),
       ('SEAT02001', 'SEAT02', 2, 'B'),
       ('SEAT03001', 'SEAT03', 3, 'C');

CREATE TABLE M_SeatType
(
    seat_type_cd      VARCHAR(6)   NOT NULL PRIMARY KEY,
    name              VARCHAR(255) NOT NULL,
    train_car_type_cd VARCHAR(5)   NOT NULL
);

INSERT INTO M_SeatType (seat_type_cd, name, train_car_type_cd)
VALUES ('SEAT01', '指定席構成', 'CAR01'),
       ('SEAT02', 'グリーン車構成', 'CAR02'),
       ('SEAT03', 'グランクラス構成', 'CAR03');

CREATE TABLE M_TrainCarType
(
    train_car_type_cd VARCHAR(5)   NOT NULL PRIMARY KEY,
    name              VARCHAR(255) NOT NULL
);

INSERT INTO M_TrainCarType(train_car_type_cd, name)
VALUES ('CAR01', '指定席'),
       ('CAR02', 'グリーン車'),
       ('CAR03', 'グランクラス');
