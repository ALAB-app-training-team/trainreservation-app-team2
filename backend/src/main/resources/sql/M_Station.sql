-- 新幹線駅テーブル
USE
postgres;

CREATE TABLE M_Station
(
    station_cd VARCHAR(5)   NOT NULL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    UNIQUE (name)
);
INSERT INTO M_Station (station_cd, name)
VALUES ('THK01', '東京'),
       ('THK02', '上野');
