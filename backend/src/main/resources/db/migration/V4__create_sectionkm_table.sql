CREATE TABLE M_SectionKm
(
    section_cd       VARCHAR(5)    NOT NULL PRIMARY KEY,
    start_station_cd VARCHAR(5)    NOT NULL REFERENCES M_Station (station_cd) ON DELETE CASCADE,
    goal_station_cd  VARCHAR(5)    NOT NULL REFERENCES M_Station (station_cd) ON DELETE CASCADE,
    distance_km      NUMERIC(4, 1) NOT NULL
);
