CREATE TABLE T_SearchHistory
(
    id                      UUID        NOT NULL PRIMARY KEY,
    account_id              UUID        REFERENCES T_Account(id) ON DELETE CASCADE NOT NULL,
    date                    DATE        NOT NULL,
    time                    TIME        NOT NULL,
    departure_station_cd    VARCHAR(5)  NOT NULL,
    arrival_station_cd      VARCHAR(5)  NOT NULL,
    is_arrival_time         BOOLEAN     NOT NULL,
    create_at               TIMESTAMP   NOT NULL
);
