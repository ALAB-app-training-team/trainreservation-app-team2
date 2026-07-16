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
VALUES ('Test01', 'YM001');

CREATE TABLE M_Station
(
    station_cd VARCHAR(5)   NOT NULL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    UNIQUE (name)
);
INSERT INTO M_Station (station_cd, name)
VALUES ('Test0', 'TestStation00'),
       ('Test1', 'TestStation01'),
       ('Test2', 'TestStation02');

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
VALUES ('SEAT00101', 'SEAT01', 1, 'A'),
       ('SEAT00102', 'SEAT01', 1, 'B'),
       ('SEAT00103', 'SEAT01', 1, 'C'),
       ('SEAT00104', 'SEAT01', 1, 'D'),
       ('SEAT00105', 'SEAT01', 1, 'E'),
       ('SEAT00106', 'SEAT01', 2, 'A'),
       ('SEAT00107', 'SEAT01', 2, 'B');


CREATE TABLE T_Reservation
(
    id                   UUID PRIMARY KEY,
    ride_date            DATE        NOT NULL,
    schedule_cd          VARCHAR(6)  NOT NULL REFERENCES M_Schedule (schedule_cd) ON DELETE RESTRICT,
    departure_station_cd VARCHAR(5)  NOT NULL REFERENCES M_Station (station_cd) ON DELETE RESTRICT,
    arrival_station_cd   VARCHAR(5)  NOT NULL REFERENCES M_Station (station_cd) ON DELETE RESTRICT,
    payment_tracking_id  VARCHAR(36) NOT NULL,
    reserver_name        VARCHAR(255),
    reserver_mail        VARCHAR(255)
);
INSERT INTO T_Reservation (id, ride_date, schedule_cd, departure_station_cd, arrival_station_cd, payment_tracking_id)
VALUES ('123e4567-e89b-12d3-a456-426614174000', '2026-06-30', 'Test01', 'Test0', 'Test1', 'Test2');

CREATE TABLE M_SectionKm
(
    section_cd       VARCHAR(5)    NOT NULL PRIMARY KEY,
    start_station_cd VARCHAR(5)    NOT NULL,
    goal_station_cd  VARCHAR(5)    NOT NULL,
    distance_km      NUMERIC(4, 1) NOT NULL
);

INSERT INTO M_SectionKm (section_cd, start_station_cd, goal_station_cd, distance_km)
VALUES ('Test1', 'Test0', 'Test1', 99.9),
       ('Test2', 'Test2', 'Test3', 88.8);

CREATE TABLE T_ReservedSeatSection
(
    reserved_seat_id    BIGSERIAL  NOT NULL PRIMARY KEY,
    ride_date           DATE       NOT NULL,
    schedule_cd         VARCHAR(6) NOT NULL,
    train_car_cd        VARCHAR(7) NOT NULL,
    seat_cd             VARCHAR(9) NOT NULL,
    reserved_section_cd VARCHAR(5) NOT NULL,
    UNIQUE (ride_date, schedule_cd, train_car_cd, seat_cd, reserved_section_cd)
);
ALTER TABLE T_ReservedSeatSection DROP COLUMN reserved_seat_id;
ALTER TABLE T_ReservedSeatSection
    ADD COLUMN id UUID PRIMARY KEY;
ALTER TABLE T_ReservedSeatSection
    ADD COLUMN reservation_id UUID NOT NULL REFERENCES T_Reservation (id) ON DELETE CASCADE;

INSERT INTO T_ReservedSeatSection (id, reservation_id, ride_date, schedule_cd, train_car_cd, seat_cd,
                                   reserved_section_cd)
VALUES ('123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', '2026-06-01', 'Test01',
        'E5SER01', 'SEAT00101', 'Test1'),
       ('123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', '2026-06-01', 'Test02',
        'E5SER01', 'SEAT00102', 'Test1'),
       ('123e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174000', '2026-06-01', 'Test01',
        'E5SER01', 'SEAT00103', 'Test2'),
       ('123e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174000', '2026-06-01', 'Test01',
        'E5SER01', 'SEAT00104', 'Test1'),
       ('123e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174000', '2026-06-01', 'Test01',
        'E5SER01', 'SEAT00104', 'Test2'),
       ('123e4567-e89b-12d3-a456-426614174005', '123e4567-e89b-12d3-a456-426614174000', '2026-06-01', 'Test01',
        'E6SER01', 'SEAT00105', 'Test2'),
       ('123e4567-e89b-12d3-a456-426614174006', '123e4567-e89b-12d3-a456-426614174000', '2026-06-02', 'Test01',
        'E5SER01', 'SEAT00105', 'Test1');
