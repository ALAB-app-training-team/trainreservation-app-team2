CREATE TABLE M_Station
(
    station_cd VARCHAR(5)   NOT NULL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    UNIQUE (name)
);

INSERT INTO M_Station (station_cd, name)
VALUES ('Test1', 'TestStation01'),
       ('Test2', 'TestStation02');
