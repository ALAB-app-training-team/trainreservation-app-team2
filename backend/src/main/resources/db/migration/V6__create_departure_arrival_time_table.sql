CREATE TABLE M_DepartureArrivalTime
(
    time_cd        VARCHAR(8) NOT NULL PRIMARY KEY,
    schedule_cd    VARCHAR(6) NOT NULL REFERENCES M_Schedule (schedule_cd) ON DELETE CASCADE,
    departure_time TIME       NOT NULL,
    arrival_time   TIME       NOT NULL,
    section_cd     VARCHAR(5) NOT NULL REFERENCES M_SectionKm (section_cd) ON DELETE CASCADE
);
