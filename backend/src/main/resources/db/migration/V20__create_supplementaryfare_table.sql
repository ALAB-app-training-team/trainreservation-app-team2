CREATE TABLE M_SupplementaryFareKm
(
    supplementary_fare_cd VARCHAR(5) NOT NULL PRIMARY KEY,
    min_km                INT        NOT NULL,
    max_km                INT        NOT NULL,
    reserved_fare         INT        NOT NULL,
    green_fare            INT        NOT NULL,
    gc_fare               INT        NOT NULL
);

INSERT INTO M_SupplementaryFareKm (supplementary_fare_cd, min_km, max_km, reserved_fare, green_fare, gc_fare)
VALUES ('SF001', 0, 100, 530, 1300, 8300),
       ('SF002', 100, 200, 530, 2800, 9800),
       ('SF003', 200, 400, 530, 4190, 11190),
       ('SF004', 400, 600, 530, 5400, 12400),
       ('SF005', 600, 700, 530, 5600, 12600),
       ('SF006', 700, 1000, 530, 6600, 13600);


