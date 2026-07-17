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
