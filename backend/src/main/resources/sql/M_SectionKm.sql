-- 区間キロ程テーブル
USE
postgres;

CREATE TABLE M_SectionKm
(
    section_cd       VARCHAR(5)    NOT NULL PRIMARY KEY,
    start_station_cd VARCHAR(5)    NOT NULL REFERENCES M_Station (station_cd) ON DELETE CASCADE,
    goal_station_cd  VARCHAR(5)    NOT NULL REFERENCES M_Station (station_cd) ON DELETE CASCADE,
    distance_km      NUMERIC(4, 1) NOT NULL
);
INSERT INTO M_SectionKm (section_cd, start_station_cd, goal_station_cd, distance_km)
VALUES ('THK01', 'THK01', 'THK02', 3.6);
