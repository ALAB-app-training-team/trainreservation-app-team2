CREATE TABLE T_ReservedSeatSection
(
    reserved_seat_id    BIGSERIAL  NOT NULL PRIMARY KEY,
    ride_date           DATE       NOT NULL,
    schedule_cd         VARCHAR(6) NOT NULL,
    train_car_cd        VARCHAR(7) NOT NULL,
    seat_cd             VARCHAR(9) NOT NULL,
    reserved_section_cd VARCHAR(5) NOT NULL,
    UNIQUE (ride_date, schedule_cd, train_car_cd, seat_cd, reserved_section_cd)
);

INSERT INTO T_ReservedSeatSection (ride_date, schedule_cd, train_car_cd, seat_cd, reserved_section_cd)
VALUES ('2026-06-01', 'Test01', 'E5SER01', 'SEAT00101', 'Test1'),
       ('2026-06-01', 'Test02', 'E5SER01', 'SEAT00102', 'Test1'),
       ('2026-06-01', 'Test01', 'E5SER01', 'SEAT00103', 'Test2'),
       ('2026-06-01', 'Test01', 'E5SER01', 'SEAT00104', 'Test1'),
       ('2026-06-01', 'Test01', 'E5SER01', 'SEAT00104', 'Test2'),
       ('2026-06-01', 'Test01', 'E6SER01', 'SEAT00105', 'Test2'),
       ('2026-06-02', 'Test01', 'E5SER01', 'SEAT00105', 'Test1');
