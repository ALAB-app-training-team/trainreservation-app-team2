CREATE TABLE M_ExpressFareKm
(
    express_fare_cd VARCHAR(5) NOT NULL PRIMARY KEY,
    min_km          INT        NOT NULL,
    max_km          INT        NOT NULL,
    express_fare    INT        NOT NULL,
    UNIQUE (min_km, max_km)
);

INSERT INTO M_ExpressFareKm (express_fare_cd, min_km, max_km, express_fare)
VALUES ('EF001', 0, 100, 1870),
       ('EF002', 100, 150, 2300),
       ('EF003', 150, 200, 2640),
       ('EF004', 200, 300, 3530),
       ('EF005', 300, 400, 4300),
       ('EF006', 400, 500, 4840),
       ('EF007', 500, 600, 5170),
       ('EF008', 600, 700, 5540),
       ('EF009', 700, 800, 6070);
