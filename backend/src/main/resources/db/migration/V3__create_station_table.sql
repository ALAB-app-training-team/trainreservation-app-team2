CREATE TABLE M_Station
(
    station_cd VARCHAR(5)   NOT NULL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    UNIQUE (name)
);
