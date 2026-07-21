CREATE TABLE T_Reservation
(
    id                   UUID PRIMARY KEY,
    ride_date            DATE        NOT NULL,
    schedule_cd          VARCHAR(6)  NOT NULL,
    departure_station_cd VARCHAR(5)  NOT NULL,
    arrival_station_cd   VARCHAR(5)  NOT NULL,
    payment_tracking_id  VARCHAR(36) NOT NULL,
    reserver_name        VARCHAR(255),
    reserver_mail        VARCHAR(255)
);
INSERT INTO T_Reservation (id, ride_date, schedule_cd, departure_station_cd, arrival_station_cd, payment_tracking_id,
                           reserver_name, reserver_mail)
VALUES ('4156b939-2e3e-46c1-92d3-7aa64b6ca575', '2026-06-01', 'TEST01', 'EKI01', 'EKI03', '', '山田太郎',
        'email@sample.com');

CREATE TABLE M_DepartureArrivalTime
(
    time_cd        VARCHAR(8) NOT NULL PRIMARY KEY,
    schedule_cd    VARCHAR(6) NOT NULL,
    departure_time TIME       NOT NULL,
    arrival_time   TIME       NOT NULL,
    section_cd     VARCHAR(5) NOT NULL
);
INSERT INTO M_DepartureArrivalTime (time_cd, schedule_cd, departure_time, arrival_time, section_cd)
VALUES ('TEST0101', 'TEST01', '06:00', '06:55', 'SEC01'),
       ('TEST0102', 'TEST01', '07:00', '07:55', 'SEC02'),
       ('TEST0103', 'TEST01', '08:00', '08:55', 'SEC03');

CREATE TABLE M_SectionKm
(
    section_cd       VARCHAR(5)    NOT NULL PRIMARY KEY,
    start_station_cd VARCHAR(5)    NOT NULL,
    goal_station_cd  VARCHAR(5)    NOT NULL,
    distance_km      NUMERIC(4, 1) NOT NULL
);

INSERT INTO M_SectionKm (section_cd, start_station_cd, goal_station_cd, distance_km)
VALUES ('SEC01', 'EKI01', 'EKI02', 99.9),
       ('SEC02', 'EKI02', 'EKI03', 99.9),
       ('SEC03', 'EKI03', 'EKI04', 99.9);

CREATE TABLE M_Station
(
    station_cd VARCHAR(5)   NOT NULL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    UNIQUE (name)
);

INSERT INTO M_Station (station_cd, name)
VALUES ('EKI01', 'TestStation01'),
       ('EKI02', 'TestStation02'),
       ('EKI03', 'TestStation03'),
       ('EKI04', 'TestStation04');

CREATE TABLE M_Schedule
(
    schedule_cd   VARCHAR(6) NOT NULL PRIMARY KEY,
    train_type_cd VARCHAR(5) NOT NULL
);
INSERT INTO M_Schedule (schedule_cd, train_type_cd)
VALUES ('TEST01', 'YM001');

CREATE TABLE M_TrainType
(
    train_type_cd   VARCHAR(5)   NOT NULL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    train_series_cd VARCHAR(5)   NOT NULL
);

INSERT INTO M_TrainType (train_type_cd, name, train_series_cd)
VALUES ('YM001', 'やまびこ1号', 'E5SER');

ALTER TABLE T_Reservation
    ADD CONSTRAINT fk_reservation_schedule
        FOREIGN KEY (schedule_cd)
            REFERENCES M_Schedule (schedule_cd)
            ON DELETE RESTRICT;
ALTER TABLE T_Reservation
    ADD CONSTRAINT fk_reservation_departure_station
        FOREIGN KEY (departure_station_cd)
            REFERENCES M_Station (station_cd)
            ON DELETE RESTRICT;
ALTER TABLE T_Reservation
    ADD CONSTRAINT fk_reservation_arrival_station
        FOREIGN KEY (arrival_station_cd)
            REFERENCES M_Station (station_cd)
            ON DELETE RESTRICT;
ALTER TABLE T_ReservedSeat
    ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;
