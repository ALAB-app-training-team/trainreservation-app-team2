CREATE TABLE M_SectionKm
(
    section_cd       VARCHAR(5)    NOT NULL PRIMARY KEY,
    start_station_cd VARCHAR(5)    NOT NULL,
    goal_station_cd  VARCHAR(5)    NOT NULL,
    distance_km      NUMERIC(4, 1) NOT NULL
);

INSERT INTO M_SectionKm (section_cd, start_station_cd, goal_station_cd, distance_km)
VALUES ('TEST1', 'EKI01', 'EKI02', 99.9),
       ('TEST2', 'EKI01', 'EKI03', 88.8),
       ('TEST3', 'EKI02', 'EKI03', 77.7),
       ('TEST4', 'EKI03', 'EKI04', 66.6);