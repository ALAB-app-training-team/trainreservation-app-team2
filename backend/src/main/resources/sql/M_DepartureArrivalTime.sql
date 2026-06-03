-- 発車到着時刻テーブル
USE postgres;

CREATE TABLE M_DepartureArrivalTime(
    time_cd VARCHAR(8) NOT NULL PRIMARY KEY,
    schedule_cd VARCHAR(6) NOT NULL REFERENCES M_Schedule(schedule_cd),
    departure_time time NOT NULL,
    arrival_time time NOT NULL,
    section_cd VARCHAR(5) NOT NULL REFERENCES M_SectionKm(section_cd)
);