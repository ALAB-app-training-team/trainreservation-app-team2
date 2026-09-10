CREATE TABLE T_SearchHistory
(
    id                      UUID        NOT NULL PRIMARY KEY,
    account_id              UUID        REFERENCES T_Account(id) ON DELETE CASCADE NOT NULL,
    date                    DATE        NOT NULL,
    time                    TIME        NOT NULL,
    departure_station_cd    VARCHAR(5)  REFERENCES M_Station (station_cd) NOT NULL,
    arrival_station_cd      VARCHAR(5)  REFERENCES M_Station (station_cd) NOT NULL,
    is_arrival_time         BOOLEAN     NOT NULL,
    created_at              TIMESTAMP   NOT NULL
);

INSERT INTO T_SearchHistory (id, account_id, date, time, departure_station_cd, arrival_station_cd, is_arrival_time, created_at)
VALUES ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '2026-09-10', '08:30:00', 'Test0', 'Test1', false, '2026-09-10 00:00:00'),
       ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', '2026-09-11', '09:00:00', 'Test2', 'Test3', true, '2026-09-11 00:00:00');
